'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Story = {
  title: string;
  content: string;
  theme?: string;
  mood?: string;
  values?: string[];
};

interface StoryDisplayProps {
  story: Story | null;
  onBack: () => void;
  onClose?: () => void;
}

export default function StoryDisplay({ story, onBack, onClose }: StoryDisplayProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  if (!story) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-rainbow p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ops! Algo deu errado.
          </h2>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar a história. Por favor, tente novamente.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            Voltar e Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const paragraphs = story.content.split('\n').filter(p => p.trim());
  const totalPages = Math.ceil(paragraphs.length / 2);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(curr => curr + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(curr => curr - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-primary-600 hover:text-primary-700 flex items-center gap-2 transition-colors"
        >
          ← Voltar ao início
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors flex items-center gap-1"
          >
            <span>🖨️</span> Imprimir
          </button>
          <button
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob([
                `${story.title}\n\n${story.content}\n\n` +
                (story.theme ? `\nTema: ${story.theme}` : '') +
                (story.mood ? `\nTom: ${story.mood}` : '') +
                (story.values?.length ? `\nValores: ${story.values.join(', ')}` : '')
              ], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = `${story.title}.txt`;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors flex items-center gap-1"
          >
            <span>📥</span> Baixar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-rainbow p-8 md:p-12">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
            ✨
          </div>
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
            🌟
          </div>

          {/* Story Info */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {story.theme && (
              <div className="px-4 py-2 bg-primary-50 rounded-full text-sm text-primary-600">
                📚 {story.theme}
              </div>
            )}
            {story.mood && (
              <div className="px-4 py-2 bg-primary-50 rounded-full text-sm text-primary-600">
                {story.mood === 'Feliz e Divertida' ? '😊' : 
                 story.mood === 'Aventureira' ? '🗺️' :
                 story.mood === 'Calma e Relaxante' ? '🌙' :
                 story.mood === 'Inspiradora' ? '✨' :
                 story.mood === 'Engraçada' ? '😄' : '💫'} {story.mood}
              </div>
            )}
            {story.values?.map((value, index) => (
              <div 
                key={index}
                className="px-4 py-2 bg-primary-50 rounded-full text-sm text-primary-600"
              >
                {value === 'Amizade' ? '🤝' :
                 value === 'Coragem' ? '🦁' :
                 value === 'Gentileza' ? '💝' :
                 value === 'Perseverança' ? '💪' :
                 value === 'Criatividade' ? '🎨' :
                 value === 'Respeito' ? '🙏' :
                 value === 'Honestidade' ? '💫' :
                 value === 'Gratidão' ? '🙌' : '✨'} {value}
              </div>
            ))}
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            {story.title}
          </h2>

          {/* Story Content */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {paragraphs
                  .slice(currentPage * 2, (currentPage + 1) * 2)
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-700 leading-relaxed text-lg md:text-xl"
                      style={{ textIndent: '2em' }}
                    >
                      {paragraph}
                    </p>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-2 text-2xl text-primary-600 disabled:text-gray-300 transition-colors"
            >
              ←
            </button>
            <div className="text-sm text-gray-500">
              Página {currentPage + 1} de {totalPages}
            </div>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 text-2xl text-primary-600 disabled:text-gray-300 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Reading Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-2xl mb-2">🎭</div>
          <h3 className="font-semibold text-gray-900 mb-2">Faça Vozes Diferentes</h3>
          <p className="text-gray-600 text-sm">
            Use diferentes vozes para cada personagem, tornando a história mais divertida
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-2xl mb-2">❓</div>
          <h3 className="font-semibold text-gray-900 mb-2">Faça Perguntas</h3>
          <p className="text-gray-600 text-sm">
            Pergunte o que seu filho acha que vai acontecer em seguida
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-2xl mb-2">🌟</div>
          <h3 className="font-semibold text-gray-900 mb-2">Elogie a Participação</h3>
          <p className="text-gray-600 text-sm">
            Incentive seu filho a participar da história com comentários e ideias
          </p>
        </div>
      </div>
    </div>
  );
}
