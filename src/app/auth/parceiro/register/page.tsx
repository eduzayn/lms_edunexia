import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Registro de Parceiro | EdunexIA LMS',
  description: 'Cadastre-se como parceiro na plataforma',
}

export default function ParceiroRegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Registro de Parceiro</h1>
          <p className="text-muted-foreground mt-2">
            Cadastre-se como parceiro na plataforma
          </p>
        </div>

        <RegisterForm userRole="parceiro" />
      </div>
    </div>
  )
} 