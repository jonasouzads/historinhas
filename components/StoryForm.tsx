'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Child, hasActiveSubscription } from '@/services/database';
import { Gender } from '@/lib/supabase';
import { generateStoryWithAI } from '@/services/openai';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface StoryFormProps {
  childrenData: Child[];
}

export default function StoryForm({ childrenData }: StoryFormProps) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [storyTheme, setStoryTheme] = useState('');
  const [storyMood, setStoryMood] = useState('feliz');
  const [storyValues, setStoryValues] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

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

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChild || !storyTheme.trim() || !user) {
      setError('Por favor, selecione uma criança e um tema para a história');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Verificar assinatura ativa
      const hasSubscription = await hasActiveSubscription(user.id);
      if (!hasSubscription) {
        router.push('/profile/subscriptions');
        return;
      }

      const storyParams = {
        childName: selectedChild.name,
        childAge: selectedChild.age,
        childGender: selectedChild.gender as Gender,
        theme: storyTheme,
        mood: storyMood,
        values: storyValues,
        additionalDetails,
      };

      const response = await generateStoryWithAI(storyParams);

      // Salvar a história no banco de dados
      const { data, error: dbError } = await supabase
        .from('stories')
        .insert([
          {
            user_id: user.id,
            child_id: selectedChild.id,
            title: response.title,
            content: response.content,
            theme: storyTheme,
            mood: storyMood,
            values: storyValues,
            additional_details: additionalDetails,
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // Redirecionar para a página de leitura
      if (data) {
        router.push(`/ler/${data.id}`);
        router.refresh();
      }
    } catch (err) {
      console.error('Erro ao gerar história:', err);
      setError('Não foi possível gerar a história. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateStory} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escolha uma Criança
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {childrenData.map((child) => (
            <motion.button
              key={child.id}
              type="button"
              onClick={() => setSelectedChild(child)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedChild?.id === child.id
                  ? 'border-primary-500 bg-primary-50 text-primary-700 scale-105'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl mb-2 block">
                {child.gender === 'menino' ? '👦' : '👧'}
              </span>
              <span className="font-medium block">{child.name}</span>
              <span className="text-sm text-gray-500">{child.age} anos</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
          Tema da História
        </label>
        <motion.input
          type="text"
          id="theme"
          value={storyTheme}
          onChange={(e) => setStoryTheme(e.target.value)}
          placeholder="Ex: Uma aventura no espaço, Um dia na floresta..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          whileFocus={{ scale: 1.01 }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tom da História
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {moods.map(({ value, label, emoji }) => (
            <motion.button
              key={value}
              type="button"
              onClick={() => setStoryMood(value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                storyMood === value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl mb-1 block">{emoji}</span>
              <span className="text-sm">{label.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valores a Ensinar (opcional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {values.map(({ value, label, emoji }) => (
            <motion.button
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl mb-1 block">{emoji}</span>
              <span className="text-sm">{label.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
          Detalhes Adicionais (opcional)
        </label>
        <motion.textarea
          id="details"
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          placeholder="Ex: A criança adora dinossauros, tem medo do escuro..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          whileFocus={{ scale: 1.01 }}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={isLoading || !selectedChild || !storyTheme.trim()}
        className={`w-full py-4 px-6 rounded-xl text-white font-medium transition-all ${
          isLoading
            ? 'bg-primary-400 cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full"
            />
            <span>Criando História Mágica...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>✨</span>
            <span>Criar História Mágica</span>
            <span>✨</span>
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mt-4 p-6 bg-primary-50 rounded-lg"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-4xl"
              >
                ✨
              </motion.div>
              <p className="text-primary-700 font-medium">
                Criando uma história mágica especialmente para {selectedChild?.name}...
              </p>
              <p className="text-sm text-primary-600">
                Nossa fada escritora está trabalhando com muito carinho!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
