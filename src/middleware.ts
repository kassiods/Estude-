import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key not defined for middleware.');
    // Potentially redirect to an error page or allow access if misconfigured for public routes
    return response;
  }
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        request.cookies.set({ name, value, ...options }); // Update request cookies
        response.cookies.set({ name, value, ...options }); // Update response cookies
      },
      remove(name: string, options) {
        request.cookies.set({ name, value: '', ...options }); // Update request cookies
        response.cookies.set({ name, value: '', ...options }); // Update response cookies
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Define protected routes (app/* excluding auth pages and public API routes)
  const isProtectedRoute = pathname.startsWith('/app') && 
                           !pathname.startsWith('/app/api/auth'); // Exclude auth API routes from this check

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  if (isProtectedRoute && !session) {
    // User is not authenticated and trying to access a protected route
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isAuthRoute) {
    // User is authenticated and trying to access login/register page
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Redirect to dashboard
  }
  
  // Refresh session if expired - Supabase client handles this automatically
  // if (session) {
  //   await supabase.auth.refreshSession();
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (root path, handled by page.tsx)
     * - /api/ (allow public API routes, specific auth checks within routes)
     *   but we do want to run middleware for /api/ to grab user session if available
     */
    // '/((?!_next/static|_next/image|favicon.ico|api/auth/callback).*)',
     '/((?!_next/static|_next/image|favicon.ico).*)', // More general, specific API routes can check auth internally
  ],
};
