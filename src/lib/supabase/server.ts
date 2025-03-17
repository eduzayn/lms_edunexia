'use server'

import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { type CookieOptions, type Cookie } from '@supabase/ssr'
import { type NextApiRequest, type NextApiResponse } from 'next'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = (request: NextApiRequest, response: NextApiResponse) => {
  const cookieStore = {
    get: (name: string) => {
      const cookies = request.cookies
      const cookie = cookies[name]
      return cookie
    },
    set: (name: string, value: string, options: CookieOptions) => {
      response.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax`)
    },
    remove: (name: string, options: CookieOptions) => {
      response.setHeader('Set-Cookie', `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    },
  }

  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: cookieStore
    }
  )
} 