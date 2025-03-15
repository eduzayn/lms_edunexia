import React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard do Aluno</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cursos */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Meus Cursos</h2>
          <p className="text-muted-foreground mb-4">
            Acesse seus cursos em andamento e veja seu progresso.
          </p>
          <Link href="/student/courses">
            <Button className="w-full">Ver Cursos</Button>
          </Link>
        </Card>
        
        {/* Progresso */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Meu Progresso</h2>
          <p className="text-muted-foreground mb-4">
            Acompanhe seu desempenho e progresso nos cursos.
          </p>
          <Link href="/student/progress">
            <Button className="w-full">Ver Progresso</Button>
          </Link>
        </Card>
        
        {/* Financeiro */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financeiro</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie mensalidades, faturas e métodos de pagamento.
          </p>
          <Link href="/student/financial">
            <Button className="w-full">Área Financeira</Button>
          </Link>
        </Card>
        
        {/* Certificados */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Certificados</h2>
          <p className="text-muted-foreground mb-4">
            Visualize e baixe seus certificados de conclusão.
          </p>
          <Link href="/student/certificates">
            <Button className="w-full">Meus Certificados</Button>
          </Link>
        </Card>
        
        {/* Tutor IA */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tutor IA</h2>
          <p className="text-muted-foreground mb-4">
            Tire dúvidas e receba assistência personalizada com IA.
          </p>
          <Link href="/student/ai-tutor">
            <Button className="w-full">Acessar Tutor IA</Button>
          </Link>
        </Card>
        
        {/* Atividades */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Atividades</h2>
          <p className="text-muted-foreground mb-4">
            Veja suas atividades pendentes e concluídas.
          </p>
          <Link href="/student/activities">
            <Button className="w-full">Ver Atividades</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
