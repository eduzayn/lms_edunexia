import { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Registro',
  description: 'Crie sua conta no EdunexIA LMS',
}

export default function RegisterPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crie sua conta
        </h1>
        <p className="text-sm text-muted-foreground">
          Preencha os campos abaixo para criar sua conta
        </p>
      </div>
      <AuthForm mode="register" />
    </div>
  )
} 