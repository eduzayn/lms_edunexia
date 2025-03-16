"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookOpen, BarChart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/images/virtual-classroom-study-space.jpg"
        alt="Estudante em ambiente virtual de aprendizagem"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay gradiente azul */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 via-blue-600/50 to-blue-600/40" />
      
      {/* Conteúdo */}
      <div className="relative w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-white">Bem-vindo de volta!</h1>
          <p className="text-white/90 text-xl">
            Escolha seu perfil e continue sua jornada de aprendizagem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Portal do Aluno */}
          <Card className="relative hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-md border-white/20 hover:bg-white/90 hover:scale-105">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Portal do Aluno</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="min-h-[100px] text-gray-600">
                Acesse seus cursos, atividades, notas e certificados. Interaja com professores e colegas.
              </CardDescription>
              <Link href="/portal/aluno" className="block">
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Acessar Portal</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Portal do Professor */}
          <Card className="relative hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-md border-white/20 hover:bg-white/90 hover:scale-105">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Portal do Professor</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="min-h-[100px] text-gray-600">
                Gerencie suas turmas, crie conteúdos, avaliações e acompanhe o desempenho dos alunos.
              </CardDescription>
              <Link href="/portal/professor" className="block">
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Acessar Portal</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Portal Administrativo */}
          <Card className="relative hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-md border-white/20 hover:bg-white/90 hover:scale-105">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Portal Administrativo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="min-h-[100px] text-gray-600">
                Configure a plataforma, gerencie usuários, módulos, relatórios e aspectos financeiros.
              </CardDescription>
              <Link href="/admin/dashboard" className="block">
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Acessar Portal</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
