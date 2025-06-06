
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite acesso à nova página inicial, login e registro sem redirecionamento.
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // Se a rota começar com /app (ex: /app/dashboard, /app/courses),
  // permite o acesso, pois o AppLayout usará um usuário mockado.
  // Em uma aplicação real, aqui haveria uma verificação de sessão.
  if (pathname.startsWith('/app')) {
    return NextResponse.next();
  }
  
  // Para todas as outras rotas não explicitamente tratadas acima,
  // e que não são arquivos estáticos ou de API,
  // talvez redirecionar para a página inicial como um fallback.
  // Ou, se preferir, pode deixar como está para permitir acesso a outras rotas públicas
  // que possam existir (ex: /api/*)
  // Por enquanto, vamos deixar passar para não interferir com as rotas de API.
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
     * - api (API routes, já que não estamos protegendo-as no middleware por enquanto)
     *
     * Isso garante que o middleware rode na raiz, login, registro, e rotas do app.
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|api).*)',
  ],
};
