'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Child, hasActiveSubscription } from '@/services/database';
import { Gender } from '@/lib/supabase';
import { generateStoryWithAI } from '@/services/openai';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface StoryCreatorProps {
  children: Child[];
  onCreateStory: (story: { title: string; content: string }) => void;
}

export default function StoryCreator({ children, onCreateStory }: StoryCreatorProps) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [storyTheme, setStoryTheme] = useState('');
  const [storyMood, setStoryMood] = useState('');
  const [storyValues, setStoryValues] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !storyTheme || !user) return;

    try {
      setError(null);
      setIsGenerating(true);

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
        additionalDetails
      };

      const response = await generateStoryWithAI(storyParams);
      onCreateStory(response);
    } catch (error) {
      console.error('Erro ao criar história:', error);
      setError('Não foi possível gerar a história. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleCreateStory} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escolha uma criança
          </label>
          <select
            value={selectedChild?.id || ''}
            onChange={(e) => setSelectedChild(children.find(c => c.id === e.target.value) || null)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Selecione uma criança</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} ({child.age} anos)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema da História
          </label>
          <input
            type="text"
            value={storyTheme}
            onChange={(e) => setStoryTheme(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ex: Aventura na floresta, Viagem espacial..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Humor/Tom da História (opcional)
          </label>
          <input
            type="text"
            value={storyMood}
            onChange={(e) => setStoryMood(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ex: Divertido, Emocionante, Calmo..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valores a serem abordados (opcional)
          </label>
          <input
            type="text"
            value={storyValues.join(', ')}
            onChange={(e) => setStoryValues(e.target.value.split(',').map(v => v.trim()))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ex: Amizade, Coragem, Honestidade..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detalhes adicionais (opcional)
          </label>
          <textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Algum detalhe especial que você gostaria de incluir na história?"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-100 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isGenerating || !selectedChild || !storyTheme}
          className={`w-full py-4 px-6 rounded-xl text-white font-medium transition-all transform hover:scale-105 ${
            isGenerating
              ? 'bg-primary-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full"
              />
              <span>Gerando História Mágica...</span>
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
          {isGenerating && (
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
    </div>
  );
}
