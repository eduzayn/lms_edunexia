import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Users, School, TrendingUp, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function PoloDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Polo {profile?.full_name}
          </h1>
          <p className="text-gray-600">Gestão do Polo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Users className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">324</h3>
            <p className="text-gray-600">Alunos Matriculados</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <School className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">15</h3>
            <p className="text-gray-600">Cursos Ativos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">92%</h3>
            <p className="text-gray-600">Taxa de Retenção</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <DollarSign className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">98%</h3>
            <p className="text-gray-600">Inadimplência</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Matrículas Recentes</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">João Silva</p>
                  <p className="text-sm text-gray-600">Engenharia de Software</p>
                </div>
                <span className="text-sm text-green-600">Hoje</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Maria Santos</p>
                  <p className="text-sm text-gray-600">Administração</p>
                </div>
                <span className="text-sm text-green-600">Ontem</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Pedro Oliveira</p>
                  <p className="text-sm text-gray-600">Ciência da Computação</p>
                </div>
                <span className="text-sm text-green-600">2 dias atrás</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Eventos</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Feira de Profissões</p>
                  <p className="text-sm text-gray-600">Auditório Principal</p>
                </div>
                <span className="text-sm text-red-600">Amanhã, 14:00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Workshop de Tecnologia</p>
                  <p className="text-sm text-gray-600">Laboratório 2</p>
                </div>
                <span className="text-sm text-yellow-600">Em 3 dias</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Palestra: Mercado de Trabalho</p>
                  <p className="text-sm text-gray-600">Sala de Conferência</p>
                </div>
                <span className="text-sm text-green-600">Próxima semana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}