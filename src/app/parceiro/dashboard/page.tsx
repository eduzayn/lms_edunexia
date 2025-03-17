import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, TrendingUp, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard do Parceiro | EdunexIA LMS',
  description: 'Gerencie sua parceria e acompanhe suas comissões',
}

const stats = [
  {
    title: 'Comissões do Mês',
    value: 'R$ 0,00',
    description: 'Total de comissões no mês atual',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Alunos Indicados',
    value: '0',
    description: 'Total de alunos indicados',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Taxa de Conversão',
    value: '0%',
    description: 'Taxa de conversão de indicações',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Indicações Ativas',
    value: '0',
    description: 'Indicações em andamento',
    icon: Activity,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
]

export default function PartnerDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard do Parceiro</h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Indicações</CardTitle>
            <CardDescription>Suas indicações mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Nenhuma indicação encontrada
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Comissões</CardTitle>
            <CardDescription>Suas comissões dos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Nenhuma comissão encontrada
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 