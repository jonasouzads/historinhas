'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Historinhas</h3>
            <p className="text-gray-600">
              Criando histórias mágicas e personalizadas para encantar a infância do seu filho.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-600">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacidade" className="text-gray-600 hover:text-primary-600">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-600 hover:text-primary-600">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contato</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contato@historinhas.com" className="text-gray-600 hover:text-primary-600">
                  contato@historinhas.com
                </a>
              </li>
              <li className="text-gray-600">
                Atendimento: Seg-Sex, 9h-18h
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Historinhas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
