'use client';

import React, { useEffect, useState } from 'react';

export default function PWAInstallerAlert() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between z-50">
      <div>
        <p className="font-semibold text-sm">Saka APT Smart-Health a Wayarka</p>
        <p className="text-xs text-blue-100">Yi install ɗin app ɗin don samun sauƙin yin amfani da shi.</p>
      </div>
      <button
        onClick={handleInstallClick}
        className="ml-4 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition"
      >
        Install
      </button>
    </div>
  );
}
