"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { LucideGraduationCap, LucideUser, LucideUsers, LucideSchool } from "lucide-react"

export default function PortalSelection() {
  const router = useRouter()

  const portals = [
    {
      id: 'student',
      title: 'Portal do Aluno',
      description: 'Acesse seus cursos, avaliações e materiais',
      icon: LucideGraduationCap,
      path: '/auth/login?portal=student'
    },
    {
      id: 'teacher',
      title: 'Portal do Professor',
      description: 'Gerencie cursos, avaliações e alunos',
      icon: LucideUser,
      path: '/auth/login?portal=teacher'
    },
    {
      id: 'admin',
      title: 'Portal Administrativo',
      description: 'Gerencie usuários e visualize relatórios',
      icon: LucideUsers,
      path: '/auth/login?portal=admin'
    },
    {
      id: 'institution',
      title: 'Portal da Instituição',
      description: 'Gerencie configurações da instituição',
      icon: LucideSchool,
      path: '/auth/login?portal=institution'
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Selecione o Portal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map(portal => (
            <Card key={portal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <portal.icon className="h-6 w-6" />
                  <CardTitle>{portal.title}</CardTitle>
                </div>
                <CardDescription>{portal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => router.push(portal.path)}
                  data-testid={`portal-${portal.id}-button`}
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 