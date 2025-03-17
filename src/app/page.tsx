import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold">Bem-vindo ao EdunexIA LMS</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Você está logado como {session.user.email}
      </p>
    </div>
  )
} 