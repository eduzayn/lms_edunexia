import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Users, BookOpen, School, Activity } from 'lucide-react';
import AdminLayout from '@/components/layout/admin/layout';

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo(a), {profile?.full_name}
        </h1>
        <p className="text-gray-600">Painel Administrativo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">2,543</h3>
          <p className="text-gray-600">Alunos Ativos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <BookOpen className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">156</h3>
          <p className="text-gray-600">Cursos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <School className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">48</h3>
          <p className="text-gray-600">Professores</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Activity className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">89%</h3>
          <p className="text-gray-600">Taxa de Aprovação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium text-gray-900">Novo curso adicionado</p>
                <p className="text-sm text-gray-600">Desenvolvimento Web Full Stack</p>
              </div>
              <span className="text-sm text-gray-500">2h atrás</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium text-gray-900">Professor cadastrado</p>
                <p className="text-sm text-gray-600">Ana Silva - Matemática</p>
              </div>
              <span className="text-sm text-gray-500">5h atrás</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Relatório gerado</p>
                <p className="text-sm text-gray-600">Desempenho mensal - Março/2025</p>
              </div>
              <span className="text-sm text-gray-500">1d atrás</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tarefas Pendentes</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                <span className="ml-3 text-gray-900">Revisar novos cadastros de alunos</span>
              </div>
              <span className="text-sm text-red-600">Urgente</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                <span className="ml-3 text-gray-900">Aprovar material didático</span>
              </div>
              <span className="text-sm text-yellow-600">Média</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                <span className="ml-3 text-gray-900">Gerar relatório financeiro</span>
              </div>
              <span className="text-sm text-green-600">Baixa</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}