import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-primary-600">Historinhas</span>
            </div>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              Entrar
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="mt-16 sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Histórias Mágicas para{' '}
              <span className="text-primary-600">Pequenos Leitores</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Crie histórias personalizadas e encantadoras para as crianças que você ama.
              Cada história é única, como cada criança é especial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-primary-600 text-white rounded-full text-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Começar Agora</span>
                <span>✨</span>
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-full text-lg hover:bg-primary-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Saiba Mais</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalização Total</h3>
              <p className="text-gray-600">
                Crie histórias únicas com temas, humores e valores que combinam com cada criança.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Criação Instantânea</h3>
              <p className="text-gray-600">
                Em poucos minutos, transforme suas ideias em histórias mágicas e cativantes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">💝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Momentos Especiais</h3>
              <p className="text-gray-600">
                Fortaleça laços criando memórias únicas através da leitura compartilhada.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-24 mb-16">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Por que escolher o Historinhas?
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-3">
                  <div className="text-primary-500">📖</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Leitura Interativa</h3>
                    <p className="text-sm text-gray-600">
                      Histórias que incentivam a participação e imaginação
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary-500">🎯</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Valores Educativos</h3>
                    <p className="text-sm text-gray-600">
                      Conteúdo que ensina e inspira de forma divertida
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary-500">💫</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Experiência Mágica</h3>
                    <p className="text-sm text-gray-600">
                      Interface intuitiva e encantadora para todas as idades
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary-500">❤️</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Conexão Afetiva</h3>
                    <p className="text-sm text-gray-600">
                      Momentos especiais de leitura e carinho
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Pronto para criar histórias incríveis?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Junte-se a nós e comece a criar memórias mágicas hoje mesmo.
            </p>
            <Link
              href="/register"
              className="px-8 py-3 bg-primary-600 text-white rounded-full text-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Criar Minha Conta</span>
              <span>✨</span>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Historinhas. Todos os direitos reservados.</p>
            <p className="mt-2">
              Criando histórias mágicas para pequenos leitores 💫
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
