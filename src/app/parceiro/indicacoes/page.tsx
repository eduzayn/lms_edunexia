import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReferralForm } from '@/components/forms/referral-form'
import { ReferralList } from '@/components/referrals/referral-list'

export const metadata: Metadata = {
  title: 'Indicações | EdunexIA LMS',
  description: 'Gerencie suas indicações',
}

export default function PartnerReferralsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Indicações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas indicações e acompanhe o status
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nova Indicação</CardTitle>
            <CardDescription>
              Indique um novo aluno ou instituição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReferralForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suas Indicações</CardTitle>
            <CardDescription>
              Acompanhe o status das suas indicações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReferralList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 