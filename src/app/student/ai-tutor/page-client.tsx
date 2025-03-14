"use client";

import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ChatMessage } from "../../../components/ai/chat-message";
import { ConversationHistory } from "../../../components/ai/conversation-history";
import { UserStats } from "../../../components/ai/user-stats";
import { ContentViewer } from "../../../components/ai/content-viewer";
import { AIService } from "../../../lib/services/ai-service";

export default function AITutorClient() {
  const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userStats, setUserStats] = React.useState({
    questionsAnswered: 0,
    materialsGenerated: 0,
    timeSaved: 0,
  });
  const [conversations, setConversations] = React.useState<Array<{id: string; title: string; created_at: string}>>([]);
  const [activeTab, setActiveTab] = React.useState<'chat' | 'history' | 'materials'>('chat');
  const [generatedContent, setGeneratedContent] = React.useState<{
    title: string;
    content: string;
    type: 'text' | 'mindmap' | 'flashcards';
  } | null>(null);
  const [contentType, setContentType] = React.useState<'summary' | 'mindmap' | 'flashcards' | 'explanation'>('summary');
  // Map content types to difficulty levels for the AI service
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const supabase = React.useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);
  
  // Get AIService instance using the getInstance method with error handling
  const aiService = React.useMemo(() => {
    try {
      return AIService.getInstance();
    } catch (error) {
      console.error("Error initializing AI service:", error);
      return {
        getUserAIStats: () => ({ questions_answered: 0, materials_generated: 0, time_saved: 0 }),
        getUserConversations: () => [],
        generateTutorResponse: () => "Serviço de IA indisponível no momento. Por favor, tente novamente mais tarde.",
        generateStudyMaterial: () => "Serviço de IA indisponível no momento.",
        updateUserAIStats: () => Promise.resolve(),
        getConversation: () => []
      };
    }
  }, []);
  
  // Scroll to bottom of messages
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Get user ID and stats
  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        try {
          const stats = await aiService.getUserAIStats(user.id);
          setUserStats({
            questionsAnswered: stats.questions_answered,
            materialsGenerated: stats.materials_generated,
            timeSaved: stats.time_saved
          });
          
          const userConversations = await aiService.getUserConversations(user.id);
          setConversations(userConversations);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    getUser();
  }, [supabase, aiService]);
  
  // Add initial welcome message
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Olá! Eu sou a Prof. Ana, sua tutora de IA. Como posso ajudar você hoje? Posso responder perguntas, criar materiais de estudo, ou ajudar com seus estudos de outras formas.'
        }
      ]);
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    
    try {
      // Get context from previous messages
      const context = messages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n');
      
      // Get response from AI
      const response = await aiService.generateTutorResponse(userMessage, context, userId || undefined);
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      // Update stats locally
      setUserStats(prev => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1
      }));
      
      // Refresh conversation list if user is logged in
      if (userId) {
        const userConversations = await aiService.getUserConversations(userId);
        setConversations(userConversations);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, encontrei um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateContent = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Get the last few messages for context - not used in current implementation
      // const recentMessages = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
      
      // Extract topic from recent messages
      const topic = messages.length > 1 ? messages[messages.length - 2].content : "tópico geral";
      
      // Generate content based on type
      const content = await aiService.generateStudyMaterial(
        topic, 
        contentType === 'summary' ? 'beginner' : 
        contentType === 'mindmap' ? 'intermediate' : 'advanced'
      );
      
      // Set generated content
      setGeneratedContent({
        title: `${contentType === 'summary' ? 'Resumo' : 
                contentType === 'mindmap' ? 'Mapa Mental' : 
                contentType === 'flashcards' ? 'Flashcards' : 'Explicação'} - ${topic.substring(0, 30)}...`,
        content,
        type: contentType === 'flashcards' ? 'flashcards' : 
              contentType === 'mindmap' ? 'mindmap' : 'text'
      });
      
      // Switch to materials tab
      setActiveTab('materials');
      
      // Update stats
      if (userId) {
        await aiService.updateUserAIStats(userId, 'materials_generated');
        await aiService.updateUserAIStats(userId, 'time_saved');
        
        // Refresh stats
        const stats = await aiService.getUserAIStats(userId);
        setUserStats({
          questionsAnswered: stats.questions_answered,
          materialsGenerated: stats.materials_generated,
          timeSaved: stats.time_saved
        });
      } else {
        // Update local stats
        setUserStats(prev => ({
          ...prev,
          materialsGenerated: prev.materialsGenerated + 1,
          timeSaved: prev.timeSaved + 15
        }));
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, encontrei um erro ao gerar o material de estudo. Por favor, tente novamente mais tarde.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectConversation = async (conversationId: string) => {
    try {
      const conversationMessages = await aiService.getConversation(conversationId);
      
      if (conversationMessages.length > 0) {
        // Format messages for display
        const formattedMessages = conversationMessages.map(msg => ({
          // Use type assertion to handle potential missing properties
          role: (msg as any).role as 'user' | 'assistant',
          content: (msg as any).content as string
        }));
        
        setMessages(formattedMessages);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Prof. Ana - Sua Tutora de IA</h1>
      
      {/* User Stats */}
      <div className="mb-6">
        <UserStats 
          questionsAnswered={userStats.questionsAnswered}
          materialsGenerated={userStats.materialsGenerated}
          timeSaved={userStats.timeSaved}
        />
      </div>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'chat' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'materials' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materiais
        </button>
      </div>
      
      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Conversa com Prof. Ana</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <ChatMessage 
                      key={index} 
                      role={message.role} 
                      content={message.content} 
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 border rounded-md"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar"}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Gerar Material</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Material</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as 'summary' | 'mindmap' | 'flashcards' | 'explanation')}
                      className="w-full px-3 py-2 border rounded-md"
                      disabled={isLoading}
                    >
                      <option value="summary">Resumo</option>
                      <option value="mindmap">Mapa Mental</option>
                      <option value="flashcards">Flashcards</option>
                      <option value="explanation">Explicação Detalhada</option>
                    </select>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={isLoading || messages.length <= 1}
                    className="w-full"
                  >
                    {isLoading ? "Gerando..." : "Gerar Material"}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    Gere materiais de estudo baseados na sua conversa com a Prof. Ana.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Histórico de Conversas</h2>
          
          {conversations.length > 0 ? (
            <ConversationHistory 
              conversations={conversations} 
              onSelect={handleSelectConversation} 
            />
          ) : (
            <p className="text-muted-foreground">
              Nenhuma conversa salva ainda. Converse com a Prof. Ana para começar a salvar seu histórico.
            </p>
          )}
        </div>
      )}
      
      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Materiais Gerados</h2>
          
          {generatedContent ? (
            <ContentViewer 
              title={generatedContent.title}
              content={generatedContent.content}
              type={generatedContent.type}
            />
          ) : (
            <p className="text-muted-foreground">
              Nenhum material gerado ainda. Use a opção &quot;Gerar Material&quot; durante uma conversa para criar materiais de estudo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
