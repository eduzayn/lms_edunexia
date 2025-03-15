import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TeacherCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Meus Cursos</h1>
          <p className="text-muted-foreground">Gerencie os cursos que você ministra</p>
        </div>
        <Link 
          href="/teacher/courses/create" 
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Criar Novo Curso
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="h-40 bg-blue-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Introdução à Programação</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Ativo</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Fundamentos de lógica e algoritmos para iniciantes.</p>
            <div className="flex justify-between text-sm">
              <span>32 alunos</span>
              <span>12 aulas</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link 
                href="/teacher/courses/1/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/courses/1/students" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Alunos
              </Link>
              <Link 
                href="/teacher/courses/1/content" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Conteúdo
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-40 bg-purple-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Desenvolvimento Web</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Ativo</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">HTML, CSS e JavaScript para criação de sites modernos.</p>
            <div className="flex justify-between text-sm">
              <span>48 alunos</span>
              <span>24 aulas</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link 
                href="/teacher/courses/2/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/courses/2/students" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Alunos
              </Link>
              <Link 
                href="/teacher/courses/2/content" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Conteúdo
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-40 bg-green-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Banco de Dados</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Rascunho</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Modelagem e implementação de bancos de dados relacionais.</p>
            <div className="flex justify-between text-sm">
              <span>0 alunos</span>
              <span>8 aulas</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link 
                href="/teacher/courses/3/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/courses/3/students" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Alunos
              </Link>
              <Link 
                href="/teacher/courses/3/content" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Conteúdo
              </Link>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="h-40 bg-red-500"></div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Inteligência Artificial</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Ativo</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Fundamentos de IA, machine learning e deep learning.</p>
            <div className="flex justify-between text-sm">
              <span>27 alunos</span>
              <span>16 aulas</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link 
                href="/teacher/courses/4/edit" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Editar
              </Link>
              <Link 
                href="/teacher/courses/4/students" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Alunos
              </Link>
              <Link 
                href="/teacher/courses/4/content" 
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                Conteúdo
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
