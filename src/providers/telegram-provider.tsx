"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getTelegramWebApp, initTelegram, onTelegramEvent, type TelegramWebApp, type TelegramThemeParams } from '@/lib/telegram';

export type TelegramContextValue = {
  tg: TelegramWebApp | null;
  themeParams: TelegramThemeParams;
  colorScheme: 'light' | 'dark';
  initDataUnsafe: unknown;
  isWebApp: boolean;
};

const TelegramContext = createContext<TelegramContextValue>({
  tg: null,
  themeParams: {},
  colorScheme: 'light',
  initDataUnsafe: null,
  isWebApp: false,
});

function applyThemeToCSS(themeParams: TelegramThemeParams, colorScheme: 'light' | 'dark') {
  const root = document.documentElement;
  const map: Record<string, string | undefined> = {
    '--tg-bg-color': themeParams.bg_color,
    '--tg-text-color': themeParams.text_color,
    '--tg-hint-color': themeParams.hint_color,
    '--tg-link-color': themeParams.link_color,
    '--tg-button-color': themeParams.button_color,
    '--tg-button-text-color': themeParams.button_text_color,
  };
  Object.entries(map).forEach(([cssVar, value]) => {
    if (value) {
      const rgb = hexToRgb(value);
      if (rgb) root.style.setProperty(cssVar, `${rgb.r} ${rgb.g} ${rgb.b}`);
    }
  });
  const accentHex = themeParams.button_color || (colorScheme === 'dark' ? '#3390ec' : '#3390ec');
  const mutedHex = themeParams.hint_color || (colorScheme === 'dark' ? '#a8b0b9' : '#6b7280');
  const surfaceHex = themeParams.secondary_bg_color || (colorScheme === 'dark' ? '#1c1c1e' : '#ffffff');
  const borderHex = colorScheme === 'dark' ? '#ffffff' : '#000000';
  (
    [
      ['--astrot-accent', accentHex],
      ['--astrot-muted', mutedHex],
      ['--astrot-surface', surfaceHex],
      ['--astrot-card-bg', surfaceHex],
      ['--astrot-border', borderHex],
    ] as Array<[string, string]>
  ).forEach(([cssVar, hex]) => {
    const rgb = hexToRgb(hex);
    if (rgb) document.documentElement.style.setProperty(cssVar, `${rgb.r} ${rgb.g} ${rgb.b}`);
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
  if (Number.isNaN(bigint)) return null;
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [themeParams, setThemeParams] = useState<TelegramThemeParams>({});
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const initDataRef = useRef<unknown>(null);

  useEffect(() => {
    const w = typeof window !== 'undefined';
    const isWebApp = !!getTelegramWebApp();
    if (!w || !isWebApp) {
      applyThemeToCSS({}, 'light');
      setTg(null);
      setThemeParams({});
      setColorScheme('light');
      initDataRef.current = null;
      return;
    }

    const webApp = initTelegram({ ready: true, expand: true });
    if (!webApp) return;
    setTg(webApp);
    const tp = webApp.themeParams ?? {};
    const cs = (webApp.colorScheme as 'light' | 'dark') ?? 'light';
    setThemeParams(tp);
    setColorScheme(cs);
    initDataRef.current = webApp.initDataUnsafe ?? null;

    applyThemeToCSS(tp, cs);

    const offTheme = onTelegramEvent('themeChanged', () => {
      const newTp = webApp.themeParams ?? {};
      const newCs = (webApp.colorScheme as 'light' | 'dark') ?? 'light';
      setThemeParams(newTp);
      setColorScheme(newCs);
      applyThemeToCSS(newTp, newCs);
    });

    const offViewport = onTelegramEvent('viewportChanged', () => {
      const vh = webApp.viewportHeight ?? window.innerHeight;
      document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);
    });

    return () => {
      offTheme?.();
      offViewport?.();
    };
  }, []);

  const value = useMemo(
    () => ({ tg, themeParams, colorScheme, initDataUnsafe: initDataRef.current, isWebApp: !!tg }),
    [tg, themeParams, colorScheme]
  );

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegram() {
  return useContext(TelegramContext);
}