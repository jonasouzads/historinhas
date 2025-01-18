'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Transforme Cada Noite em uma{' '}
              <span className="text-primary-600">Aventura Mágica</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              Histórias personalizadas que fazem os olhos do seu pequeno brilgarem e pedem
              &ldquo;mais uma vez, mamãe!&rdquo;
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl"
              >
                Crie Sua Primeira História Grátis
              </Link>
              <span className="text-sm text-gray-500">
                Já são mais de 10.000 histórias criadas
              </span>
            </motion.div>
          </div>
        </div>

        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100 via-transparent to-transparent opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary-100 via-transparent to-transparent opacity-40"></div>
        </div>
      </div>

      {/* Como Funciona Section */}
      <div ref={stepsRef} className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Crie Histórias Mágicas em 3 Passos Simples
            </h2>
            <p className="text-xl text-gray-600">
              É fácil, rápido e mágico!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Escolha o Tema',
                description: 'Selecione entre diversos temas encantadores ou crie seu próprio',
                icon: '🎨'
              },
              {
                step: '2',
                title: 'Adicione Valores',
                description: 'Escolha as lições e valores que deseja transmitir',
                icon: '✨'
              },
              {
                step: '3',
                title: 'História Pronta!',
                description: 'Sua história personalizada está pronta para encantar',
                icon: '📚'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial="hidden"
                animate={stepsInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <span className="text-4xl mb-6 block">{item.icon}</span>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              O Que os Pais Dizem
            </h2>
            <p className="text-xl text-gray-600">
              Junte-se a milhares de pais criando memórias mágicas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "Revolucionou nossa hora de dormir! Minha filha agora pede toda noite uma história nova.",
                author: "Maria S.",
                role: "mãe da Laura, 5 anos",
                avatar: "👩"
              },
              {
                quote: "Criar histórias personalizadas virou nosso momento especial. Os olhinhos dele brilham!",
                author: "Pedro M.",
                role: "pai do Theo, 4 anos",
                avatar: "👨"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Transforme seus &quot;ebooks&quot; em uma fonte de renda passiva
          </h2>
          <p className="text-gray-600 text-sm">
            Comece agora mesmo a vender seus &quot;ebooks&quot; e alcance mais leitores
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl"
          >
            Criar Minha Primeira História
          </Link>
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="text-sm text-gray-500">Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-sm text-gray-500">Garantia de 30 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💝</span>
              <span className="text-sm text-gray-500">Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Transforme suas histórias em &quot;ebooks&quot; mágicos
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Crie histórias personalizadas e &quot;ebooks&quot; infantis com IA
        </p>
      </div>
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Comece sua jornada hoje e crie &quot;ebooks&quot; incríveis
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Use o poder da IA para criar &quot;ebooks&quot; personalizados
        </p>
      </div>
    </div>
  );
}
