"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, BarChart3, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupabaseTest } from '@/components/supabase-test'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                EdunexIA LMS
              </h1>
              <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl">
                Plataforma de Aprendizagem com Inteligência Artificial para instituições educacionais.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/login">
                <Button variant="default" size="lg">
                  Acessar Plataforma
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/precos">
                <Button variant="outline" size="lg">
                  Conhecer Planos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-blue-50">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Gestão de Cursos</h3>
              <p className="text-sm text-zinc-500 text-center">
                Crie e gerencie cursos com facilidade, organize conteúdos e avaliações.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-blue-50">
                <Brain className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Tutoria com IA</h3>
              <p className="text-sm text-zinc-500 text-center">
                Ofereça suporte personalizado aos alunos com nossa tutora virtual Prof. Ana.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Fóruns de Discussão</h3>
              <p className="text-sm text-zinc-500 text-center">
                Promova a interação entre alunos e instrutores com fóruns temáticos.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-blue-50">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Gestão Financeira</h3>
              <p className="text-sm text-zinc-500 text-center">
                Controle mensalidades, pagamentos e ofereça opções flexíveis aos alunos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supabase Test Section - Apenas em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6">
            <SupabaseTest />
          </div>
        </section>
      )}
    </div>
  );
}
