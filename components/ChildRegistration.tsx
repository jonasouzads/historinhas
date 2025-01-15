'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase';

type Child = Database['public']['Tables']['children']['Row'];

export interface ChildRegistrationProps {
  onClose: () => void;
  onChildAdded?: (child: Child) => void;
  isFirstChild?: boolean;
}

export default function ChildRegistration({ 
  onClose, 
  onChildAdded, 
  isFirstChild = false 
}: ChildRegistrationProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'menino' | 'menina'>('menino');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        throw new Error('Por favor, insira o nome da criança');
      }

      const ageNumber = parseInt(age);
      if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 18) {
        throw new Error('Por favor, insira uma idade válida (0-18 anos)');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('children')
        .insert([{
          user_id: user.id,
          name: name.trim(),
          age: ageNumber,
          gender
        }])
        .select()
        .single();

      if (error) throw error;

      if (data && onChildAdded) {
        onChildAdded(data);
      }

      // Limpar formulário após sucesso
      setName('');
      setAge('');
      setGender('menino');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar criança');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-rainbow p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isFirstChild ? '👋 Bem-vindo!' : 'Cadastrar Nova Criança'}
        </h2>
        <p className="text-gray-600">
          {isFirstChild
            ? 'Para começar, vamos cadastrar sua primeira criança'
            : 'Preencha os dados abaixo para cadastrar uma nova criança'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Criança
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Digite o nome da criança"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Idade
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="0"
            max="18"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Digite a idade"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gênero
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setGender('menino')}
              className={`p-4 rounded-lg border ${
                gender === 'menino'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
              } transition-colors`}
              disabled={isSubmitting}
            >
              <span className="text-2xl mb-1">👦</span>
              <span className="block text-sm">Menino</span>
            </button>
            <button
              type="button"
              onClick={() => setGender('menina')}
              className={`p-4 rounded-lg border ${
                gender === 'menina'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
              } transition-colors`}
              disabled={isSubmitting}
            >
              <span className="text-2xl mb-1">👧</span>
              <span className="block text-sm">Menina</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Criança'}
          </button>
        </div>
      </form>
    </div>
  );
}
