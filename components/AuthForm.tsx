'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'register' | 'recovery';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (type === 'login') {
        await signIn(email, password);
      } else if (type === 'register') {
        await signUp(email, password, {
          data: {
            full_name: fullName,
            phone
          }
        });
      } else if (type === 'recovery') {
        await resetPassword(email);
        setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
      }
    } catch (err) {
      const error = err as Error;
      setError(
        error.message || 
        'Ocorreu um erro. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {type === 'register' && (
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nome completo
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            disabled={loading}
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          disabled={loading}
        />
      </div>

      {type === 'register' && (
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            disabled={loading}
          />
        </div>
      )}

      {type !== 'recovery' && (
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            disabled={loading}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : type === 'login' ? (
          'Entrar'
        ) : type === 'register' ? (
          'Cadastrar'
        ) : (
          'Recuperar Senha'
        )}
      </button>

      <div className="mt-6 text-sm text-center space-y-3">
        {type === 'login' && (
          <>
            <p>
              <Link 
                href="/auth/recovery" 
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Esqueceu sua senha?
              </Link>
            </p>
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link 
                href="/auth/register" 
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Cadastre-se
              </Link>
            </p>
          </>
        )}
        
        {type === 'register' && (
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Faça login
            </Link>
          </p>
        )}

        {type === 'recovery' && (
          <p className="text-gray-600">
            Lembrou sua senha?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Faça login
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
