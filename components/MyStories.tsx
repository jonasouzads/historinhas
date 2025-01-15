'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database, Story } from '@/lib/supabase';

export default function MyStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const loadStories = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Usuário não autenticado');
          return;
        }

        const { data: storiesData, error: storiesError } = await supabase
          .from('stories')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (storiesError) throw storiesError;

        if (!storiesData || storiesData.length === 0) {
          setStories([]);
          return;
        }

        // Buscar as crianças para cada história
        const storiesWithChildren = await Promise.all(
          storiesData.map(async (story) => {
            const { data: childData, error: childError } = await supabase
              .from('children')
              .select('*')
              .eq('id', story.child_id)
              .single();

            if (childError) {
              console.error('Erro ao buscar criança:', childError);
              return null;
            }

            return {
              ...story,
              children: [childData]
            } as Story;
          })
        );

        // Filtrar histórias onde não foi possível buscar a criança
        const validStories = storiesWithChildren.filter((story): story is Story => story !== null);
        setStories(validStories);
      } catch (err) {
        console.error('Erro ao carregar histórias:', err);
        setError('Erro ao carregar histórias');
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ops! Algo deu errado.</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma história encontrada</h2>
        <p className="text-gray-600">
          Você ainda não criou nenhuma história. Que tal criar uma agora?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Minhas Histórias</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {stories.map((story) => {
          const child = story.children[0];
          return (
            <button
              key={story.id}
              onClick={() => router.push(`/ler/${story.id}`)}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">
                  {child.gender === 'menino' ? '👦' : '👧'}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{story.title}</h3>
                  <p className="text-sm text-gray-500">
                    Para {child.name} • {child.age} anos
                  </p>
                </div>
              </div>
              <p className="text-gray-600 line-clamp-3">{story.content}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span>📚</span>
                <span>{story.theme}</span>
                {story.mood && (
                  <>
                    <span>•</span>
                    <span>
                      {story.mood === 'feliz' && '😊'}
                      {story.mood === 'aventureiro' && '🌟'}
                      {story.mood === 'calmo' && '😌'}
                      {story.mood === 'divertido' && '😄'}
                      {story.mood}
                    </span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
