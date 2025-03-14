import * as React from "react";
import { Search, Filter, Download, ArrowUpDown, Eye } from "lucide-react";

export default function AdminFeedbackPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Feedback de Atividades</h1>
        <p className="text-muted-foreground">
          Gerencie e analise o feedback de IA fornecido aos alunos
        </p>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por aluno, curso ou atividade..."
              className="w-full pl-9 pr-3 py-2 border rounded-md"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-muted"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
          
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-sm">
                <div className="flex items-center gap-1">
                  <span>Aluno</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-sm">
                <div className="flex items-center gap-1">
                  <span>Atividade</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-sm">
                <div className="flex items-center gap-1">
                  <span>Curso</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-sm">
                <div className="flex items-center gap-1">
                  <span>Nota</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-sm">
                <div className="flex items-center gap-1">
                  <span>Data</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-sm">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    MC
                  </div>
                  <div>
                    <p className="font-medium">Maria Costa</p>
                    <p className="text-xs text-muted-foreground">ID: 12345</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <p>Fotossíntese: Processo e Importância</p>
              </td>
              <td className="px-4 py-3">
                <p>Biologia</p>
              </td>
              <td className="px-4 py-3">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  <span>8.5/10</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                14/03/2025
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-1 border rounded-md hover:bg-muted text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>Visualizar</span>
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    JS
                  </div>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-xs text-muted-foreground">ID: 12346</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <p>Revolução Industrial: Causas e Consequências</p>
              </td>
              <td className="px-4 py-3">
                <p>História</p>
              </td>
              <td className="px-4 py-3">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  <span>9.0/10</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                12/03/2025
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-1 border rounded-md hover:bg-muted text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>Visualizar</span>
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    AP
                  </div>
                  <div>
                    <p className="font-medium">Ana Pereira</p>
                    <p className="text-xs text-muted-foreground">ID: 12347</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <p>Leis de Newton: Aplicações no Cotidiano</p>
              </td>
              <td className="px-4 py-3">
                <p>Física</p>
              </td>
              <td className="px-4 py-3">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                  <span>7.0/10</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                10/03/2025
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-1 border rounded-md hover:bg-muted text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>Visualizar</span>
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    LO
                  </div>
                  <div>
                    <p className="font-medium">Lucas Oliveira</p>
                    <p className="text-xs text-muted-foreground">ID: 12348</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <p>Equações Diferenciais: Aplicações Práticas</p>
              </td>
              <td className="px-4 py-3">
                <p>Matemática</p>
              </td>
              <td className="px-4 py-3">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  <span>9.5/10</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                08/03/2025
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-1 border rounded-md hover:bg-muted text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>Visualizar</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 4 de 120 feedbacks
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted disabled:opacity-50"
            disabled
          >
            Anterior
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md"
          >
            1
          </button>
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted"
          >
            2
          </button>
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted"
          >
            3
          </button>
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted"
          >
            ...
          </button>
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted"
          >
            30
          </button>
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted"
          >
            Próximo
          </button>
        </div>
      </div>
      
      <div className="mt-8 border rounded-md p-6 bg-muted/10">
        <h2 className="text-xl font-semibold mb-4">Estatísticas de Feedback</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-md p-4">
            <p className="text-sm text-muted-foreground mb-1">Média de Notas</p>
            <p className="text-3xl font-bold">8.2/10</p>
            <p className="text-xs text-muted-foreground mt-2">Baseado em 120 avaliações</p>
          </div>
          
          <div className="border rounded-md p-4">
            <p className="text-sm text-muted-foreground mb-1">Feedbacks Gerados</p>
            <p className="text-3xl font-bold">120</p>
            <p className="text-xs text-muted-foreground mt-2">Nos últimos 30 dias</p>
          </div>
          
          <div className="border rounded-md p-4">
            <p className="text-sm text-muted-foreground mb-1">Tempo Médio de Resposta</p>
            <p className="text-3xl font-bold">2.5s</p>
            <p className="text-xs text-muted-foreground mt-2">Tempo de geração do feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}
