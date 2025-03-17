"use client"

import { LoginForm } from '@/components/auth/login-form'

export default function PoloLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Portal do Polo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Administre seu polo de ensino
          </p>
        </div>

        <LoginForm userRole="polo" />
      </div>
    </div>
  )
} 