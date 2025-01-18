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
    <div className={`min-h-screen w-full transition-colors duration-500 ${
      isFocusMode ? 'fixed inset-0 bg-[#FFFAF5] overflow-y-auto' : 'bg-gradient-to-br from-primary-50 via-white to-secondary-50'
    }`}>
      <div className={`w-full mx-auto px-4 sm:px-6 ${
        isFocusMode ? 'h-full py-4 flex flex-col max-w-3xl' : 'py-8 max-w-5xl'
      }`}>
        {/* Barra de Navegação Superior */}
        <div className={`flex flex-wrap justify-between items-center gap-4 mb-8 transition-all duration-300 ${
          isFocusMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <button
            onClick={() => router.push('/dashboard')}
            className="group px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-300 flex items-center gap-2 transition-all shadow-sm hover:shadow text-sm sm:text-base"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Voltar ao Dashboard</span>
          </button>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-300 flex items-center gap-2 transition-all shadow-sm hover:shadow text-sm sm:text-base"
            >
              <span>{isFocusMode ? '👁️' : '📖'}</span>
              <span className="hidden sm:inline">{isFocusMode ? 'Modo Normal' : 'Modo Leitura'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-300 flex items-center gap-2 transition-all shadow-sm hover:shadow text-sm sm:text-base"
            >
              <span>📥</span>
              <span className="hidden sm:inline">Baixar História</span>
            </button>
          </div>
        </div>

        {/* Cabeçalho da História */}
        <div className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8 transition-all duration-300 ${
          isFocusMode ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="text-4xl sm:text-5xl transform hover:scale-110 transition-transform cursor-default">
              {child.gender === 'menino' ? '👦' : '👧'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{story.title}</h1>
              <p className="text-base sm:text-lg text-gray-600">
                Uma história especial para {child.name} • {child.age} anos
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full text-sm">
              <span>📚</span>
              <span>{story.theme}</span>
            </span>
            {story.mood && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-50 rounded-full text-sm">
                <span>😊</span>
                <span>{story.mood}</span>
              </span>
            )}
          </div>
        </div>

        {/* Conteúdo da História */}
        <div className={`bg-white rounded-3xl shadow-sm transition-all duration-500 relative ${
          isFocusMode ? 'flex-grow flex flex-col mt-8' : ''
        }`}>
          {isFocusMode && (
            <button
              onClick={() => setIsFocusMode(false)}
              className="absolute -top-12 right-0 p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10 hover:bg-gray-50"
              title="Sair do modo leitura"
            >
              <span className="text-lg text-gray-600">✕</span>
            </button>
          )}
          
          <div className={`w-full mx-auto ${isFocusMode ? 'p-4 sm:p-8 flex-grow overflow-y-auto' : 'p-6 sm:p-8'}`}>
            <div className="prose prose-lg max-w-none">
              {pages[currentPage].split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6 leading-relaxed text-gray-800">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Navegação entre Páginas */}
          <div className={`flex items-center justify-between gap-4 p-4 sm:p-6 ${
            isFocusMode ? 'border-t border-gray-100' : ''
          }`}>
            <button
              onClick={previousPage}
              disabled={currentPage === 0}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 transition-all text-sm sm:text-base ${
                currentPage === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              <span>←</span>
              <span className="hidden sm:inline">Anterior</span>
            </button>
            <span className="text-sm text-gray-500">
              {currentPage + 1}/{totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 transition-all text-sm sm:text-base ${
                currentPage === totalPages - 1
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              <span className="hidden sm:inline">Próxima</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Dicas de Leitura */}
        {!isFocusMode && (
          <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>💡</span>
              <span>Dicas para uma Leitura Mágica</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="bg-gradient-to-br from-primary-50 to-white p-4 sm:p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎭</span>
                  <span>Como Ler para Crianças</span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>Use diferentes vozes para cada personagem</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>Faça pausas dramáticas nos momentos importantes</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>Pergunte o que a criança acha que vai acontecer</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-secondary-50 to-white p-4 sm:p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>✨</span>
                  <span>Benefícios da Leitura</span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                    <span className="text-secondary-500 mt-1">•</span>
                    <span>Estimula a imaginação e criatividade</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                    <span className="text-secondary-500 mt-1">•</span>
                    <span>Desenvolve o vocabulário e a linguagem</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                    <span className="text-secondary-500 mt-1">•</span>
                    <span>Fortalece o vínculo afetivo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
