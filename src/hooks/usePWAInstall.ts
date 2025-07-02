
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    console.log('PWA Hook: Inicializando...');
    
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Hook: Evento beforeinstallprompt detectado');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      
      // Check if user has already dismissed the prompt
      const hasRejected = localStorage.getItem('pwa-install-rejected');
      console.log('PWA Hook: HasRejected =', hasRejected);
      
      if (!hasRejected) {
        // Show prompt after 2 seconds for balloon
        setTimeout(() => {
          console.log('PWA Hook: Mostrando prompt após timeout');
          setShowPrompt(true);
        }, 2000);
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA Hook: App instalado');
      setDeferredPrompt(null);
      setCanInstall(false);
      setShowPrompt(false);
      localStorage.removeItem('pwa-install-rejected');
    };

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA Hook: App já está instalado');
      return;
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Fallback para teste - mostrar balão após 3 segundos se não houver evento
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !localStorage.getItem('pwa-install-rejected')) {
        console.log('PWA Hook: Usando fallback - mostrando balão para teste');
        setCanInstall(true);
        setShowPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const installApp = async () => {
    console.log('PWA Hook: Tentando instalar app');
    if (!deferredPrompt) {
      console.log('PWA Hook: Sem deferredPrompt - redirecionando para instruções');
      // Fallback - show instructions or redirect to browser settings
      alert('Para instalar o app:\n1. No Chrome: Menu > Instalar app\n2. No Firefox: Menu > Instalar\n3. No Safari: Compartilhar > Adicionar à tela inicial');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installation accepted');
      }
      
      setDeferredPrompt(null);
      setCanInstall(false);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const dismissPrompt = (permanent = false) => {
    console.log('PWA Hook: Dismissing prompt, permanent =', permanent);
    setShowPrompt(false);
    if (permanent) {
      localStorage.setItem('pwa-install-rejected', 'true');
    }
  };

  // Debug logs
  console.log('PWA Hook Estado:', { canInstall, showPrompt, hasDeferredPrompt: !!deferredPrompt });

  return {
    canInstall,
    showPrompt,
    installApp,
    dismissPrompt
  };
};
