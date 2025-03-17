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
import { getReferrals } from '@/app/actions/referrals'

interface Referral {
  id: string
  name: string
  email: string
  phone: string
  type: 'student' | 'institution'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const statusMap = {
  pending: {
    label: 'Pendente',
    variant: 'default',
  },
  approved: {
    label: 'Aprovada',
    variant: 'success',
  },
  rejected: {
    label: 'Rejeitada',
    variant: 'destructive',
  },
} as const

const typeMap = {
  student: 'Aluno',
  institution: 'Instituição',
} as const

export function ReferralList() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadReferrals() {
      try {
        const result = await getReferrals()

        if (!result.data) {
          toast.error('Erro ao carregar indicações')
          return
        }

        setReferrals(result.data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao carregar indicações')
      } finally {
        setIsLoading(false)
      }
    }

    loadReferrals()
  }, [])

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Carregando indicações...
      </div>
    )
  }

  if (referrals.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhuma indicação encontrada
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell className="font-medium">{referral.name}</TableCell>
              <TableCell>{typeMap[referral.type]}</TableCell>
              <TableCell>
                <Badge variant={statusMap[referral.status].variant as any}>
                  {statusMap[referral.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(referral.created_at), "dd 'de' MMMM 'de' yyyy", {
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