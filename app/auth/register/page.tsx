'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { Decorations } from '@/components/Decorations';

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-bounce">
          <Image
            src="/images/loading-star.svg"
            alt="Carregando..."
            width={100}
            height={100}
          />
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
            src="/images/livro.png"
            alt="Varinha mágica"
            width={120}
            height={120}
            className="mx-auto mb-4 md:mb-6 animate-wiggle w-24 h-24 md:w-32 md:h-32"
          />
        </div>
        <h2 className="mt-2 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
          Vamos começar a magia!
        </h2>
      </div>

      <div className="mt-6 md:mt-8 w-full max-w-md relative z-10">
        <div className="bg-white py-6 md:py-8 px-4 md:px-10 shadow-rainbow rounded-2xl md:rounded-3xl transform transition-all hover:scale-[1.02] duration-300">
          <AuthForm type="register" />
        </div>
      </div>
    </div>
  );
}
