'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Database, Child } from '@/lib/supabase';
import MyStories from '@/components/MyStories';
import StoryForm from '@/components/StoryForm';
import ChildRegistration from '@/components/ChildRegistration';

export default function Dashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState('Bem-vindo! 👋');
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Usuário não autenticado');
          router.push('/auth/login');
          return;
        }

        // Carregar perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setProfile(profile);
        }

        // Carregar crianças
        const { data: childrenData, error: childrenError } = await supabase
          .from('children')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (childrenError) {
          throw childrenError;
        }

        setChildren(childrenData || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do usuário');
        setIsLoading(false);
      }
    };

    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile?.full_name) {
          const firstName = profile.full_name.split(' ')[0];
          setWelcomeMessage(`Bem-vindo, ${firstName}! 👋`);
        } else {
          setWelcomeMessage('Bem-vindo! 👋');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setWelcomeMessage('Bem-vindo! 👋');
      }
    };

    loadUserData();
    loadUserProfile();
  }, [supabase, router]);

  const menuItems = [
    { name: 'Perfil', href: '/profile', icon: '👤' },
    { name: 'Assinaturas', href: '/profile/subscriptions', icon: '⭐' },
    { name: 'Crianças', href: '/profile/children', icon: '👶' },
    { name: 'Histórias', href: '/profile/stories', icon: '📚' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-soft from-primary-50 via-white to-secondary-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <span className="text-2xl">📚</span>
              <span className="ml-2 text-xl font-bold text-primary-600">Historinhas</span>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-soft from-primary-50 via-white to-secondary-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-2xl">📚</span>
                <span className="ml-2 text-xl font-bold text-primary-600">Historinhas</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Ops! Algo deu errado.</h1>
              <p className="text-gray-600 mb-8">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft from-primary-50 via-white to-secondary-50">
      {/* Header Global */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl">📚</span>
              <span className="ml-2 text-xl font-bold text-primary-600">Historinhas</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-bold">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : '?'}
                </div>
                <span className="hidden md:inline-block">{profile?.full_name || 'Usuário'}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                  <hr className="my-1" />
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push('/');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <span className="mr-3">🚪</span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Seção de Boas-vindas */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {welcomeMessage}
            </h1>
            <p className="text-gray-600">
              Crie histórias mágicas e personalizadas para suas crianças.
            </p>
          </div>

          {/* Seção de Histórias */}
          <div className="space-y-8">
            {children.length === 0 ? (
              <ChildRegistration
                onClose={() => {}}
                onChildAdded={(newChild) => {
                  setChildren([...children, newChild]);
                }}
                isFirstChild={true}
              />
            ) : (
              <>
                <StoryForm childrenData={children} />
                <MyStories />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
