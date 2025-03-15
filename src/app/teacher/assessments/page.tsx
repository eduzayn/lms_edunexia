import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TeacherAssessmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Avaliações</h1>
          <p className="text-muted-foreground">Gerencie as avaliações dos seus cursos</p>
        </div>
        <Link 
          href="/teacher/assessments/create" 
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Criar Nova Avaliação
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Avaliação Final - Programação</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Ativa</span>
            </div>
            <p className="text-sm text-gray-500">Avaliação final do módulo de programação.</p>
          </div>
          <div className="p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Curso:</span>
                <span>Introdução à Programação</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Questões:</span>
                <span>10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tempo:</span>
                <span>60 minutos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tentativas:</span>
                <span>15 / 32 alunos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Média:</span>
                <span>7.8 / 10</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link 
                href="/teacher/assessments/1/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/assessments/1/results" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Resultados
              </Link>
              <Link 
                href="/teacher/assessments/1/preview" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Visualizar
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Quiz - HTML e CSS</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Ativa</span>
            </div>
            <p className="text-sm text-gray-500">Quiz sobre fundamentos de HTML e CSS.</p>
          </div>
          <div className="p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Curso:</span>
                <span>Desenvolvimento Web</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Questões:</span>
                <span>15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tempo:</span>
                <span>30 minutos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tentativas:</span>
                <span>28 / 48 alunos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Média:</span>
                <span>8.5 / 10</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link 
                href="/teacher/assessments/2/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/assessments/2/results" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Resultados
              </Link>
              <Link 
                href="/teacher/assessments/2/preview" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Visualizar
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Prova - Banco de Dados</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Rascunho</span>
            </div>
            <p className="text-sm text-gray-500">Avaliação sobre modelagem e SQL.</p>
          </div>
          <div className="p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Curso:</span>
                <span>Banco de Dados</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Questões:</span>
                <span>8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tempo:</span>
                <span>45 minutos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tentativas:</span>
                <span>0 / 0 alunos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Média:</span>
                <span>N/A</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link 
                href="/teacher/assessments/3/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/assessments/3/preview" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Visualizar
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
