"use client"

import { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, Building2, Users, Building } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Selecione o Portal | EdunexIA LMS',
  description: 'Escolha o portal adequado ao seu perfil',
}

const portals = [
  {
    title: 'Portal do Aluno',
    description: 'Acesse suas aulas, materiais e atividades',
    icon: GraduationCap,
    path: '/auth/aluno/login',
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    title: 'Portal do Professor',
    description: 'Gerencie suas turmas e conteúdos',
    icon: Users,
    path: '/auth/professor/login',
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    title: 'Portal do Polo',
    description: 'Administre seu polo de ensino',
    icon: Building,
    path: '/auth/polo/login',
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    title: 'Portal Administrativo',
    description: 'Acesso restrito à administração',
    icon: Building2,
    path: '/auth/admin/login',
    color: 'bg-red-600 hover:bg-red-700'
  }
]

export default function PortalSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Selecione seu portal de acesso
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Escolha o portal adequado ao seu perfil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon
            return (
              <Link
                key={portal.path}
                href={portal.path}
                className={`flex flex-col items-center p-6 rounded-lg shadow-sm border border-gray-200 transition-all transform hover:scale-105 ${portal.color} text-white`}
              >
                <Icon className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{portal.title}</h3>
                <p className="text-sm text-center opacity-90">{portal.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 