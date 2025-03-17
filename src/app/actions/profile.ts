'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const updateProfileSchema = z.object({
  fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
  companyName: z.string().min(3, 'Nome da empresa deve ter no mínimo 3 caracteres'),
  cnpj: z.string().min(14, 'CNPJ inválido').max(14, 'CNPJ inválido'),
  website: z.string().url('URL inválida').optional(),
  partnershipType: z.enum(['content', 'technology', 'infrastructure', 'marketing'], {
    required_error: 'Selecione o tipo de parceria',
  }),
})

export const updateProfile = createSafeActionClient()
  .schema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    try {
      const supabase = createClient()

      // Obtém o usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('Usuário não autenticado')
      }

      // Atualiza o perfil do usuário
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: parsedInput.fullName,
          company_name: parsedInput.companyName,
          cnpj: parsedInput.cnpj,
          website: parsedInput.website,
          partnership_type: parsedInput.partnershipType,
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      return { data: { success: true } }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro inesperado')
    }
  }) 