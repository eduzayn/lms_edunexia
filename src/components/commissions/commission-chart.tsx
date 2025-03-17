'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getCommissions } from '@/app/actions/commissions'

interface Commission {
  id: string
  amount: number
  status: 'pending' | 'paid'
  payment_date: string | null
  created_at: string
}

interface ChartData {
  month: string
  amount: number
}

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function CommissionChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCommissions() {
      try {
        const result = await getCommissions()

        if (!result.data) {
          toast.error('Erro ao carregar comissões')
          return
        }

        // Agrupa as comissões por mês
        const groupedByMonth = result.data.reduce((acc, commission) => {
          const date = new Date(commission.created_at)
          const month = months[date.getMonth()]
          const year = date.getFullYear()
          const key = `${month} ${year}`

          if (!acc[key]) {
            acc[key] = 0
          }

          acc[key] += commission.amount
          return acc
        }, {} as Record<string, number>)

        // Converte para o formato do gráfico
        const data = Object.entries(groupedByMonth).map(([month, amount]) => ({
          month,
          amount,
        }))

        setChartData(data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao carregar comissões')
      } finally {
        setIsLoading(false)
      }
    }

    loadCommissions()
  }, [])

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Carregando gráfico...
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhuma comissão encontrada
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value)
            }
          />
          <Bar dataKey="amount" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 