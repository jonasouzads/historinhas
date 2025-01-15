'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import type { Database } from '@/lib/supabase';

type Child = Database['public']['Tables']['children']['Row'];
type BaseStory = Database['public']['Tables']['stories']['Row'];

interface Story extends BaseStory {
  child: Child | null;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  const loadStories = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Primeiro, buscar todas as histórias
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (storiesError) throw storiesError;

      // Para cada história, buscar os dados da criança
      const storiesWithChildren = await Promise.all(
        (storiesData || []).map(async (story) => {
          const { data: childData } = await supabase
            .from('children')
            .select('*')
            .eq('id', story.child_id)
            .single();

          return {
            ...story,
            child: childData || null,
          };
        })
      );

      setStories(storiesWithChildren);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Histórias</h1>
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Voltar ao Perfil
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Nenhuma história encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              Comece a criar histórias mágicas para suas crianças!
            </p>
            <Link
              href="/criar-historia"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Criar Nova História
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {story.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Criada para {story.child?.name || 'Criança'} • {formatDate(story.created_at)}
                    </p>
                  </div>
                  <Link
                    href={`/ler/${story.id}`}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100"
                  >
                    Ler História →
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  {story.theme && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {story.theme}
                    </span>
                  )}
                  {story.mood && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {story.mood}
                    </span>
                  )}
                  {story.values && story.values.map((value) => (
                    <span
                      key={value}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
