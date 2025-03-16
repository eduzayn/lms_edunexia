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
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Meus Cursos</h2>
          <p className="text-muted-foreground mb-4">
            Acesse seus cursos em andamento e veja seu progresso.
          </p>
          <Link href="/student/courses">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Cursos</Button>
          </Link>
        </Card>
        
        {/* Progresso */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Meu Progresso</h2>
          <p className="text-muted-foreground mb-4">
            Acompanhe seu desempenho e progresso nos cursos.
          </p>
          <Link href="/student/progress">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Progresso</Button>
          </Link>
        </Card>
        
        {/* Certificados */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Certificados</h2>
          <p className="text-muted-foreground mb-4">
            Visualize e baixe seus certificados de conclusão.
          </p>
          <Link href="/student/certificates">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Meus Certificados</Button>
          </Link>
        </Card>
        
        {/* Gamificação */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Gamificação</h2>
          <p className="text-muted-foreground mb-4">
            Acompanhe suas conquistas, pontos e nível na plataforma.
          </p>
          <Link href="/student/gamification">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Minhas Conquistas</Button>
          </Link>
        </Card>
        
        {/* Tutor IA */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Tutor IA</h2>
          <p className="text-muted-foreground mb-4">
            Tire dúvidas e receba assistência personalizada com IA.
          </p>
          <Link href="/student/ai-tutor">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Acessar Tutor IA</Button>
          </Link>
        </Card>
        
        {/* Financeiro */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Financeiro</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie mensalidades, faturas e métodos de pagamento.
          </p>
          <Link href="/student/financial">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Área Financeira</Button>
          </Link>
        </Card>
        
        {/* Atividades */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Atividades</h2>
          <p className="text-muted-foreground mb-4">
            Veja suas atividades pendentes e concluídas.
          </p>
          <Link href="/student/activities">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Atividades</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
