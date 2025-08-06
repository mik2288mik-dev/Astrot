import React, { useEffect } from 'react';

interface LoadingScreenProps {
  onReady: () => void;
}

export default function LoadingScreen({ onReady }: LoadingScreenProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    tg?.ready();
    const timer = setTimeout(onReady, 1500);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/assets/bg-loading.png')" }}
    >
      <img src="/assets/spinner.png" alt="loading" className="w-16 h-16 animate-spin" />
      <p className="mt-4">Загрузка…</p>
    </div>
  );
}
