'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import type { Database } from '@/lib/supabase';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionFeature = Database['public']['Tables']['subscription_features']['Row'];

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [features, setFeatures] = useState<SubscriptionFeature[]>([]);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const loadSubscriptionData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar assinatura atual
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (sub) {
        setSubscription(sub);
      }

      // Carregar features de todas as assinaturas
      const { data: feats } = await supabase
        .from('subscription_features')
        .select('*');

      if (feats) {
        setFeatures(feats);
      }
    };

    loadSubscriptionData();
  }, [supabase]);

  const plans = [
    {
      type: 'free',
      name: 'Gratuito',
      price: 'R$ 0',
      color: 'bg-gray-100',
      description: 'Perfeito para começar',
    },
    {
      type: 'basic',
      name: 'Básico',
      price: 'R$ 19,90/mês',
      color: 'bg-primary-100',
      description: 'Para famílias ativas',
    },
    {
      type: 'premium',
      name: 'Premium',
      price: 'R$ 39,90/mês',
      color: 'bg-purple-100',
      description: 'Experiência completa',
    },
  ];

  const getFeatureValue = (planType: string, featureName: string) => {
    const feature = features.find(
      f => f.plan_type === planType && f.feature_name === featureName
    );
    return feature?.feature_value || '-';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Assinaturas</h1>
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Voltar ao Perfil
          </Link>
        </div>

        {subscription && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Assinatura Atual
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Plano: <span className="font-medium text-gray-900">{subscription.plan_type}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Status: <span className="font-medium text-gray-900">{subscription.status}</span>
                </p>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Gerenciar Assinatura
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.type}
              className={`${plan.color} rounded-lg p-6 relative overflow-hidden transition-transform hover:scale-105`}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-2xl font-bold text-primary-600 mt-2">{plan.price}</p>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-sm">
                    ✨ Histórias por mês: {getFeatureValue(plan.type, 'stories_per_month')}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">
                    🤖 Modelos de IA: {getFeatureValue(plan.type, 'ai_models')}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">
                    💾 Download de histórias: {getFeatureValue(plan.type, 'download_stories') === 'true' ? 'Sim' : 'Não'}
                  </span>
                </div>
              </div>

              <button
                className={`mt-6 w-full py-2 px-4 rounded-md font-medium ${
                  subscription?.plan_type === plan.type
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
                disabled={subscription?.plan_type === plan.type}
              >
                {subscription?.plan_type === plan.type ? 'Plano Atual' : 'Escolher Plano'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
