import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if the user is authenticated (has a session token)
  const isAuthenticated = request.cookies.has('sb-access-token') || 
                          request.cookies.has('supabase-auth-token');
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                       path.startsWith('/auth/') || 
                       path.startsWith('/pricing') ||
                       path === '/student/login' ||
                       path === '/teacher/login' ||
                       path === '/admin/login';
  
  // If the user is on a public path and is authenticated, redirect to dashboard
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }
  
  // If the user is on a protected path and is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
