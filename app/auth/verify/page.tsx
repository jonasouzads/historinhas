'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Decorations } from '@/components/Decorations';

export default function VerifyPage() {
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
          Verifique seu email! 📧
        </h2>
        <p className="mt-4 text-center text-sm md:text-base text-gray-600">
          Enviamos um link de confirmação para o seu email.
          Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
        </p>
        <p className="mt-6 text-center text-sm md:text-base text-gray-600">
          Não recebeu o email?{' '}
          <button
            onClick={() => {
              // Aqui você pode adicionar a lógica para reenviar o email
              alert('Email de verificação reenviado!');
            }}
            className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors"
          >
            Reenviar email ✉️
          </button>
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
