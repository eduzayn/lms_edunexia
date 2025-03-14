"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { UserStats } from "../../../components/ai/user-stats";
import { ChatMessage } from "../../../components/ai/chat-message";
import { ContentViewer } from "../../../components/ai/content-viewer";
import { ConversationHistory } from "../../../components/ai/conversation-history";

// Mock data for development and build
const mockUserStats = {
  questionsAnswered: 42,
  materialsGenerated: 15,
  timeSaved: 180,
};

const mockMessages = [
  { role: "assistant", content: "Olá! Eu sou a Prof. Ana, sua tutora de IA. Como posso ajudar você hoje?" },
  { role: "user", content: "Pode me explicar o conceito de fotossíntese?" },
  { role: "assistant", content: "Claro! A fotossíntese é o processo pelo qual plantas, algas e algumas bactérias convertem luz solar, água e dióxido de carbono em glicose e oxigênio. É um processo fundamental para a vida na Terra, pois produz oxigênio e serve como base da cadeia alimentar." }
];

export default function AITutorClient() {
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState(mockMessages);
  const [userStats, setUserStats] = React.useState(mockUserStats);
  const [activeTab, setActiveTab] = React.useState('chat');
  const [contentType, setContentType] = React.useState('summary');
  const [generatedContent, setGeneratedContent] = React.useState(null);
  const [conversations, setConversations] = React.useState([
    { id: "1", title: "Fotossíntese e respiração celular", created_at: "2023-05-15T14:30:00Z" },
    { id: "2", title: "Leis de Newton e aplicações", created_at: "2023-05-10T09:15:00Z" }
  ]);
  
  const messagesEndRef = React.useRef(null);
  
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { 
        role: "assistant", 
        content: "Esta é uma resposta simulada para fins de desenvolvimento. Em um ambiente de produção, isso seria conectado a um serviço de IA real." 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Update stats
      setUserStats(prev => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1
      }));
    }, 1500);
  };
  
  const handleGenerateContent = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Simulate content generation
    setTimeout(() => {
      const content = {
        title: "Resumo sobre " + (messages[1]?.content || "o tópico"),
        content: "Este é um conteúdo simulado para fins de desenvolvimento. Em um ambiente de produção, isso seria gerado por um serviço de IA com base na conversa.",
        type: contentType === 'mindmap' ? 'mindmap' : 
              contentType === 'flashcards' ? 'flashcards' : 'text'
      };
      
      setGeneratedContent(content);
      setIsLoading(false);
      setActiveTab('materials');
      
      // Update stats
      setUserStats(prev => ({
        ...prev,
        materialsGenerated: prev.materialsGenerated + 1,
        timeSaved: prev.timeSaved + 15
      }));
    }, 2000);
  };
  
  const handleSelectConversation = (conversationId) => {
    // Simulate loading a conversation
    setIsLoading(true);
    
    setTimeout(() => {
      const formattedMessages = [
        { role: "assistant", content: "Olá! Eu sou a Prof. Ana, sua tutora de IA. Como posso ajudar você hoje?" },
        { role: "user", content: "Pode me explicar o conceito de " + (conversationId === "1" ? "fotossíntese" : "leis de Newton") + "?" },
        { role: "assistant", content: "Esta é uma conversa carregada do histórico para fins de demonstração." }
      ];
      
      setMessages(formattedMessages);
      setActiveTab('chat');
      setIsLoading(false);
    }, 1000);
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
                      onChange={(e) => setContentType(e.target.value)}
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
