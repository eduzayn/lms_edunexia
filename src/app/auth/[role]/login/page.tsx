import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { UserRole } from '@/contexts/auth'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Login | EdunexIA LMS',
  description: 'Faça login para acessar a plataforma',
}

const roleLabels: Record<UserRole, string> = {
  aluno: 'Portal do Aluno',
  professor: 'Portal do Professor',
  polo: 'Portal do Polo',
  admin: 'Portal Administrativo',
}

interface LoginPageProps {
  params: {
    role: string
  }
}

export default function LoginPage({ params }: LoginPageProps) {
  // Validar se o role é válido
  if (!Object.keys(roleLabels).includes(params.role)) {
    notFound()
  }

  const role = params.role as UserRole
  
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {roleLabels[role]}
          </h1>
          <p className="text-sm text-muted-foreground">
            Entre com suas credenciais para acessar
          </p>
        </div>
        <AuthForm type="login" role={role} />
      </div>
    </div>
  )
} 