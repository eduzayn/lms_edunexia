'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/client'
import { appErrors } from '@/lib/errors'
import type { UserRole } from '@/types/supabase'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['admin', 'professor', 'aluno', 'polo', 'parceiro'] as const),
})

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
  companyName: z.string().min(3, 'Nome da empresa deve ter no mínimo 3 caracteres'),
  cnpj: z.string().min(14, 'CNPJ inválido').max(14, 'CNPJ inválido'),
  website: z.string().url('URL inválida').optional(),
  partnershipType: z.enum(['content', 'technology', 'infrastructure', 'marketing'], {
    required_error: 'Selecione o tipo de parceria',
  }),
  role: z.enum(['admin', 'professor', 'aluno', 'polo', 'parceiro'] as const),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
})

export const login = createSafeActionClient()
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    try {
      const supabase = createClient()

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: parsedInput.email,
        password: parsedInput.password,
      })

      if (error) {
        throw error
      }

      // Verifica se o usuário tem o papel correto
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user?.id)
        .single()

      if (profileError || !profileData) {
        throw new Error('Perfil não encontrado')
      }

      if (profileData.role !== parsedInput.role) {
        throw new Error('Usuário não tem permissão para acessar este portal')
      }

      // Armazena o token de acesso nos cookies
      const cookieStore = cookies()
      cookieStore.set({
        name: 'access_token',
        value: authData.session?.access_token || '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      return authData
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro inesperado')
    }
  })

export const register = createSafeActionClient()
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const supabase = createClient()

      // Registra o usuário
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: parsedInput.email,
        password: parsedInput.password,
        options: {
          data: {
            full_name: parsedInput.fullName,
            role: parsedInput.role,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (!authData.user) {
        throw new Error('Erro ao criar usuário')
      }

      // Cria o perfil do usuário
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: parsedInput.email,
        full_name: parsedInput.fullName,
        role: parsedInput.role,
        company_name: parsedInput.companyName,
        cnpj: parsedInput.cnpj,
        website: parsedInput.website,
        partnership_type: parsedInput.partnershipType,
      })

      if (profileError) {
        // Se houver erro ao criar o perfil, deleta o usuário
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw profileError
      }

      return authData
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro inesperado')
    }
  }) 