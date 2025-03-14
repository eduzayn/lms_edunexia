"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, BarChart3, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">Edunexia</h1>
            <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">LMS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm font-medium hover:underline"
            >
              Entrar
            </Link>
            
            <Link 
              href="/auth/register" 
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Registrar
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Plataforma de Aprendizagem com Inteligência Artificial
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Edunexia é uma plataforma completa para instituições educacionais, 
                com tutoria de IA, gestão financeira e recursos avançados para uma 
                experiência de aprendizagem moderna.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/auth/login" 
                  className="bg-primary text-white px-6 py-3 rounded-md text-center font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  Acessar Plataforma
                  <ArrowRight size={18} />
                </Link>
                <Link 
                  href="/pricing" 
                  className="border border-gray-300 bg-white px-6 py-3 rounded-md text-center font-medium hover:bg-gray-50 flex items-center justify-center"
                >
                  Conhecer Planos
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-[400px] bg-gray-200 rounded-lg overflow-hidden">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Imagem da Plataforma
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Principais Recursos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Cursos</h3>
              <p className="text-gray-600">
                Crie e gerencie cursos com facilidade, organize conteúdos e avaliações.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Brain className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tutoria com IA</h3>
              <p className="text-gray-600">
                Ofereça suporte personalizado aos alunos com nossa tutora virtual Prof. Ana.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fóruns de Discussão</h3>
              <p className="text-gray-600">
                Promova a interação entre alunos e instrutores com fóruns temáticos.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão Financeira</h3>
              <p className="text-gray-600">
                Controle mensalidades, pagamentos e ofereça opções flexíveis aos alunos.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Edunexia LMS</h3>
              <p className="text-gray-400">
                Plataforma completa de gestão de aprendizagem para instituições educacionais.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/login" className="text-gray-400 hover:text-white">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-gray-400 hover:text-white">
                    Registrar
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white">
                    Planos
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <p className="text-gray-400">
                contato@edunexia.com.br
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Edunexia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
