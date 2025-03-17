import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CommissionList } from '@/components/commissions/commission-list'
import { CommissionChart } from '@/components/commissions/commission-chart'

export const metadata: Metadata = {
  title: 'Comissões | EdunexIA LMS',
  description: 'Acompanhe suas comissões',
}

export default function PartnerCommissionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Comissões</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe suas comissões e histórico de pagamentos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Comissões</CardTitle>
            <CardDescription>
              Suas comissões dos últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommissionChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagamentos</CardTitle>
            <CardDescription>
              Histórico de pagamentos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommissionList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 