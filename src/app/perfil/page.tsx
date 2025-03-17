"use client"

import { useAuth } from '@/contexts/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

const profileSchema = z.object({
  full_name: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await updateProfile(data)

      if (error) {
        setError('root', {
          message: error.message,
        })
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: error.message,
        })
      } else {
        toast({
          title: 'Sucesso',
          description: 'Perfil atualizado com sucesso!',
        })
      }
    } catch (error) {
      setError('root', {
        message: 'Erro ao atualizar perfil. Tente novamente.',
      })
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao atualizar perfil. Tente novamente.',
      })
    }
  }

  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome completo</Label>
              <Input
                {...register('full_name')}
                type="text"
                id="full_name"
                aria-invalid={!!errors.full_name}
                aria-describedby={errors.full_name ? 'full_name-error' : undefined}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive" id="full_name-error">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email')}
                type="email"
                id="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p className="text-sm text-destructive" id="email-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            {errors.root && (
              <div className="rounded-md bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{errors.root.message}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 