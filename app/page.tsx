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
                Crie Sua Primeira Histórinha
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

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Você já passou por isso?
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Falta de Tempo",
                description: "Dificuldade em encontrar tempo para criar histórias novas e envolventes para seus filhos todas as noites",
                icon: "⏰"
              },
              {
                title: "Repetição",
                description: "Seus filhos já conhecem todas as histórias de cor e você está sem ideias novas para contar",
                icon: "🔄"
              },
              {
                title: "Conexão",
                description: "Desejo de criar momentos mais especiais e memoráveis com seus filhos através da leitura",
                icon: "❤️"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Nossa Solução Mágica
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Histórias Personalizadas</h3>
                  <p className="text-gray-600">Crie histórias únicas com os nomes e características dos seus filhos em segundos</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Biblioteca Ilimitada</h3>
                  <p className="text-gray-600">Acesso a centenas de templates e temas para criar histórias sempre diferentes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ilustrações Encantadoras</h3>
                  <p className="text-gray-600">Cada história vem com ilustrações mágicas que encantam as crianças</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/story-preview.jpg"
                  alt="Preview de uma história personalizada"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Por que Escolher Nossa Plataforma?
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Rápido e Fácil",
                description: "Crie histórias em menos de 5 minutos com nossa interface intuitiva",
                icon: "⚡"
              },
              {
                title: "100% Personalizado",
                description: "Cada história é única e adaptada aos gostos do seu filho",
                icon: "🎯"
              },
              {
                title: "Educativo",
                description: "Histórias que desenvolvem a imaginação e valores importantes",
                icon: "📖"
              },
              {
                title: "Memórias Eternas",
                description: "Crie momentos especiais que serão lembrados para sempre",
                icon: "💫"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Action CTA */}
      <section className="py-12 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Começar sua Jornada Mágica?
            </h2>
            <p className="text-gray-600 mb-8">
              Junte-se a milhares de pais que já estão criando memórias inesquecíveis com seus filhos
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl"
            >
              Criar Minha Primeira História
            </Link>
          </motion.div>
        </div>
      </section>

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

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Escolha o Plano Ideal para Sua Família
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Comece a criar histórias mágicas hoje mesmo e encante seus pequenos com narrativas únicas e personalizadas
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Plano Mágico",
                price: "R$ 14,90",
                paymentLink: "https://pay.kiwify.com.br/mxHAUaX",
                features: [
                  "Histórias ilimitadas",
                  "Todas as personalizações",
                  "Biblioteca completa",
                  "Suporte por email",
                  "Temas exclusivos",
                  "Exportação em PDF"
                ],
                color: "primary"
              },
              {
                name: "Plano Família",
                price: "R$ 19,90",
                paymentLink: "https://pay.kiwify.com.br/0aunU62",
                features: [
                  "Tudo do Plano Mágico",
                  "Até 3 perfis infantis",
                  "Histórias compartilháveis",
                  "Suporte prioritário",
                  "Temas premium",
                ],
                color: "secondary",
                popular: true
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative ${
                  plan.popular ? 'border-2 border-primary-500 scale-105' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="text-primary-500 text-xl">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.paymentLink}
                  target="_blank"
                  className={`block w-full py-4 px-6 rounded-xl text-center font-medium transition-all transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Começar Agora
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
      
      {/* Utmify Scripts */}
      <script
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        data-utmify-prevent-subids
        async
        defer
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.pixelId = "678b23f9abcaf962211a5587";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `
        }}
      />
    </div>
  );
}
