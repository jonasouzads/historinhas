'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database, Story, Child } from '@/lib/supabase';

interface PageProps {
  params: {
    id: string;
  };
}

export default function StoryPage({ params }: PageProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const loadStory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Usuário não autenticado');
          return;
        }

        // Buscar a história
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single();

        if (storyError) throw storyError;

        if (!storyData) {
          setError('História não encontrada');
          return;
        }

        // Buscar a criança
        const { data: childData, error: childError } = await supabase
          .from('children')
          .select('*')
          .eq('id', storyData.child_id)
          .single();

        if (childError) throw childError;

        if (!childData) {
          setError('Criança não encontrada');
          return;
        }

        setStory({ ...storyData, children: [childData] });
        setChild(childData);
      } catch (err) {
        console.error('Erro ao carregar história:', err);
        setError('Erro ao carregar história');
      } finally {
        setIsLoading(false);
      }
    };

    loadStory();
  }, [params.id, supabase]);

  const handleDownload = () => {
    if (!story || !child) return;

    const content = `${story.title}

Uma história para ${child.name} (${child.age} anos)

${story.content}

---
História gerada por Historinhas
Tema: ${story.theme}
${story.mood ? `Humor: ${story.mood}` : ''}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-soft from-primary-50 via-white to-secondary-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story || !child) {
    return (
      <div className="min-h-screen bg-gradient-soft from-primary-50 via-white to-secondary-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ops! Algo deu errado.</h1>
            <p className="text-gray-600 mb-8">{error || 'História não encontrada'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pages = story.content.split('\n\n');
  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-soft from-primary-50 via-white to-secondary-50 ${
      isFocusMode ? 'h-screen overflow-hidden bg-white' : ''
    }`}>
      <div className={`max-w-4xl mx-auto px-4 ${
        isFocusMode ? 'h-full py-4 flex flex-col' : 'py-8'
      }`}>
        {/* Navegação Superior */}
        <div className={`flex justify-between items-center mb-6 transition-opacity duration-300 ${
          isFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <span>←</span>
            <span>Voltar ao Dashboard</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <span>Baixar História</span>
            <span>📥</span>
          </button>
        </div>

        {/* Cabeçalho */}
        <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6 transition-opacity duration-300 ${
          isFocusMode ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="text-4xl">
              {child.gender === 'menino' ? '👦' : '👧'}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{story.title}</h1>
              <p className="text-gray-600">
                Uma história especial para {child.name} • {child.age} anos
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span>📚</span>
              <span>{story.theme}</span>
            </span>
            {story.mood && (
              <span className="inline-flex items-center gap-1">
                <span>•</span>
                <span>
                  {story.mood === 'feliz' && '😊'}
                  {story.mood === 'aventureiro' && '🌟'}
                  {story.mood === 'calmo' && '😌'}
                  {story.mood === 'divertido' && '😄'}
                  {story.mood}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Conteúdo da História */}
        <div className={`relative bg-white rounded-2xl shadow-sm mb-6 transition-all duration-300 ${
          isFocusMode ? 'flex-1 min-h-0 flex flex-col' : ''
        }`}>
          {/* Botão de Modo Foco */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title={isFocusMode ? "Sair do modo foco" : "Entrar no modo foco"}
          >
            {isFocusMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>

          <div className={`prose prose-lg max-w-none ${
            isFocusMode ? 'flex-1 min-h-0 overflow-y-auto px-8 py-12' : 'p-6 md:p-8'
          }`}>
            <p className={`text-lg md:text-xl leading-relaxed ${isFocusMode ? 'text-2xl md:text-3xl' : ''}`}>
              {pages[currentPage]}
            </p>
          </div>

          {/* Navegação */}
          <div className={`flex items-center justify-center gap-4 ${
            isFocusMode ? 'p-4 bg-white bg-opacity-90' : ''
          } transition-opacity duration-300 ${
            isFocusMode ? 'opacity-50 hover:opacity-100' : 'opacity-100'
          }`}>
            <button
              onClick={previousPage}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              ← Anterior
            </button>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              Próxima →
            </button>
          </div>
        </div>

        {/* Dicas de Leitura */}
        <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm transition-opacity duration-300 ${
          isFocusMode ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'
        }`}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💡</span>
            <span>Dicas para uma Leitura Mágica</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🎭</span>
                <span>Para uma Experiência Encantadora</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-primary-500">•</span>
                  <span>Use diferentes vozes para cada personagem</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-primary-500">•</span>
                  <span>Faça pausas para conversar sobre a história</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-primary-500">•</span>
                  <span>Pergunte o que acontecerá em seguida</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>✨</span>
                <span>Benefícios da Leitura</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-secondary-500">•</span>
                  <span>Estimula a imaginação e criatividade</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-secondary-500">•</span>
                  <span>Enriquece o vocabulário</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-secondary-500">•</span>
                  <span>Fortalece o vínculo afetivo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
