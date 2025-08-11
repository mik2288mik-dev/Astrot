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

      tg.ready();
      tg.expand();

      // Try to enter fullscreen on supported platforms
      try {
        tg.requestFullscreen?.();
      } catch {
        // ignore
      }
      // Prevent vertical swipes collapsing the viewport when supported
      try {
        tg.disableVerticalSwipes?.();
      } catch {
        // ignore
      }

      // Apply Telegram theme params if present
      const tp = tg.themeParams || {};
      const header = tp.header_color || '#FFF4E6';
      const bg = tp.bg_color || '#FFF7F4';
      tg.setHeaderColor(header);
      tg.setBackgroundColor(bg);

      // Platform-aware top spacing tokens
      const platform: string = tg.platform || '';
      const root = document.documentElement;
      if (platform === 'ios') {
        root.style.setProperty('--top-bar-min', '72px');
        root.style.setProperty('--top-gap', '24px');
      } else if (platform === 'android') {
        root.style.setProperty('--top-bar-min', '64px');
        root.style.setProperty('--top-gap', '20px');
      } else {
        root.style.setProperty('--top-bar-min', '64px');
        root.style.setProperty('--top-gap', '20px');
      }

      // Push theme to CSS variables for glass contrast
      root.style.setProperty('--glass-bg', '255 255 255 / 0.65');
      root.style.setProperty('--glass-stroke', '17 24 39 / 0.08');

      tg.HapticFeedback?.impactOccurred?.('light');

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