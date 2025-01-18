'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const menuItems = [
  {
    path: '/profile',
    label: 'Perfil',
    icon: '👤',
  },
  {
    path: '/profile/children',
    label: 'Crianças',
    icon: '👶',
  },
  {
    path: '/profile/stories',
    label: 'Histórias',
    icon: '📚',
  },
  {
    path: '/profile/subscriptions',
    label: 'Assinatura',
    icon: '⭐',
  },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho com Navegação */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
            >
              <span>←</span>
              <span className="ml-2">Voltar ao Dashboard</span>
            </Link>
          </div>

          {/* Menu de Navegação */}
          <nav className="bg-white rounded-2xl shadow-sm p-2 flex space-x-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-primary-50 rounded-xl"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <span className="relative">
                    {item.icon}
                  </span>
                  <span className="relative hidden sm:inline">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo Principal */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
