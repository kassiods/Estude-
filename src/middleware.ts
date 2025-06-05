
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  // Handle root path redirection
  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /app/* routes: redirect to login if not authenticated
  // Exclude API routes that handle auth callback or specific public needs if any.
  // For example, /api/auth/callback should not be protected here.
  if (pathname.startsWith('/app') && !session) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users from login/register pages to dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Default: allow the request to proceed
  return NextResponse.next({
    request: {
      headers: request.headers, // Pass through original headers
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json, sw.js, workbox files (PWA assets)
     *
     * This ensures middleware runs on /, /app/*, /login, /register, etc.
     * but not on static assets.
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js).*)',
  ],
};
