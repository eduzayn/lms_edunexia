"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { LucideGraduationCap, LucideUser, LucideUsers, LucideSchool } from "lucide-react"

// Tipos
interface Portal {
  id: string
  title: string
  description: string
  icon: 'graduation-cap' | 'user' | 'users' | 'school'
  path: string
}

// Dados estáticos dos portais
const portals: Portal[] = [
  {
    id: 'student',
    title: 'Portal do Aluno',
    description: 'Acesse seus cursos, avaliações e materiais',
    icon: 'graduation-cap',
    path: '/auth/login?portal=student'
  },
  {
    id: 'teacher',
    title: 'Portal do Professor',
    description: 'Gerencie cursos, avaliações e alunos',
    icon: 'user',
    path: '/auth/login?portal=teacher'
  },
  {
    id: 'admin',
    title: 'Portal Administrativo',
    description: 'Gerencie usuários e visualize relatórios',
    icon: 'users',
    path: '/auth/login?portal=admin'
  },
  {
    id: 'institution',
    title: 'Portal da Instituição',
    description: 'Gerencie configurações da instituição',
    icon: 'school',
    path: '/auth/login?portal=institution'
  }
]

const iconMap = {
  'graduation-cap': LucideGraduationCap,
  'user': LucideUser,
  'users': LucideUsers,
  'school': LucideSchool,
} as const

interface PortalCardProps {
  portal: Portal
}

function PortalCard({ portal }: PortalCardProps) {
  const router = useRouter()
  const Icon = iconMap[portal.icon]

  const handleClick = () => {
    router.push(portal.path as any) // TODO: Melhorar tipagem quando Next.js 14 tiver melhor suporte para tipos de rota
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6" />
          <CardTitle>{portal.title}</CardTitle>
        </div>
        <CardDescription>{portal.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full"
          onClick={handleClick}
          data-testid={`portal-${portal.id}-button`}
        >
          Acessar
        </Button>
      </CardContent>
    </Card>
  )
}

// Página Principal com ISR
export default function PortalSelection() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Selecione o Portal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map(portal => (
            <PortalCard key={portal.id} portal={portal} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Configuração do ISR - revalidar a cada 24 horas
export const revalidate = 86400 