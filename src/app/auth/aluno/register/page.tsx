import { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Cadastro | EdunexIA LMS',
  description: 'Crie sua conta de aluno na plataforma',
}

export default function RegisterPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar Conta de Aluno
          </h1>
          <p className="text-sm text-muted-foreground">
            Preencha seus dados para criar sua conta
          </p>
        </div>
        <AuthForm type="register" />
      </div>
    </div>
  )
} 