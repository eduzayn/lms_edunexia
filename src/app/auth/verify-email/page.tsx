import { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Verifique seu Email | EdunexIA LMS',
  description: 'Verifique seu email para continuar',
}

export default function VerifyEmailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Verifique seu Email</CardTitle>
            <CardDescription>
              Enviamos um link de verificação para o seu email. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Se você não recebeu o email, verifique sua pasta de spam ou entre em contato com o suporte.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 