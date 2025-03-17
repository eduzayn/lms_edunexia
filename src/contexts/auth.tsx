import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type UserRole = 'admin' | 'professor' | 'aluno' | 'polo'

interface Profile {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
}

interface AuthContextType {
  user: Profile | null
  loading: boolean
  signIn: (email: string, password: string, role: UserRole) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setUser(data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seu perfil',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string, role: UserRole) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verificar se o usuário tem a role correta
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      if (profile.role !== role) {
        await signOut()
        throw new Error('Acesso não autorizado para este portal')
      }

      router.push(`/${role}/dashboard`)
    } catch (error: any) {
      console.error('Erro no login:', error)
      toast({
        title: 'Erro no login',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Criar perfil do usuário
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user!.id,
          email,
          name,
          role: 'aluno', // Registro padrão como aluno
        },
      ])

      if (profileError) throw profileError

      toast({
        title: 'Cadastro realizado!',
        description: 'Verifique seu email para confirmar o cadastro.',
      })

      router.push('/auth/verify-email')
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      toast({
        title: 'Erro no cadastro',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push('/')
    } catch (error: any) {
      console.error('Erro ao sair:', error)
      toast({
        title: 'Erro ao sair',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      toast({
        title: 'Email enviado',
        description: 'Verifique seu email para redefinir sua senha.',
      })
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error)
      toast({
        title: 'Erro ao resetar senha',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi atualizada com sucesso.',
      })

      router.push('/auth/login')
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error)
      toast({
        title: 'Erro ao atualizar senha',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function updateProfile(profile: Partial<Profile>) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user?.id)

      if (error) throw error

      // Atualizar estado local
      setUser(prev => prev ? { ...prev, ...profile } : null)

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      })
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 