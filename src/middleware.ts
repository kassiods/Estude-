
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root path to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For all other paths, including /app/*, allow the request to proceed.
  // No session check is performed here anymore.
  return NextResponse.next({
    request: {
      headers: request.headers,
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
     * This ensures middleware runs on / and other app pages.
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js).*)',
  ],
};
