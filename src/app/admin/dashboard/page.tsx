import React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Usuários */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Usuários</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie usuários, permissões e perfis.
          </p>
          <Link href="/admin/users">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Gerenciar Usuários</Button>
          </Link>
        </Card>
        
        {/* Cursos */}
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Cursos</h2>
          <p className="text-muted-foreground mb-4">
            Administre cursos, categorias e matrículas.
          </p>
          <Link href="/admin/courses/list">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Gerenciar Cursos</Button>
          </Link>
        </Card>
        
        {/* Conteúdo */}
        <Card className="p-6 border-l-4 border-l-amber-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-amber-700">Conteúdo</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie conteúdos e recursos educacionais.
          </p>
          <Link href="/admin/content/list">
            <Button className="w-full bg-amber-600 hover:bg-amber-700">Gerenciar Conteúdo</Button>
          </Link>
        </Card>
        
        {/* Módulos */}
        <Card className="p-6 border-l-4 border-l-rose-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-rose-700">Módulos</h2>
          <p className="text-muted-foreground mb-4">
            Configure módulos e funcionalidades da plataforma.
          </p>
          <Link href="/admin/modules">
            <Button className="w-full bg-rose-600 hover:bg-rose-700">Configurar Módulos</Button>
          </Link>
        </Card>
        
        {/* Financeiro */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Financeiro</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie pagamentos, faturas e configurações financeiras.
          </p>
          <Link href="/admin/financial">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Gestão Financeira</Button>
          </Link>
        </Card>
        
        {/* Relatórios */}
        <Card className="p-6 border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Relatórios</h2>
          <p className="text-muted-foreground mb-4">
            Visualize relatórios e análises da plataforma.
          </p>
          <Link href="/admin/reports">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">Ver Relatórios</Button>
          </Link>
        </Card>
        
        {/* Analytics */}
        <Card className="p-6 border-l-4 border-l-amber-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-amber-700">Analytics</h2>
          <p className="text-muted-foreground mb-4">
            Acesse dados analíticos detalhados da plataforma.
          </p>
          <Link href="/admin/analytics/dashboard">
            <Button className="w-full bg-amber-600 hover:bg-amber-700">Ver Analytics</Button>
          </Link>
        </Card>
        
        {/* Avaliações */}
        <Card className="p-6 border-l-4 border-l-rose-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-rose-700">Avaliações</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie avaliações e questionários.
          </p>
          <Link href="/admin/assessments/list">
            <Button className="w-full bg-rose-600 hover:bg-rose-700">Gerenciar Avaliações</Button>
          </Link>
        </Card>
        
        {/* Configurações */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Configurações</h2>
          <p className="text-muted-foreground mb-4">
            Configure parâmetros gerais da plataforma.
          </p>
          <Link href="/admin/settings">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Configurações</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
