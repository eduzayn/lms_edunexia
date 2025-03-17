import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login do Parceiro | EdunexIA LMS',
  description: 'Faça login no Portal do Parceiro',
}

export default function ParceiroLoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Portal do Parceiro</h1>
          <p className="text-muted-foreground mt-2">
            Faça login para acessar sua área de parceiro
          </p>
        </div>

        <LoginForm userRole="parceiro" />
      </div>
    </div>
  )
} 