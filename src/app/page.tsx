import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HomeContent } from '@/components/home/home-content'

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