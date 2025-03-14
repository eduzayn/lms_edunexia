import * as React from "react";
import { FeedbackDisplay } from "../../../../../components/student/feedback-display";

// This would be fetched from the API in a real implementation
const mockFeedback = {
  feedback: `# Avaliação da Atividade

Sua resposta demonstra um bom entendimento dos conceitos básicos de fotossíntese, abordando os principais componentes e processos envolvidos. Você apresentou uma explicação clara do processo geral, mas há oportunidades para aprofundar alguns aspectos e melhorar a precisão científica em certos pontos.

## Pontos fortes:

1. Boa estrutura geral da resposta, com introdução, desenvolvimento e conclusão.
2. Identificação correta dos principais componentes necessários para a fotossíntese (luz solar, água, dióxido de carbono).
3. Menção à clorofila como pigmento essencial para o processo.
4. Compreensão básica da transformação de energia solar em energia química.
5. Reconhecimento da importância da fotossíntese para o ecossistema global.

## Áreas para melhoria:

1. Aprofundar a explicação das fases da fotossíntese (fase clara/fotoquímica e fase escura/ciclo de Calvin).
2. Incluir mais detalhes sobre o papel específico das organelas celulares, especialmente os cloroplastos.
3. Explicar com mais precisão a equação química da fotossíntese, incluindo os coeficientes corretos.
4. Mencionar o destino dos produtos da fotossíntese na planta (como são utilizados para crescimento, armazenamento, etc.).

## Nota: 7.5/10

Continue estudando este tema fascinante! Sugiro revisar especificamente as duas fases da fotossíntese e como elas se conectam. Você está no caminho certo e demonstra bom potencial para aprofundar seu conhecimento em biologia vegetal.`,
  score: 7.5,
  strengths: [
    "Boa estrutura geral da resposta, com introdução, desenvolvimento e conclusão.",
    "Identificação correta dos principais componentes necessários para a fotossíntese (luz solar, água, dióxido de carbono).",
    "Menção à clorofila como pigmento essencial para o processo.",
    "Compreensão básica da transformação de energia solar em energia química.",
    "Reconhecimento da importância da fotossíntese para o ecossistema global."
  ],
  improvements: [
    "Aprofundar a explicação das fases da fotossíntese (fase clara/fotoquímica e fase escura/ciclo de Calvin).",
    "Incluir mais detalhes sobre o papel específico das organelas celulares, especialmente os cloroplastos.",
    "Explicar com mais precisão a equação química da fotossíntese, incluindo os coeficientes corretos.",
    "Mencionar o destino dos produtos da fotossíntese na planta (como são utilizados para crescimento, armazenamento, etc.)."
  ],
  created_at: "2025-03-14T12:30:00Z"
};

export default function FeedbackDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Feedback da Atividade</h1>
        <p className="text-muted-foreground">
          Análise detalhada da sua resposta pela Prof. Ana
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Detalhes da Atividade</h2>
          <div className="border rounded-md p-4 mb-6">
            <h3 className="font-medium mb-2">Fotossíntese: Processo e Importância</h3>
            <p className="text-muted-foreground mb-4">
              Explique o processo de fotossíntese, identificando os componentes necessários, 
              as etapas principais e sua importância para os ecossistemas.
            </p>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Sua Resposta:</h4>
              <div className="bg-muted/20 p-4 rounded-md">
                <p>
                  A fotossíntese é o processo pelo qual as plantas, algas e algumas bactérias convertem a energia da luz solar em energia química. Este processo é fundamental para a vida na Terra, pois produz oxigênio e serve como base da cadeia alimentar.
                </p>
                <p className="mt-2">
                  Para que a fotossíntese ocorra, são necessários: luz solar, água (H2O), dióxido de carbono (CO2) e clorofila, o pigmento verde presente nas folhas. A clorofila captura a energia da luz solar, que é então utilizada para transformar CO2 e H2O em glicose (C6H12O6) e oxigênio (O2).
                </p>
                <p className="mt-2">
                  A equação simplificada da fotossíntese é: CO2 + H2O + luz → C6H12O6 + O2
                </p>
                <p className="mt-2">
                  Este processo ocorre principalmente nas folhas, dentro de estruturas celulares chamadas cloroplastos. A energia armazenada na glicose é posteriormente utilizada pela planta para seu crescimento e metabolismo.
                </p>
                <p className="mt-2">
                  A fotossíntese é essencial para os ecossistemas pois, além de produzir oxigênio necessário para a respiração de muitos organismos, também é responsável pela produção primária de matéria orgânica, que serve de alimento para os consumidores primários, iniciando assim a cadeia alimentar.
                </p>
              </div>
            </div>
          </div>
          
          <FeedbackDisplay feedback={mockFeedback} />
        </div>
      </div>
    </div>
  );
}
