'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export default function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration);
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });
    }

    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setShowPrompt(true);
    });
  }, []);

  const handleInstallClick = async () => {
    setShowPrompt(false);
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
      }
      deferredPrompt = null;
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 sm:max-w-sm mx-auto">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-2xl">📱</div>
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900 mb-1">Instale o App</h3>
          <p className="text-sm text-gray-600 mb-3">
            Instale o Historinhas para ter acesso rápido às suas histórias, mesmo offline!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-grow px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
