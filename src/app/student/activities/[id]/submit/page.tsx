import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

export default function ActivitySubmitPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link
          href={`/student/activities/${params.id}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para atividade</span>
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Enviar Resposta</h1>
        <p className="text-muted-foreground">
          Fotossíntese: Processo e Importância • Biologia
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="border rounded-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Descrição da Atividade</h2>
          <div className="prose max-w-none">
            <p>
              Explique o processo de fotossíntese, identificando os componentes necessários, 
              as etapas principais e sua importância para os ecossistemas.
            </p>
            <p>
              Sua resposta deve abordar:
            </p>
            <ul>
              <li>Os componentes necessários para a fotossíntese</li>
              <li>As principais etapas do processo</li>
              <li>A equação química da fotossíntese</li>
              <li>A importância da fotossíntese para os ecossistemas</li>
            </ul>
            <p>
              Escreva entre 200 e 500 palavras. Utilize suas próprias palavras e evite copiar 
              diretamente de fontes externas.
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Sua Resposta</h2>
          <div className="border rounded-md p-4">
            <textarea
              className="w-full min-h-[300px] p-2 border rounded-md"
              placeholder="Digite sua resposta aqui..."
            ></textarea>
            
            <div className="mt-4 bg-muted/20 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                  A
                </div>
                <p className="font-medium">Prof. Ana - Tutora de IA</p>
              </div>
              <p className="text-sm">
                Ao enviar sua resposta, você receberá um feedback detalhado da Prof. Ana, 
                que analisará seu texto e fornecerá sugestões personalizadas para melhorar 
                seu aprendizado.
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mínimo: 200 palavras • Máximo: 500 palavras
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md hover:bg-muted"
                >
                  Salvar Rascunho
                </button>
                
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  <span>Enviar e Receber Feedback</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
