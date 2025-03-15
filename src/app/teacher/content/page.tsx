import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TeacherContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Conteúdo</h1>
          <p className="text-muted-foreground">Gerencie o conteúdo dos seus cursos</p>
        </div>
        <Link 
          href="/teacher/content/create" 
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Criar Novo Conteúdo
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="h-40 bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Introdução à Lógica de Programação</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Publicado</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Material introdutório sobre lógica e algoritmos.</p>
            <div className="flex justify-between text-sm">
              <span>Texto</span>
              <span>Atualizado: 10/03/2025</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link 
                href="/teacher/content/1/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/content/1/preview" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Visualizar
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-40 bg-purple-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Estruturas de Dados - Vídeo Aula</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Publicado</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Vídeo explicativo sobre arrays, listas e árvores.</p>
            <div className="flex justify-between text-sm">
              <span>Vídeo</span>
              <span>Atualizado: 12/03/2025</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link 
                href="/teacher/content/2/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/content/2/preview" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Visualizar
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-40 bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Quiz - Fundamentos de Programação</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Rascunho</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Questionário interativo para testar conhecimentos.</p>
            <div className="flex justify-between text-sm">
              <span>Quiz</span>
              <span>Atualizado: 14/03/2025</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link 
                href="/teacher/content/3/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/content/3/preview" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Visualizar
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-40 bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Material Complementar - PDF</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Publicado</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Documento com exercícios e exemplos práticos.</p>
            <div className="flex justify-between text-sm">
              <span>PDF</span>
              <span>Atualizado: 08/03/2025</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link 
                href="/teacher/content/4/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/content/4/preview" 
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
