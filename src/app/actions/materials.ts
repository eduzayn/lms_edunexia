'use server'

import { createSafeActionClient } from 'next-safe-action'
import { createClient } from '@/lib/supabase/client'

export const getMaterials = createSafeActionClient().action(async () => {
  try {
    const supabase = createClient()

    // Obtém o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Usuário não autenticado')
    }

    // Obtém os materiais disponíveis
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (materialsError) {
      throw materialsError
    }

    return { data: materials }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro inesperado')
  }
}) 