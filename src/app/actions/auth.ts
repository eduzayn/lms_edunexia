'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { appErrors } from '@/types/errors'
import type { ActionResponse } from '@/types/actions'

const action = createSafeActionClient()

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export const signIn = action
  .schema(signInSchema)
  .action(async (args) => {
    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: args.parsedInput.email,
        password: args.parsedInput.password,
      })

      if (error) {
        if (error.status === 400) {
          return {
            success: false,
            error: appErrors.INVALID_CREDENTIALS,
          }
        }

        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      }
    }
  })

const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
})

export const signUp = action
  .schema(signUpSchema)
  .action(async (args) => {
    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email: args.parsedInput.email,
        password: args.parsedInput.password,
        options: {
          data: {
            name: args.parsedInput.name,
          },
        },
      })

      if (error) {
        if (error.status === 400) {
          return {
            success: false,
            error: appErrors.USER_ALREADY_EXISTS,
          }
        }

        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      }
    }
  })

const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const resetPassword = action
  .schema(resetPasswordSchema)
  .action(async (args) => {
    try {
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(args.parsedInput.email)

      if (error) {
        if (error.status === 400) {
          return {
            success: false,
            error: appErrors.USER_NOT_FOUND,
          }
        }

        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      }
    }
  }) 