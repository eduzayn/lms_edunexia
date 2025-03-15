"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para a página inicial</span>
        </Link>
      </div>
      
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Acesse sua Conta</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha o portal adequado para o seu perfil e continue sua jornada de aprendizagem.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Portal do Aluno */}
        <Card className="border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Portal do Aluno</h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              Acesse seus cursos, atividades, notas e certificados. Interaja com professores e colegas.
            </p>
            <Link href="/student/login" className="w-full">
              <Button className="w-full">Acessar Portal</Button>
            </Link>
          </div>
        </Card>
        
        {/* Portal do Professor */}
        <Card className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Portal do Professor</h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              Gerencie suas turmas, crie conteúdos, avaliações e acompanhe o desempenho dos alunos.
            </p>
            <Link href="/teacher/login" className="w-full">
              <Button variant="outline" className="w-full">Acessar Portal</Button>
            </Link>
          </div>
        </Card>
        
        {/* Portal Administrativo */}
        <Card className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-violet-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Portal Administrativo</h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              Configure a plataforma, gerencie usuários, módulos, relatórios e aspectos financeiros.
            </p>
            <Link href="/admin/login" className="w-full">
              <Button variant="outline" className="w-full">Acessar Portal</Button>
            </Link>
          </div>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Ainda não tem uma conta?
        </p>
        <Link href="/auth/register">
          <Button variant="outline">Criar Conta</Button>
        </Link>
      </div>
    </div>
  );
}
