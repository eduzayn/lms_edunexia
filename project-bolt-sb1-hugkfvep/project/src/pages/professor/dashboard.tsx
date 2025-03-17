import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Users, BookOpen, Clock, Award } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function ProfessorDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Prof. {profile?.full_name}
          </h1>
          <p className="text-gray-600">Portal do Professor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Users className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">156</h3>
            <p className="text-gray-600">Alunos Ativos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <BookOpen className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">8</h3>
            <p className="text-gray-600">Turmas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Clock className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">32h</h3>
            <p className="text-gray-600">Carga Horária Semanal</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Award className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
            <p className="text-gray-600">Avaliação Média</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Aulas</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Matemática Avançada</p>
                  <p className="text-sm text-gray-600">Turma A - Sala Virtual 3</p>
                </div>
                <span className="text-sm text-red-600">Hoje, 14:00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Cálculo III</p>
                  <p className="text-sm text-gray-600">Turma B - Sala Virtual 1</p>
                </div>
                <span className="text-sm text-yellow-600">Amanhã, 10:00</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Álgebra Linear</p>
                  <p className="text-sm text-gray-600">Turma C - Sala Virtual 2</p>
                </div>
                <span className="text-sm text-green-600">Quinta, 16:00</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividades Pendentes</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                  <span className="ml-3 text-gray-900">Corrigir provas - Turma A</span>
                </div>
                <span className="text-sm text-red-600">Hoje</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                  <span className="ml-3 text-gray-900">Preparar material - Cálculo III</span>
                </div>
                <span className="text-sm text-yellow-600">Amanhã</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
                  <span className="ml-3 text-gray-900">Lançar notas - Turma B</span>
                </div>
                <span className="text-sm text-green-600">Esta semana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}