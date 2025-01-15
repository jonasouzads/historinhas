import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/verify', '/auth/callback'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // Se não houver sessão e a rota não for pública, redireciona para login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Se houver sessão e tentar acessar rotas de auth, redireciona para dashboard
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/criar-historia/:path*',
    '/minhas-historias/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
};
