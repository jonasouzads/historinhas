'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Database } from '@/lib/supabase';
import { SubscriptionPlan } from '@/lib/supabase';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];

const plans = [
  {
    name: "Plano Mágico",
    price: "R$ 14,90",
    paymentLink: "https://pay.kiwify.com.br/mxHAUaX",
    features: [
      "Histórias ilimitadas",
      "Todas as personalizações",
      "Biblioteca completa",
      "Suporte por email",
      "Temas exclusivos",
      "Exportação em PDF"
    ],
    type: 'magic' as SubscriptionPlan,
    color: "primary"
  },
  {
    name: "Plano Família",
    price: "R$ 19,90",
    paymentLink: "https://pay.kiwify.com.br/0aunU62",
    features: [
      "Tudo do Plano Mágico",
      "Até 3 perfis infantis",
      "Histórias compartilháveis",
      "Suporte prioritário",
      "Temas premium",
      "Backup na nuvem"
    ],
    type: 'family' as SubscriptionPlan,
    color: "secondary",
    popular: true
  }
];

function getSubscriptionStatus(subscription: Subscription | null): { status: string; color: string } {
  if (!subscription) {
    return { status: 'Sem assinatura ativa', color: 'text-gray-500' };
  }

  const now = new Date();
  const endDate = new Date(subscription.end_date);

  if (subscription.status === 'canceled') {
    return { status: 'Cancelada', color: 'text-red-500' };
  }

  if (subscription.status === 'expired') {
    return { status: 'Expirada', color: 'text-yellow-500' };
  }

  if (endDate < now) {
    return { status: 'Atrasada', color: 'text-orange-500' };
  }

  return { status: 'Ativa', color: 'text-green-500' };
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function loadSubscriptions() {
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setSubscriptions(data || []);
      } catch (error) {
        console.error('Erro ao carregar assinaturas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptions();
  }, [user, router, supabase]);

  const handleSelectPlan = async (planName: string, paymentLink: string) => {
    setSelectedPlan(planName);
    window.open(paymentLink, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Faça login para ver os planos</h2>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentSubscription = subscriptions[0];
  const { status: subscriptionStatus, color: statusColor } = getSubscriptionStatus(currentSubscription);

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Escolha o Plano Ideal para Sua Família
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Comece a criar histórias mágicas hoje mesmo e encante seus pequenos com narrativas únicas e personalizadas
        </p>
        {currentSubscription && (
          <div className="mt-4">
            <p className="text-lg">
              Status da sua assinatura: <span className={statusColor}>{subscriptionStatus}</span>
            </p>
            <p className="text-sm text-gray-600">
              Plano: {currentSubscription.plan_type.toUpperCase()} | 
              Válido até: {new Date(currentSubscription.end_date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative ${
                plan.popular ? 'border-2 border-primary-500 scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </span>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-primary-500 text-xl">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.name, plan.paymentLink)}
                className={`w-full py-4 px-6 rounded-xl text-center font-medium transition-all transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan.name ? 'Redirecionando...' : 'Começar Agora'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Benefits and Guarantees */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-4">🔒</span>
              <h4 className="font-semibold text-gray-900 mb-2">Pagamento Seguro</h4>
              <p className="text-gray-600 text-sm">
                Sua transação é protegida por criptografia de ponta a ponta
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-4">⭐</span>
              <h4 className="font-semibold text-gray-900 mb-2">Garantia de 30 dias</h4>
              <p className="text-gray-600 text-sm">
                Não ficou satisfeito? Devolvemos 100% do seu dinheiro
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-4">💫</span>
              <h4 className="font-semibold text-gray-900 mb-2">Cancele Quando Quiser</h4>
              <p className="text-gray-600 text-sm">
                Sem multas ou taxas extras, cancele a qualquer momento
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Dúvidas? Entre em contato com nosso suporte em{' '}
            <a href="mailto:suporte@historinhas.com" className="text-primary-600 hover:text-primary-700">
              suporte@historinhas.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
