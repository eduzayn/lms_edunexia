import { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, Building2, School2, Users, Handshake } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Selecione o Portal | EdunexIA LMS',
  description: 'Escolha o portal adequado ao seu perfil',
}

const portals = [
  {
    title: 'Portal do Aluno',
    description: 'Acesse seus cursos, materiais e avaliações',
    icon: GraduationCap,
    href: '/auth/aluno/login',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Portal do Professor',
    description: 'Gerencie suas turmas e conteúdos',
    icon: Users,
    href: '/auth/professor/login',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Portal do Polo',
    description: 'Administre seu polo de ensino',
    icon: School2,
    href: '/auth/polo/login',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Portal Administrativo',
    description: 'Gerencie toda a plataforma',
    icon: Building2,
    href: '/auth/admin/login',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    title: 'Portal do Parceiro',
    description: 'Gerencie sua parceria e comissões',
    icon: Handshake,
    href: '/auth/parceiro/login',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
]

export default function PortalSelectionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Selecione seu Portal</h1>
          <p className="text-muted-foreground mt-2">
            Escolha o portal adequado ao seu perfil para acessar a plataforma
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal) => {
            const Icon = portal.icon
            return (
              <Link key={portal.title} href={portal.href}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${portal.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${portal.color}`} />
                    </div>
                    <CardTitle className="text-xl">{portal.title}</CardTitle>
                    <CardDescription>{portal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground">Clique para acessar</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 ml-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 