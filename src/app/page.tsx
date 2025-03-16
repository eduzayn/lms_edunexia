"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, BarChart3, Brain } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/studante-orenge.jpg"
          alt="Estudante com fones de ouvido e dispositivos"
          fill
          className="object-cover object-[30%_20%]"
          priority
          quality={100}
        />
        {/* Overlay sutil para legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        {/* Conteúdo */}
        <div className="relative container mx-auto px-4 h-full flex items-center justify-end">
          <div className="flex flex-col items-start space-y-8 w-full max-w-2xl pr-8">
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                EdunexIA LMS
              </motion.h1>
              <motion.p 
                className="text-xl text-white/90 md:text-2xl lg:text-3xl font-medium drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Transforme sua instituição de ensino com a plataforma mais inovadora do mercado.
              </motion.p>
            </div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/auth/login">
                <Button 
                  size="lg" 
                  className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-6 rounded-full flex items-center gap-2 text-lg transition-all hover:scale-105 shadow-md"
                >
                  Acessar Plataforma
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/precos">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-blue-600/10 border-2 border-white/50 text-white hover:bg-blue-600/20 hover:border-white px-8 py-6 rounded-full text-lg transition-all hover:scale-105"
                >
                  Conhecer Planos
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestão de Cursos</h3>
              <p className="text-gray-600 text-center">
                Crie e gerencie cursos com facilidade, organize conteúdos e avaliações.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tutoria com IA</h3>
              <p className="text-gray-600 text-center">
                Ofereça suporte personalizado aos alunos com nossa tutora virtual Prof. Ana.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fóruns de Discussão</h3>
              <p className="text-gray-600 text-center">
                Promova a interação entre alunos e instrutores com fóruns temáticos.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestão Financeira</h3>
              <p className="text-gray-600 text-center">
                Controle mensalidades, pagamentos e ofereça opções flexíveis aos alunos.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
