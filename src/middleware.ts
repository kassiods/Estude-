
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseServerClient(); // Uses anon key by default

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Define protected routes (app/* excluding auth pages and specific public API routes)
  const isAppRoute = pathname.startsWith('/app');
  const isAuthApiRoute = pathname.startsWith('/api/auth'); // e.g. /api/auth/callback
  const isPublicApiRoute = pathname.startsWith('/api/courses') && request.method === 'GET'; // Example: Publicly list courses

  const isProtectedRoute = isAppRoute && !isAuthApiRoute && !pathname.startsWith('/api/users/me'); 
                          // `/api/users/me` handles its own auth check but needs to be accessible to try

  const isAuthPageRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  if (isProtectedRoute && !session) {
    // User is not authenticated and trying to access a protected app route
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', pathname); // Optional: for redirecting back after login
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isAuthPageRoute) {
    // User is authenticated and trying to access login/register page
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Refresh session if expired - Supabase client handles this automatically with `getSession`
  // No need to explicitly call refreshSession usually.

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (root path, usually public landing page)
     * - Specific public assets or routes if any
     *
     * The goal is to run middleware for most app routes and API routes
     * to handle session management and protection.
     */
     '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js).*)',
  ],
};
