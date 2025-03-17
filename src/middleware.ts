import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import type { UserRole } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  const { data: { session } } = await supabase.auth.getSession()

  // Se não estiver autenticado e tentar acessar uma rota protegida
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/portal-selection', request.url))
  }

  // Se estiver autenticado e tentar acessar uma rota de autenticação
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url))
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
