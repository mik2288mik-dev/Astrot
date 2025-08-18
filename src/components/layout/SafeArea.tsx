'use client';
import { useEffect } from 'react';

export default function SafeArea({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    tg?.ready?.();
    tg?.expand?.();
    tg?.enableClosingConfirmation?.();
    
    document.documentElement.style.setProperty('--safe-top', `calc(env(safe-area-inset-top) + 12px)`);
    document.documentElement.style.setProperty('--safe-bot', `calc(env(safe-area-inset-bottom) + 12px)`);
  }, []);

  return <div className="safe-wrap">{children}</div>;
}