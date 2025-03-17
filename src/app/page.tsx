"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, BarChart3, Brain, Award, TrendingUp, Zap, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: BookOpen,
    title: 'Conteúdo Personalizado',
    description: 'Material didático adaptado ao ritmo e estilo de aprendizagem de cada aluno.'
  },
  {
    icon: Users,
    title: 'Colaboração em Tempo Real',
    description: 'Ferramentas para interação entre alunos e professores, promovendo aprendizado colaborativo.'
  },
  {
    icon: Award,
    title: 'Certificação Reconhecida',
    description: 'Certificados digitais validados e reconhecidos pelo mercado.'
  },
  {
    icon: TrendingUp,
    title: 'Analytics Avançado',
    description: 'Acompanhamento detalhado do progresso e desempenho dos alunos.'
  },
  {
    icon: Zap,
    title: 'Aprendizado Adaptativo',
    description: 'Sistema inteligente que se adapta às necessidades individuais.'
  },
  {
    icon: Shield,
    title: 'Segurança Garantida',
    description: 'Proteção de dados e privacidade em conformidade com a LGPD.'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1 
              className="mb-6 text-5xl font-bold tracking-tight md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Transforme a Educação com 
              <span className="text-primary"> Inteligência Artificial</span>
            </motion.h1>
            <motion.p 
              className="mb-8 text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Plataforma completa de ensino que combina tecnologia avançada com métodos pedagógicos inovadores para uma experiência de aprendizado única.
            </motion.p>
            <motion.div 
              className="flex flex-col justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" asChild>
                <a href="/registro">Começar Agora</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/depoimentos">Ver Depoimentos</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-24">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Recursos que Transformam o Aprendizado
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Nossa plataforma oferece ferramentas poderosas para instituições de ensino, professores e alunos.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <feature.icon className="mb-4 h-12 w-12 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
