'use client';

import * as React from "react";
import { Container } from "../../../components/ui/container";
import { Section, SectionTitle, SectionDescription } from "../../../components/ui/section";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ChatMessage } from "../../../components/ai/chat-message";
import { ConversationHistory } from "../../../components/ai/conversation-history";
import { UserStats } from "../../../components/ai/user-stats";
import { ContentViewer } from "../../../components/ai/content-viewer";
import { createClient } from "@supabase/supabase-js";
import { aiService } from "../../../lib/services/ai-service";

export default function StudentAITutorPage() {
  const [supabase, setSupabase] = React.useState<any>(null);
  const [user, setUser] = React.useState<any>(null);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<{ role: 'assistant' | 'user'; content: string }[]>([
    { role: 'assistant', content: 'Olá! Sou a Prof. Ana, sua tutora de IA. Como posso ajudar com seus estudos hoje?' }
  ]);
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState({
    questionsAnswered: 0,
    materialsGenerated: 0,
    timeSaved: 0
  });
  const [activeContent, setActiveContent] = React.useState<{
    title: string;
    content: string;
    type: 'text' | 'mindmap' | 'flashcards';
  } | null>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Initialize Supabase client
  React.useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    setSupabase(supabaseClient);
    
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    
    getUser();
  }, []);

  // Fetch user's conversation history and stats
  React.useEffect(() => {
    if (user && supabase) {
      fetchConversations();
      fetchUserStats();
    }
  }, [user, supabase]);

  // Scroll to bottom of chat when messages change
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai.conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const userStats = await aiService.getUserAIStats(user.id);
      
      setStats({
        questionsAnswered: userStats.questions_answered || 0,
        materialsGenerated: userStats.materials_generated || 0,
        timeSaved: userStats.time_saved || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await aiService.generateTutorResponse(input, undefined, user?.id);
      const assistantMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Refresh conversations and stats
      if (user) {
        fetchConversations();
        fetchUserStats();
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, encontrei um erro ao gerar uma resposta. Por favor, tente novamente.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMaterial = async (type: string) => {
    if (loading) return;
    
    setLoading(true);
    let prompt = '';
    let title = '';
    let contentType: 'text' | 'mindmap' | 'flashcards' = 'text';
    
    switch (type) {
      case 'summary':
        prompt = 'Por favor, gere um resumo sobre o último tópico que discutimos.';
        title = 'Resumo';
        contentType = 'text';
        break;
      case 'mindmap':
        prompt = 'Por favor, crie um mapa mental sobre o último tópico que discutimos.';
        title = 'Mapa Mental';
        contentType = 'mindmap';
        break;
      case 'flashcards':
        prompt = 'Por favor, gere flashcards para estudo sobre o último tópico que discutimos.';
        title = 'Flashcards';
        contentType = 'flashcards';
        break;
      case 'explain':
        prompt = 'Por favor, explique em detalhes o último conceito que discutimos.';
        title = 'Explicação de Conceito';
        contentType = 'text';
        break;
      case 'study':
        prompt = 'Por favor, crie um material de estudo completo sobre o último tópico que discutimos.';
        title = 'Material de Estudo';
        contentType = 'text';
        break;
    }
    
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Update user AI stats for material generation
      if (user) {
        await aiService.updateUserAIStats(user.id, 'materials_generated');
        await aiService.updateUserAIStats(user.id, 'time_saved');
      }
      
      const response = await aiService.generateTutorResponse(prompt, undefined, user?.id);
      const assistantMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Set active content for viewing
      setActiveContent({
        title,
        content: response,
        type: contentType
      });
      
      // Refresh conversations and stats
      if (user) {
        fetchConversations();
        fetchUserStats();
      }
    } catch (error) {
      console.error('Error generating material:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, encontrei um erro ao gerar o material. Por favor, tente novamente.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const messages = await aiService.getConversation(conversationId);
      
      if (messages && messages.length > 0) {
        setMessages(messages.map(msg => ({
          role: msg.role as 'assistant' | 'user',
          content: msg.content
        })));
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Prof. Ana - Tutora de IA</h1>
          <p className="text-muted-foreground">Assistente inteligente para seus estudos</p>
        </div>

        <UserStats 
          questionsAnswered={stats.questionsAnswered}
          materialsGenerated={stats.materialsGenerated}
          timeSaved={stats.timeSaved}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-12">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Prof. Ana</CardTitle>
                <CardDescription>Faça perguntas sobre qualquer tópico dos seus cursos</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div 
                  ref={chatContainerRef}
                  className="bg-muted/30 rounded-md p-4 h-[400px] overflow-y-auto mb-4"
                >
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <ChatMessage 
                        key={index} 
                        role={message.role} 
                        content={message.content} 
                      />
                    ))}
                    {loading && (
                      <div className="flex justify-center">
                        <div className="animate-pulse text-muted-foreground">
                          Gerando resposta...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite sua pergunta..."
                    className="flex-grow p-2 border rounded-md"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={loading}
                  />
                  <Button onClick={handleSendMessage} disabled={loading}>
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Ferramentas de IA</CardTitle>
                <CardDescription>Recursos inteligentes para seus estudos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateMaterial('summary')}
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Gerar Resumo
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateMaterial('mindmap')}
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Criar Mapa Mental
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateMaterial('flashcards')}
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M12 8v8" />
                      <path d="M8 12h8" />
                    </svg>
                    Gerar Flashcards
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateMaterial('explain')}
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Explicar Conceito
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleGenerateMaterial('study')}
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                    Criar Material de Estudo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {activeContent && (
          <div className="mb-12">
            <ContentViewer
              title={activeContent.title}
              content={activeContent.content}
              type={activeContent.type}
            />
          </div>
        )}

        <Section>
          <SectionTitle>Histórico de Interações</SectionTitle>
          <SectionDescription>Suas conversas recentes com a Prof. Ana</SectionDescription>
          
          <ConversationHistory 
            conversations={conversations}
            onSelect={loadConversation}
          />
        </Section>
      </Container>
    </div>
  );
}
