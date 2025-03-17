'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const updateSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
})

export const updateSettings = createSafeActionClient()
  .schema(updateSettingsSchema)
  .action(async ({ parsedInput }) => {
    try {
      const supabase = createClient()

      // Obtém o usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('Usuário não autenticado')
      }

      // Atualiza as configurações do usuário
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email_notifications: parsedInput.emailNotifications,
          push_notifications: parsedInput.pushNotifications,
          marketing_emails: parsedInput.marketingEmails,
          security_alerts: parsedInput.securityAlerts,
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