"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { signIn, signUp, resetPassword } from '@/app/actions/auth'

export type AuthFormMode = 'login' | 'register' | 'reset'

export interface AuthFormProps {
  mode: AuthFormMode
}

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
})

const resetSchema = z.object({
  email: z.string().email('Email inválido'),
})

type FormData = 
  | z.infer<typeof loginSchema>
  | z.infer<typeof registerSchema>
  | z.infer<typeof resetSchema>

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const schema = mode === 'register' ? registerSchema : mode === 'reset' ? resetSchema : loginSchema

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      ...(mode !== 'reset' && { password: '' }),
      ...(mode === 'register' && { name: '' }),
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    try {
      if (mode === 'register') {
        const result = await signUp({
          email: values.email,
          password: (values as z.infer<typeof registerSchema>).password,
          name: (values as z.infer<typeof registerSchema>).name,
        })
        if (!result?.success) {
          toast({
            title: 'Erro',
            description: result?.error?.message ?? 'Ocorreu um erro ao criar a conta',
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Sucesso',
          description: 'Conta criada com sucesso! Verifique seu email para confirmar o cadastro.',
        })
      } else if (mode === 'reset') {
        const result = await resetPassword({
          email: values.email,
        })
        if (!result?.success) {
          toast({
            title: 'Erro',
            description: result?.error?.message ?? 'Ocorreu um erro ao enviar o email',
            variant: 'destructive',
          })
          return
        }
        toast({
          title: 'Sucesso',
          description: 'Email enviado com sucesso! Verifique sua caixa de entrada.',
        })
      } else {
        const result = await signIn({
          email: values.email,
          password: (values as z.infer<typeof loginSchema>).password,
        })
        if (!result?.success) {
          toast({
            title: 'Erro',
            description: result?.error?.message ?? 'Ocorreu um erro ao fazer login',
            variant: 'destructive',
          })
          return
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'register' && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="exemplo@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {mode !== 'reset' && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Aguarde...
              </div>
            ) : mode === 'register' ? (
              'Criar conta'
            ) : mode === 'reset' ? (
              'Enviar instruções'
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        {mode === 'login' ? (
          <>
            Não tem uma conta?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              Criar conta
            </Link>
            <br />
            <Link href="/auth/reset-password" className="text-primary hover:underline">
              Esqueceu sua senha?
            </Link>
          </>
        ) : mode === 'register' ? (
          <>
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </>
        ) : (
          <Link href="/auth/login" className="text-primary hover:underline">
            Voltar para o login
          </Link>
        )}
      </div>
    </div>
  )
} 