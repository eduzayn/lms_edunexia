"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookOpen, BarChart } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">Bem-vindo de volta!</h1>
        <p className="text-gray-600">
          Escolha seu perfil e continue sua jornada de aprendizagem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portal do Aluno */}
        <Card className="relative hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Portal do Aluno</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="min-h-[100px]">
              Acesse seus cursos, atividades, notas e certificados. Interaja com professores e colegas.
            </CardDescription>
            <Link href="/portal/aluno">
              <Button className="w-full mt-4">Acessar Portal</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Portal do Professor */}
        <Card className="relative hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Portal do Professor</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="min-h-[100px]">
              Gerencie suas turmas, crie conteúdos, avaliações e acompanhe o desempenho dos alunos.
            </CardDescription>
            <Link href="/portal/professor">
              <Button className="w-full mt-4" variant="secondary">Acessar Portal</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Portal Administrativo */}
        <Card className="relative hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BarChart className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Portal Administrativo</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="min-h-[100px]">
              Configure a plataforma, gerencie usuários, módulos, relatórios e aspectos financeiros.
            </CardDescription>
            <Link href="/portal/admin">
              <Button className="w-full mt-4" variant="outline">Acessar Portal</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
