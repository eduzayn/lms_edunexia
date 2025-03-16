import React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function TeacherDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard do Professor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cursos */}
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Meus Cursos</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie os cursos que você ministra.
          </p>
          <Link href="/teacher/courses">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Gerenciar Cursos</Button>
          </Link>
        </Card>
        
        {/* Alunos */}
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Meus Alunos</h2>
          <p className="text-muted-foreground mb-4">
            Visualize e gerencie seus alunos.
          </p>
          <Link href="/teacher/students">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Ver Alunos</Button>
          </Link>
        </Card>
        
        {/* Conteúdo */}
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Conteúdo</h2>
          <p className="text-muted-foreground mb-4">
            Crie e edite conteúdos para seus cursos.
          </p>
          <Link href="/teacher/content">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Gerenciar Conteúdo</Button>
          </Link>
        </Card>
        
        {/* Avaliações */}
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Avaliações</h2>
          <p className="text-muted-foreground mb-4">
            Crie e gerencie avaliações para seus alunos.
          </p>
          <Link href="/teacher/assessments">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Gerenciar Avaliações</Button>
          </Link>
        </Card>
        
        {/* Fóruns */}
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Fóruns</h2>
          <p className="text-muted-foreground mb-4">
            Participe e modere discussões nos fóruns.
          </p>
          <Link href="/forums/list">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Acessar Fóruns</Button>
          </Link>
        </Card>
        
        {/* Relatórios */}
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Relatórios</h2>
          <p className="text-muted-foreground mb-4">
            Visualize relatórios de desempenho e participação.
          </p>
          <Link href="/teacher/reports">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Ver Relatórios</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
