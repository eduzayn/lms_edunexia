import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/types/supabase'

export const metadata: Metadata = {
  title: 'Selecione o Portal',
  description: 'Selecione o portal que deseja acessar',
}

const portals: { role: UserRole; title: string; description: string }[] = [
  {
    role: 'aluno',
    title: 'Portal do Aluno',
    description: 'Acesse suas aulas, atividades e materiais',
  },
  {
    role: 'professor',
    title: 'Portal do Professor',
    description: 'Gerencie suas turmas, aulas e atividades',
  },
  {
    role: 'polo',
    title: 'Portal do Polo',
    description: 'Gerencie seus alunos e professores',
  },
  {
    role: 'admin',
    title: 'Portal Administrativo',
    description: 'Gerencie toda a plataforma',
  },
]

export default function PortalSelectionPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img 
            src="/logo.png"
            alt="EdunexIA Logo"
            className="h-8 w-auto"
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "A EdunexIA revolucionou a forma como gerenciamos nossa instituição de ensino. A plataforma é intuitiva e a integração com IA nos ajuda a oferecer uma experiência personalizada para cada aluno."
            </p>
            <footer className="text-sm">Sofia Mendes - Diretora Acadêmica</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Selecione o Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Escolha o portal que deseja acessar
            </p>
          </div>
          <div className="grid gap-4">
            {portals.map((portal) => (
              <Button
                key={portal.role}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4"
                asChild
              >
                <Link href={`/auth/login?role=${portal.role}`}>
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-semibold">{portal.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {portal.description}
                    </span>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 