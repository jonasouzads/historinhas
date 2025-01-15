'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import type { Database } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Child = Database['public']['Tables']['children']['Row'];

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [newChild, setNewChild] = useState({ name: '', age: '', gender: 'menino' });
  const supabase = createClientComponentClient<Database>();

  const loadChildren = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setChildren(data);
    }
  }, [supabase]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChild.name || !newChild.age) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('children')
      .insert([{
        user_id: user.id,
        name: newChild.name,
        age: parseInt(newChild.age),
        gender: newChild.gender as 'menino' | 'menina',
      }]);

    if (error) {
      toast.error('Erro ao adicionar criança');
      return;
    }

    toast.success('Criança adicionada com sucesso!');
    setNewChild({ name: '', age: '', gender: 'menino' });
    loadChildren();
  };

  const handleDeleteChild = async (childId: string) => {
    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', childId);

    if (error) {
      toast.error('Erro ao remover criança');
      return;
    }

    toast.success('Criança removida com sucesso');
    loadChildren();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Minhas Crianças</h1>
              <Link
                href="/profile"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Voltar ao Perfil
              </Link>
            </div>

            {/* Lista de Crianças */}
            <div className="space-y-4 mb-8">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {child.gender === 'menino' ? '👦' : '👧'}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{child.name}</h3>
                      <p className="text-sm text-gray-500">{child.age} anos</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteChild(child.id)}
                    className="text-red-600 hover:text-red-700 focus:outline-none"
                  >
                    <span className="sr-only">Remover</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Formulário para Adicionar Nova Criança */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Adicionar Nova Criança
              </h2>
              <form onSubmit={handleAddChild} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={newChild.name}
                      onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Idade
                    </label>
                    <input
                      type="number"
                      value={newChild.age}
                      onChange={(e) => setNewChild({ ...newChild, age: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                      min="0"
                      max="18"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="menino"
                        checked={newChild.gender === 'menino'}
                        onChange={(e) => setNewChild({ ...newChild, gender: e.target.value })}
                        className="form-radio text-primary-600"
                      />
                      <span className="ml-2">Menino 👦</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="menina"
                        checked={newChild.gender === 'menina'}
                        onChange={(e) => setNewChild({ ...newChild, gender: e.target.value })}
                        className="form-radio text-primary-600"
                      />
                      <span className="ml-2">Menina 👧</span>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Adicionar Criança
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
