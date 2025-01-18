'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Decorations } from '@/components/Decorations';
import { AuthError } from '@supabase/supabase-js';

// Componente que lida com a verificação
function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token) {
        setError('Token de verificação não encontrado');
        setVerifying(false);
        return;
      }

      try {
        const supabase = createClientComponentClient();

        if (type === 'signup') {
          // Para signup, verificamos o token
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });

          if (verifyError) throw verifyError;

          // Após verificação bem-sucedida, redireciona para o dashboard
          router.push('/dashboard');
        } else if (type === 'recovery') {
          // Para recuperação de senha, redireciona para a página de redefinição
          router.push(`/auth/reset-password?token=${token}`);
        } else {
          throw new Error('Tipo de verificação inválido');
        }
      } catch (err) {
        console.error('Erro na verificação:', err);
        const errorMessage = err instanceof AuthError ? err.message : 'Erro ao verificar o token';
        setError(errorMessage);
        setVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
        <Decorations />
        <div className="w-full max-w-md relative z-10">
          <div className="text-center">
            <Image
              src="/images/loading-star.svg"
              alt="Verificando..."
              width={120}
              height={120}
              className="mx-auto mb-4 md:mb-6 w-24 h-24 md:w-32 md:h-32 animate-spin"
            />
          </div>
          <h2 className="mt-2 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
            Verificando... ⭐
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <Decorations />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center">
          <Image
            src="/images/email.svg"
            alt="Email"
            width={120}
            height={120}
            className="mx-auto mb-4 md:mb-6 w-24 h-24 md:w-32 md:h-32 animate-float"
          />
        </div>
        <h2 className="mt-2 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
          {error ? 'Ops! Algo deu errado 😕' : 'Verifique seu email! 📧'}
        </h2>
        <p className="mt-4 text-center text-sm md:text-base text-gray-600">
          {error || 'Enviamos um link de confirmação para o seu email. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.'}
        </p>
        <div className="mt-8 text-center">
          <Link
            href="/auth/login"
            className="text-sm md:text-base text-gray-500 hover:text-gray-700 transition-colors"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

// Loading fallback
function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <Decorations />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center">
          <Image
            src="/images/loading-star.svg"
            alt="Carregando..."
            width={120}
            height={120}
            className="mx-auto mb-4 md:mb-6 w-24 h-24 md:w-32 md:h-32 animate-spin"
          />
        </div>
        <h2 className="mt-2 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
          Carregando... ⭐
        </h2>
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyContent />
    </Suspense>
  );
}
