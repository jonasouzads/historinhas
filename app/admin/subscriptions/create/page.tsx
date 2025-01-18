'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database } from '@/lib/supabase';
import type { SubscriptionPlan } from '@/lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function CreateSubscription() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [userId, setUserId] = useState('');
  const [planType, setPlanType] = useState<SubscriptionPlan>('magic');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar lista de usuários');
    }
  }, [supabase]);

  useEffect(() => {
    loadUsers();
    // Set default start date as today
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    // Set default end date as 30 days from today
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);
    setEndDate(defaultEndDate.toISOString().split('T')[0]);
  }, [loadUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_type: planType,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          status: 'active'
        });

      if (error) throw error;

      router.push('/admin/subscriptions');
      router.refresh();
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      setError('Erro ao criar assinatura. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Criar Nova Assinatura</h1>
          <Link
            href="/admin/subscriptions"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Voltar
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuário
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Selecione um usuário</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Plano
            </label>
            <div className="mt-1 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="magic"
                  checked={planType === 'magic'}
                  onChange={(e) => setPlanType(e.target.value as SubscriptionPlan)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Plano Mágico</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="family"
                  checked={planType === 'family'}
                  onChange={(e) => setPlanType(e.target.value as SubscriptionPlan)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Plano Família</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Término
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Criando...' : 'Criar Assinatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
