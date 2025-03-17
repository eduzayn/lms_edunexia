"use client"

import { LoginForm } from '@/components/auth/login-form'

export default function AlunoLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Portal do Aluno
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse suas aulas, materiais e atividades
          </p>
        </div>

        <LoginForm userRole="aluno" />
      </div>
    </div>
  )
} 