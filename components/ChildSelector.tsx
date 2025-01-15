'use client';

import type { Child } from '@/lib/supabase';

interface ChildSelectorProps {
  children: Child[];
  onSelect: (child: Child | null) => void;
}

export default function ChildSelector({ children, onSelect }: ChildSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Para qual criança será a história? 🤔
        </h2>

        <div className="grid gap-4 mb-6">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelect(child)}
              className="p-4 bg-primary-50 dark:bg-gray-700 rounded-xl hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors text-left"
            >
              <div className="font-medium text-gray-800 dark:text-white">
                {child.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {child.age} anos • {child.gender}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelect(null)}
          className="w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
