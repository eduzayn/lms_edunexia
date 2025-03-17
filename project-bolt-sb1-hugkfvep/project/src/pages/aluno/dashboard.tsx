import React from 'react';
import { useAuth } from '@/contexts/auth';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function AlunoDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {profile?.full_name}
          </h1>
          <p className="text-gray-600">Bem-vindo(a) ao seu portal de estudos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">5</h3>
            <p className="text-gray-600">Cursos em Andamento</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Clock className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">24h</h3>
            <p className="text-gray-600">Horas Estudadas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Award className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
            <p className="text-gray-600">Certificados</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <TrendingUp className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">85%</h3>
            <p className="text-gray-600">Média Geral</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Atividades</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Prova de Matemática</p>
                  <p className="text-sm text-gray-600">Álgebra Linear - Cap. 3</p>
                </div>
                <span className="text-sm text-red-600">Hoje, 14:00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Entrega de Trabalho</p>
                  <p className="text-sm text-gray-600">Física Quântica - Projeto Final</p>
                </div>
                <span className="text-sm text-yellow-600">Amanhã, 23:59</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Aula ao Vivo</p>
                  <p className="text-sm text-gray-600">Programação Orientada a Objetos</p>
                </div>
                <span className="text-sm text-green-600">Em 2 dias</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimas Notas</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Cálculo I</p>
                  <p className="text-sm text-gray-600">Prova Final</p>
                </div>
                <span className="text-lg font-semibold text-green-600">9.5</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Estrutura de Dados</p>
                  <p className="text-sm text-gray-600">Projeto Prático</p>
                </div>
                <span className="text-lg font-semibold text-green-600">8.7</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Banco de Dados</p>
                  <p className="text-sm text-gray-600">Trabalho em Grupo</p>
                </div>
                <span className="text-lg font-semibold text-yellow-600">7.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}