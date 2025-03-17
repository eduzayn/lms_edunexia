'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getCommissions } from '@/app/actions/commissions'

interface Commission {
  id: string
  amount: number
  status: 'pending' | 'paid'
  payment_date: string | null
  created_at: string
}

const statusMap = {
  pending: {
    label: 'Pendente',
    variant: 'default',
  },
  paid: {
    label: 'Pago',
    variant: 'success',
  },
} as const

export function CommissionList() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCommissions() {
      try {
        const result = await getCommissions()

        if (!result.data) {
          toast.error('Erro ao carregar comissões')
          return
        }

        setCommissions(result.data)
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
        Carregando comissões...
      </div>
    )
  }

  if (commissions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhuma comissão encontrada
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data Pagamento</TableHead>
            <TableHead>Data Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions.map((commission) => (
            <TableRow key={commission.id}>
              <TableCell className="font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(commission.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={statusMap[commission.status].variant as any}>
                  {statusMap[commission.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                {commission.payment_date
                  ? format(new Date(commission.payment_date), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })
                  : '-'}
              </TableCell>
              <TableCell>
                {format(new Date(commission.created_at), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 