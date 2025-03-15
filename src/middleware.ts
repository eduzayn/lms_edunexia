import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Development mode bypass for authentication
  // This allows developers to access protected routes without authentication
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    // Skip authentication checks in development mode
    console.log('Development mode: Bypassing authentication middleware');
    return NextResponse.next();
  }
  
  // Check if the user is authenticated (has a session token)
  const isAuthenticated = request.cookies.has('sb-access-token') || 
                          request.cookies.has('supabase-auth-token') ||
                          request.cookies.has('sb:token') ||
                          request.cookies.has('sb-refresh-token');
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                       path.startsWith('/auth/') || 
                       path.startsWith('/pricing') ||
                       path === '/student/login' ||
                       path === '/teacher/login' ||
                       path === '/admin/login';
  
  // If the user is on a public path and is authenticated, redirect to appropriate dashboard
  if (isPublicPath && isAuthenticated) {
    // Determine which dashboard to redirect to based on the path
    let dashboardPath = '/student/dashboard'; // Default
    
    if (path === '/admin/login') {
      dashboardPath = '/admin/dashboard';
    } else if (path === '/teacher/login') {
      dashboardPath = '/teacher/dashboard';
    }
    
    return NextResponse.redirect(new URL(dashboardPath, request.url));
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
