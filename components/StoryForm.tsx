'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Child, Database } from '@/lib/supabase';
import { generateStoryWithAI } from '@/services/openai';

interface StoryFormProps {
  childrenData: Child[];
  onCreateStory?: (story: { title: string; content: string }) => void;
}

export default function StoryForm({ childrenData, onCreateStory }: StoryFormProps) {
  const [selectedChild, setSelectedChild] = useState(childrenData[0]);
  const [storyTheme, setStoryTheme] = useState('');
  const [storyMood, setStoryMood] = useState<string>('feliz');
  const [storyValues, setStoryValues] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !storyTheme.trim()) {
      setError('Por favor, selecione uma criança e um tema para a história');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
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

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: storyError } = await supabase
        .from('stories')
        .insert({
          child_id: selectedChild.id,
          title: response.title,
          content: response.content,
          theme: storyTheme,
          mood: storyMood,
          values: storyValues,
          additional_details: additionalDetails,
          user_id: user.id
        } as Database['public']['Tables']['stories']['Insert'])
        .select()
        .single();

      if (storyError || !data) {
        throw storyError;
      }

      // Limpar o formulário
      setSelectedChild(childrenData[0]);
      setStoryTheme('');
      setStoryMood('feliz');
      setStoryValues([]);
      setAdditionalDetails('');

      // Notificar o componente pai
      if (onCreateStory) {
        onCreateStory(response);
      }

      // Redirecionar para a página de leitura
      router.push(`/ler/${data.id}`);
    } catch (err) {
      console.error('Erro ao gerar história:', err);
      setError('Não foi possível gerar a história. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const moods = [
    { value: 'feliz', label: 'Feliz', emoji: '😊' },
    { value: 'aventureiro', label: 'Aventureiro', emoji: '🌟' },
    { value: 'calmo', label: 'Calmo', emoji: '😌' },
    { value: 'divertido', label: 'Divertido', emoji: '😄' },
  ];

  const values = [
    { value: 'amizade', label: 'Amizade', emoji: '🤝' },
    { value: 'coragem', label: 'Coragem', emoji: '💪' },
    { value: 'gentileza', label: 'Gentileza', emoji: '💝' },
    { value: 'perseverança', label: 'Perseverança', emoji: '🎯' },
    { value: 'criatividade', label: 'Criatividade', emoji: '🎨' },
    { value: 'respeito', label: 'Respeito', emoji: '🙏' },
  ];

  return (
    <form onSubmit={handleCreateStory} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Selecione a criança
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {childrenData.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedChild(child)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedChild?.id === child.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <div className="text-2xl mb-2">
                {child.gender === 'menino' ? '👦' : '👧'}
              </div>
              <div className="text-sm font-medium text-gray-900">{child.name}</div>
              <div className="text-sm text-gray-500">{child.age} anos</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tema da história
        </label>
        <input
          type="text"
          value={storyTheme}
          onChange={(e) => setStoryTheme(e.target.value)}
          placeholder="Ex: Aventura no espaço, Amizade com animais..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Humor da história
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {moods.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStoryMood(value)}
              className={`p-4 rounded-lg border-2 transition-colors text-center ${
                storyMood === value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <div className="text-2xl mb-2">{emoji}</div>
              <div className="text-sm font-medium text-gray-900">{label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Valores a serem abordados (opcional)
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
              className={`p-4 rounded-lg border-2 transition-colors text-center ${
                storyValues.includes(value)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <div className="text-2xl mb-2">{emoji}</div>
              <div className="text-sm font-medium text-gray-900">{label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Detalhes adicionais (opcional)
        </label>
        <textarea
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          placeholder="Ex: Mencionar o bichinho de estimação da criança, incluir elementos específicos..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 h-32"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !selectedChild || !storyTheme}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Gerando História...' : 'Gerar História'}
        </button>
      </div>
    </form>
  );
}
