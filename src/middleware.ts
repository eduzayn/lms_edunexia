import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { UserRole } from '@/types/supabase'

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

  // Verifica se o usuário está autenticado
  const {
    data: { session: supabaseSession },
  } = await supabase.auth.getSession()

  // Rotas públicas
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/verify-email',
    '/auth/reset-password',
  ]

  // Rotas protegidas por papel
  const protectedRoutes: Record<UserRole, string[]> = {
    admin: ['/admin'],
    professor: ['/professor'],
    aluno: ['/aluno'],
    polo: ['/polo'],
    parceiro: ['/parceiro'],
  }

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Se for uma rota pública e o usuário estiver autenticado, redireciona para o dashboard apropriado
  if (isPublicRoute && supabaseSession) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', supabaseSession.user.id)
      .single()

    if (profile?.role && profile.role in protectedRoutes) {
      const dashboardRoutes: Record<UserRole, string> = {
        admin: '/admin/dashboard',
        professor: '/professor/dashboard',
        aluno: '/aluno/dashboard',
        polo: '/polo/dashboard',
        parceiro: '/parceiro/dashboard',
      }

      return NextResponse.redirect(
        new URL(dashboardRoutes[profile.role as UserRole], request.url)
      )
    }
  }

  // Se o usuário estiver autenticado, verifica se ele tem permissão para acessar a rota
  if (supabaseSession) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', supabaseSession.user.id)
      .single()

    if (profile?.role) {
      // Verifica se a rota atual pertence a outro papel
      const isUnauthorizedRoute = Object.entries(protectedRoutes).some(
        ([role, routes]) =>
          role !== profile.role &&
          routes.some((route) => request.nextUrl.pathname.startsWith(route))
      )

      if (isUnauthorizedRoute) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/dashboard/:path*', '/auth/:path*'],
}
