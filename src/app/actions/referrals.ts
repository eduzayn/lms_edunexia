'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const createReferralSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido').max(11, 'Telefone inválido'),
  type: z.enum(['student', 'institution'], {
    required_error: 'Selecione o tipo de indicação',
  }),
  notes: z.string().optional(),
})

export const createReferral = createSafeActionClient()
  .schema(createReferralSchema)
  .action(async ({ parsedInput }) => {
    try {
      const supabase = createClient()

      // Obtém o usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('Usuário não autenticado')
      }

      // Cria a indicação
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .insert({
          partner_id: user.id,
          name: parsedInput.name,
          email: parsedInput.email,
          phone: parsedInput.phone,
          type: parsedInput.type,
          notes: parsedInput.notes,
          status: 'pending',
        })
        .select()
        .single()

      if (referralError) {
        throw referralError
      }

      return { data: referral }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro inesperado')
    }
  })

export const getReferrals = createSafeActionClient().action(async () => {
  try {
    const supabase = createClient()

    // Obtém o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Usuário não autenticado')
    }

    // Obtém as indicações do parceiro
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })

    if (referralsError) {
      throw referralsError
    }

    return { data: referrals }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro inesperado')
  }
}) 