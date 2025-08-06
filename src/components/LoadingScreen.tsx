import React, { useEffect } from 'react';

export function LoadingScreen({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    setTimeout(onReady, 1500);
  }, [onReady]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <img src="/assets/bg-loading.png" className="absolute inset-0 w-full h-full object-cover" />
      <img src="/assets/spinner.png" className="w-32 h-32 animate-spin" />
      <div className="mt-4 text-white text-lg">Загрузка…</div>
    </div>
  );
}
