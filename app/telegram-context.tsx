"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
};

export type TelegramContextValue = {
  webApp: any | null;
  user: TelegramUser | null;
};

const TelegramContext = createContext<TelegramContextValue>({ webApp: null, user: null });

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<any | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    try {
      const tg = (window as any)?.Telegram?.WebApp;
      if (!tg) return;

      // Initialize and expand to fullscreen immediately
      tg.ready();
      tg.expand();

      // Harmonize colors with app design
      tg.setHeaderColor('#0f172a');
      tg.setBackgroundColor('#0f172a');

      // Haptics ping on init
      tg.HapticFeedback?.impactOccurred?.('light');

      // Get user from initDataUnsafe
      const initUser = tg.initDataUnsafe?.user as TelegramUser | undefined;
      if (initUser) setUser(initUser);

      setWebApp(tg);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ webApp, user }), [webApp, user]);

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegram() {
  return useContext(TelegramContext);
}