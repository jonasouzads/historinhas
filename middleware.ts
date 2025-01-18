import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res });

  // Se for uma rota de verificação, permite passar
  if (request.nextUrl.pathname.startsWith('/auth/verify')) {
    return res;
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log('Session check:', session ? 'Session exists' : 'No session');

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Se a rota começa com /admin, verifica se o usuário é admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
      console.log('Checking admin access for user:', session.user.id);
      
      // Use service role client for admin check
      const supabaseAdmin = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      console.log('Admin check result:', { data, error });
      
      if (!data || data.role !== 'admin') {
        console.log('Access denied: User is not admin');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      console.log('Admin access granted');
    }

    return res;
  } catch (error) {
    console.error('Erro no middleware:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
  ],
}
