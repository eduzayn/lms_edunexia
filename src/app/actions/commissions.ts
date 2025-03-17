'use server'

import { createSafeActionClient } from 'next-safe-action'
import { createClient } from '@/lib/supabase/client'

export const getCommissions = createSafeActionClient().action(async () => {
  try {
    const supabase = createClient()

    // Obtém o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Usuário não autenticado')
    }

    // Obtém as comissões do parceiro
    const { data: commissions, error: commissionsError } = await supabase
      .from('commissions')
      .select('*')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })

    if (commissionsError) {
      throw commissionsError
    }

    return { data: commissions }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro inesperado')
  }
}) 