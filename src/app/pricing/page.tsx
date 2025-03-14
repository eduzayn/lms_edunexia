"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export default function PricingPage() {
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
        <h1 className="text-4xl font-bold mb-4">Planos e Preços</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para sua instituição de ensino. Todos os planos incluem suporte técnico e atualizações regulares.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plano Básico */}
        <Card className="border rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Plano Básico</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">R$ 499</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Ideal para pequenas instituições com até 100 alunos.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Gestão de Cursos</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Ambiente Virtual de Aprendizagem</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Avaliações Online</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Certificados Digitais</span>
              </li>
            </ul>
            
            <Link href="/auth/register">
              <Button className="w-full">Começar Agora</Button>
            </Link>
          </div>
        </Card>
        
        {/* Plano Profissional */}
        <Card className="border-2 border-primary rounded-lg overflow-hidden shadow-lg">
          <div className="bg-primary text-white text-center py-2 text-sm font-medium">
            Mais Popular
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Plano Profissional</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">R$ 999</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Para instituições em crescimento com até 500 alunos.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Todos os recursos do Plano Básico</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Tutoria com IA (Prof. Ana)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Gestão Financeira Avançada</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Relatórios Detalhados</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Fóruns de Discussão</span>
              </li>
            </ul>
            
            <Link href="/auth/register">
              <Button className="w-full">Começar Agora</Button>
            </Link>
          </div>
        </Card>
        
        {/* Plano Empresarial */}
        <Card className="border rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Plano Empresarial</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">R$ 2.499</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Solução completa para grandes instituições com mais de 500 alunos.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Todos os recursos do Plano Profissional</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>API para Integrações</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Suporte Prioritário</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Personalização Completa</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Onboarding Dedicado</span>
              </li>
            </ul>
            
            <Link href="/auth/register">
              <Button variant="outline" className="w-full">Falar com Consultor</Button>
            </Link>
          </div>
        </Card>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Dúvidas Frequentes</h2>
        <div className="max-w-3xl mx-auto grid gap-6">
          <div className="text-left">
            <h3 className="font-medium mb-2">Posso mudar de plano depois?</h3>
            <p className="text-muted-foreground">
              Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de faturamento.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-medium mb-2">Como funciona o período de teste?</h3>
            <p className="text-muted-foreground">
              Oferecemos 14 dias de teste gratuito para todos os planos, sem necessidade de cartão de crédito. Você pode experimentar todas as funcionalidades antes de decidir.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-medium mb-2">Preciso instalar algum software?</h3>
            <p className="text-muted-foreground">
              Não, a Edunexia é uma plataforma 100% na nuvem. Você só precisa de um navegador e conexão com a internet para acessar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
