import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    // Faz o logout no Supabase
    await supabase.auth.signOut()

    // Remove o cookie de acesso
    cookies().delete('access_token')

    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL))
  } catch (error) {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL))
  }
} 