'use client';

import Image from 'next/image';
import AuthForm from '@/components/AuthForm';
import { Decorations } from '@/components/Decorations';

export default function RecoveryPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <Decorations />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center">
          <Image
            src="/images/livro.png"
            alt="Livro feliz"
            width={120}
            height={120}
            className="mx-auto mb-4 md:mb-6 animate-bounce-slow w-24 h-24 md:w-32 md:h-32"
          />
        </div>
        <h2 className="mt-2 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
          Recuperar Senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digite seu email e enviaremos instruções para redefinir sua senha.
        </p>
      </div>

      <div className="mt-6 md:mt-8 w-full max-w-md relative z-10">
        <div className="bg-white py-6 md:py-8 px-4 md:px-10 shadow-rainbow rounded-2xl md:rounded-3xl transform transition-all hover:scale-[1.02] duration-300">
          <AuthForm type="recovery" />
        </div>
      </div>
    </div>
  );
}
