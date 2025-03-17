import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const path = request.nextUrl.pathname

  // Bypass authentication in development mode
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
    console.log('Bypass mode: Skipping authentication middleware')
    return response
  }

  // Public routes that don't require authentication
  if (
    path === '/' ||
    path === '/auth/login' ||
    path === '/auth/register' ||
    path === '/auth/reset-password' ||
    path.startsWith('/depoimentos') ||
    path.startsWith('/precos') ||
    path.startsWith('/suporte') ||
    path.startsWith('/termos') ||
    path.startsWith('/privacidade')
  ) {
    return response
  }

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Se não estiver autenticado e tentar acessar uma rota protegida
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se estiver autenticado e tentar acessar uma rota de autenticação
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/dashboard/:path*', '/auth/:path*'],
}
