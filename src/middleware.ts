import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas públicas
  const publicRoutes = ['/auth/login', '/auth/portal-selection']
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    // Se estiver logado e tentar acessar rota pública, redireciona para o dashboard
    if (session) {
      // Verifica o perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role) {
        return NextResponse.redirect(new URL(`/${profile.role}/dashboard`, request.url))
      }
    }
    return res
  }

  // Rotas protegidas
  if (!session) {
    return NextResponse.redirect(new URL('/auth/portal-selection', request.url))
  }

  // Verifica se o usuário tem permissão para acessar a rota
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const portal = request.nextUrl.pathname.split('/')[1]
  if (profile?.role !== portal) {
    return NextResponse.redirect(new URL('/auth/portal-selection', request.url))
  }

  return res
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/student/:path*',
    '/teacher/:path*',
    '/admin/:path*',
    '/institution/:path*',
  ],
}
