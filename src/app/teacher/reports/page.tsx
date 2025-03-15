import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TeacherReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Visualize relatórios e estatísticas dos seus cursos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">Total de Alunos</h2>
          <p className="text-3xl font-bold text-blue-600">107</p>
          <p className="text-sm text-blue-600">+12% em relação ao mês anterior</p>
        </Card>
        
        <Card className="p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-2">Taxa de Conclusão</h2>
          <p className="text-3xl font-bold text-green-600">68%</p>
          <p className="text-sm text-green-600">+5% em relação ao mês anterior</p>
        </Card>
        
        <Card className="p-6 bg-purple-50">
          <h2 className="text-xl font-semibold mb-2">Média de Avaliações</h2>
          <p className="text-3xl font-bold text-purple-600">8.2</p>
          <p className="text-sm text-purple-600">+0.3 em relação ao mês anterior</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Desempenho por Curso</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Introdução à Programação</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Desenvolvimento Web</span>
                <span className="text-sm font-medium">82%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Banco de Dados</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Inteligência Artificial</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/teacher/reports/courses" 
              className="text-sm text-primary hover:underline"
            >
              Ver relatório detalhado
            </Link>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Atividade dos Alunos</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Acessos Diários</p>
                <p className="text-sm text-gray-500">Média de acessos por dia</p>
              </div>
              <p className="text-2xl font-bold">78</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Tempo Médio</p>
                <p className="text-sm text-gray-500">Tempo médio de estudo por sessão</p>
              </div>
              <p className="text-2xl font-bold">42 min</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Participação em Fóruns</p>
                <p className="text-sm text-gray-500">Mensagens por semana</p>
              </div>
              <p className="text-2xl font-bold">124</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Submissões de Atividades</p>
                <p className="text-sm text-gray-500">Atividades enviadas por semana</p>
              </div>
              <p className="text-2xl font-bold">56</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/teacher/reports/activity" 
              className="text-sm text-primary hover:underline"
            >
              Ver relatório detalhado
            </Link>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Relatórios Disponíveis</h2>
        <div>
          <select className="border rounded-md p-2 mr-2">
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
            <option>Este ano</option>
            <option>Todo o período</option>
          </select>
          <button className="bg-gray-100 px-3 py-2 rounded-md">
            Exportar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/teacher/reports/performance">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Desempenho dos Alunos</h3>
            <p className="text-sm text-gray-500 mb-4">Análise detalhada do desempenho individual e coletivo dos alunos.</p>
            <p className="text-sm text-primary">Ver relatório →</p>
          </Card>
        </Link>
        
        <Link href="/teacher/reports/content">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Engajamento com Conteúdo</h3>
            <p className="text-sm text-gray-500 mb-4">Estatísticas sobre visualizações e interações com o conteúdo do curso.</p>
            <p className="text-sm text-primary">Ver relatório →</p>
          </Card>
        </Link>
        
        <Link href="/teacher/reports/assessments">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Resultados de Avaliações</h3>
            <p className="text-sm text-gray-500 mb-4">Análise das avaliações, questões problemáticas e distribuição de notas.</p>
            <p className="text-sm text-primary">Ver relatório →</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
