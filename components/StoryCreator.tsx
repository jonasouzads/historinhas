'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/supabase';
import { generateStoryWithAI } from '@/services/openai';

type Child = Database['public']['Tables']['children']['Row'];

interface StoryCreatorProps {
  children: Child[];
  onCreateStory: (story: { title: string; content: string }) => void;
}

export default function StoryCreator({ children, onCreateStory }: StoryCreatorProps) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [storyTheme, setStoryTheme] = useState('');
  const [storyMood, setStoryMood] = useState<string>('feliz');
  const [storyValues, setStoryValues] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !storyTheme.trim()) {
      setError('Por favor, selecione uma criança e um tema para a história');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Gerando história com os parâmetros:', {
        childId: selectedChild.id,
        childName: selectedChild.name,
        childAge: selectedChild.age,
        childGender: selectedChild.gender,
        storyTheme,
        storyMood,
        storyValues,
        additionalDetails,
      });

      const response = await generateStoryWithAI({
        childId: selectedChild.id,
        childName: selectedChild.name,
        childAge: selectedChild.age,
        childGender: selectedChild.gender,
        storyTheme,
        storyMood,
        storyValues,
        additionalDetails,
      });

      if (!response || !response.title || !response.content) {
        throw new Error('Erro ao gerar história');
      }

      console.log('História gerada:', response);

      // Notificar o componente pai e redirecionar para a página de leitura
      onCreateStory({ title: response.title, content: response.content });
      router.push(`/ler/`);
    } catch (err) {
      console.error('Erro ao gerar história:', err);
      setError('Não foi possível gerar a história. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const moods = [
    { value: 'feliz', label: 'Feliz 😊', emoji: '😊' },
    { value: 'aventureiro', label: 'Aventureiro 🌟', emoji: '🌟' },
    { value: 'calmo', label: 'Calmo 😌', emoji: '😌' },
    { value: 'divertido', label: 'Divertido 😄', emoji: '😄' },
  ];

  const values = [
    { value: 'amizade', label: 'Amizade 🤝', emoji: '🤝' },
    { value: 'coragem', label: 'Coragem 💪', emoji: '💪' },
    { value: 'gentileza', label: 'Gentileza 💝', emoji: '💝' },
    { value: 'perseverança', label: 'Perseverança 🎯', emoji: '🎯' },
    { value: 'criatividade', label: 'Criatividade 🎨', emoji: '🎨' },
    { value: 'respeito', label: 'Respeito 🙏', emoji: '🙏' },
  ];

  return (
    <form onSubmit={handleCreateStory} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escolha uma Criança
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedChild(child)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedChild?.id === child.id
                  ? 'border-primary-500 bg-primary-50 text-primary-700 scale-105'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <span className="text-2xl mb-2 block">
                {child.gender === 'menino' ? '👦' : '👧'}
              </span>
              <span className="font-medium block">{child.name}</span>
              <span className="text-sm text-gray-500">{child.age} anos</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
          Tema da História
        </label>
        <input
          type="text"
          id="theme"
          value={storyTheme}
          onChange={(e) => setStoryTheme(e.target.value)}
          placeholder="Ex: Uma aventura no espaço, Um dia na floresta..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tom da História
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {moods.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStoryMood(value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                storyMood === value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <span className="text-2xl mb-1 block">{emoji}</span>
              <span className="text-sm">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valores a Ensinar (opcional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {values.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setStoryValues((prev) =>
                  prev.includes(value)
                    ? prev.filter((v) => v !== value)
                    : [...prev, value]
                );
              }}
              className={`p-3 rounded-lg border text-center transition-all ${
                storyValues.includes(value)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <span className="text-2xl mb-1 block">{emoji}</span>
              <span className="text-sm">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
          Detalhes Adicionais (opcional)
        </label>
        <textarea
          id="details"
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          placeholder="Ex: A criança adora dinossauros, tem medo do escuro..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !selectedChild || !storyTheme.trim()}
        className="w-full py-3 px-4 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin mr-2">⏳</span>
            Gerando História...
          </>
        ) : (
          'Gerar História Mágica ✨'
        )}
      </button>
    </form>
  );
}
