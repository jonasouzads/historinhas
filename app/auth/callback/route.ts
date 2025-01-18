import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendWebhook } from '@/lib/webhooks';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      const { data: { user }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        throw exchangeError;
      }

      if (user) {
        // Enviar webhook apenas para novos usuários
        if (type === 'signup') {
          await sendWebhook('user_created', {
            id: user.id,
            email: user.email,
            phone: user.user_metadata?.phone,
            full_name: user.user_metadata?.full_name,
          });
        }
      }

      // Se for uma redefinição de senha, redireciona para a página de reset
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/auth/reset', requestUrl.origin));
      }

      // Caso contrário, redireciona para o dashboard ou a página especificada
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.redirect(
        new URL('/auth/error?error=Erro ao processar autenticação', requestUrl.origin)
      );
    }
  }

  // Se não houver código, redireciona para a página inicial
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
