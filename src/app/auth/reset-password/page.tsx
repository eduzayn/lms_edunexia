import { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Redefinir Senha',
  description: 'Redefina sua senha do EdunexIA LMS',
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Redefinir Senha
        </h1>
        <p className="text-sm text-muted-foreground">
          Digite seu e-mail para receber um link de redefinição de senha
        </p>
      </div>
      <AuthForm mode="reset" />
    </div>
  )
} 