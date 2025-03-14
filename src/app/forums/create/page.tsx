import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, HelpCircle } from "lucide-react";
import { PostEditor } from "../../../components/forums/post-editor";

export default function CreateTopicPage({ searchParams = {} }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const forumId = (searchParams as any).forumId || "1";
  
  // Mock data for forum
  const forum = {
    id: forumId,
    title: forumId === "1" ? "Fórum Geral" : 
           forumId === "2" ? "Biologia Celular: Fundamentos" :
           forumId === "3" ? "Matemática Avançada" : "Programação Web",
    description: "Discussões sobre o curso, dúvidas e compartilhamento de materiais complementares."
  };
  
  const handleSubmit = async (content: string) => {
    console.log("Submitting topic:", {
      title: document.getElementById("topic-title") as HTMLInputElement,
      content
    });
    
    // In a real implementation, this would send the topic to the server
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link
          href={`/forums/list/${forumId}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para {forum.title}</span>
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Novo Tópico</h1>
        <p className="text-muted-foreground">
          Inicie uma nova discussão no fórum {forum.title}
        </p>
      </div>
      
      <div className="border rounded-md overflow-hidden mb-8">
        <div className="p-4 bg-muted">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">{forum.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {forum.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="topic-title" className="block text-sm font-medium mb-1">
            Título do Tópico <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="topic-title"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Digite um título claro e descritivo"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Um bom título ajuda outros usuários a encontrar e entender sua pergunta.
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">
              Conteúdo <span className="text-red-500">*</span>
            </label>
            
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <HelpCircle className="h-3 w-3" />
              <span>Dicas para uma boa pergunta</span>
            </button>
          </div>
          
          <PostEditor
            placeholder="Descreva sua pergunta ou tópico em detalhes..."
            submitLabel="Criar Tópico"
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
