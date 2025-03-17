'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/client'
import type { ActionResponse } from '@/types/actions'
import { appErrors } from '@/lib/errors'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export const login = createSafeActionClient()
  .schema(loginSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const supabase = createClient()

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: parsedInput.email,
        password: parsedInput.password,
      })

      if (error) {
        throw error
      }

      // Armazena o token de acesso nos cookies
      const cookieStore = cookies()
      cookieStore.set('access_token', authData.session?.access_token || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      return { success: true, data: authData }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? appErrors.INVALID_CREDENTIALS : appErrors.UNEXPECTED_ERROR 
      }
    }
  }) 