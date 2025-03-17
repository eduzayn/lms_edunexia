import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const email = session.user.email || ''
  return (
    <HomeContent email={email} />
  )
}

"use client"
function HomeContent({ email }: { email: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Bem vindo ao LMS Edunexia</h1>
      <p className="mt-4 text-lg text-gray-600">
        Você está logado como {email}
      </p>
    </div>
  )
} 