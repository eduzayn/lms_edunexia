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
import { signIn } from '@/app/actions/auth'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type FormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    try {
      const result = await signIn({
        email: values.email,
        password: values.password,
      })
      if (!result?.success) {
        toast({
          title: 'Erro',
          description: result?.error?.message ?? 'Ocorreu um erro ao fazer login',
          variant: 'destructive',
        })
        return
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Aguarde...
              </div>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Não tem uma conta?{' '}
        <Link href="/auth/register" className="text-primary hover:underline">
          Criar conta
        </Link>
        <br />
        <Link href="/auth/reset-password" className="text-primary hover:underline">
          Esqueceu sua senha?
        </Link>
      </div>
    </div>
  )
} 