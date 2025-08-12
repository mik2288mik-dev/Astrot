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
  colorScheme: 'dark',
  initDataUnsafe: null,
  isWebApp: false,
});

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
  if (Number.isNaN(bigint)) return null;
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function applyBrandTheme(colorScheme: 'light' | 'dark') {
  const root = document.documentElement;
  root.setAttribute('data-color-scheme', colorScheme);

  const palette = colorScheme === 'dark'
    ? {
        bg: '#0E0D1B',
        surface: '#1A1A2E',
        accent: '#7C5DFA',
        muted: '#A1A1B2',
        text: '#FFFFFF',
      }
    : {
        bg: '#F7F7FB',
        surface: '#FFFFFF',
        accent: '#7C5DFA',
        muted: '#8A8C99',
        text: '#0E0D1B',
      };

  const pairs: Array<[string, string]> = [
    ['--astrot-bg', palette.bg],
    ['--astrot-surface', palette.surface],
    ['--astrot-accent', palette.accent],
    ['--astrot-muted', palette.muted],
    ['--astrot-text', palette.text],
  ];
  pairs.forEach(([cssVar, hex]) => {
    const rgb = hexToRgb(hex);
    if (rgb) root.style.setProperty(cssVar, `${rgb.r} ${rgb.g} ${rgb.b}`);
  });

  // Keep Telegram variables in sync with brand
  const mapToTg: Record<string, string> = {
    '--tg-bg-color': 'var(--astrot-bg)',
    '--tg-text-color': 'var(--astrot-text)',
    '--tg-hint-color': 'var(--astrot-muted)',
    '--tg-link-color': 'var(--astrot-accent)',
    '--tg-button-color': 'var(--astrot-accent)',
    '--tg-button-text-color': 'var(--astrot-text)',
    '--tg-theme-bg-color': 'var(--astrot-bg)',
    '--tg-theme-text-color': 'var(--astrot-text)',
    '--tg-theme-hint-color': 'var(--astrot-muted)',
    '--tg-theme-link-color': 'var(--astrot-accent)',
    '--tg-theme-button-color': 'var(--astrot-accent)',
    '--tg-theme-button-text-color': 'var(--astrot-text)'
  };
  Object.entries(mapToTg).forEach(([cssVar, value]) => root.style.setProperty(cssVar, value));
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [themeParams, setThemeParams] = useState<TelegramThemeParams>({});
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');
  const initDataRef = useRef<unknown>(null);

  useEffect(() => {
    const w = typeof window !== 'undefined';
    const isWebApp = !!getTelegramWebApp();
    if (!w || !isWebApp) {
      applyBrandTheme('dark');
      setTg(null);
      setThemeParams({});
      setColorScheme('dark');
      initDataRef.current = null;
      return;
    }

    const webApp = initTelegram({ ready: true, expand: true, enableClosingConfirmation: true });
    if (!webApp) return;
    setTg(webApp);
    const tp = webApp.themeParams ?? {};
    const cs = (webApp.colorScheme as 'light' | 'dark') ?? 'dark';
    setThemeParams(tp);
    setColorScheme(cs);
    initDataRef.current = webApp.initDataUnsafe ?? null;

    // Set initial viewport height immediately
    const initialVh = webApp.viewportHeight ?? window.innerHeight;
    document.documentElement.style.setProperty('--tg-viewport-height', `${initialVh}px`);

    applyBrandTheme(cs);

    const offTheme = onTelegramEvent('themeChanged', () => {
      const newCs = (webApp.colorScheme as 'light' | 'dark') ?? 'dark';
      setColorScheme(newCs);
      applyBrandTheme(newCs);
    });

    const offViewport = onTelegramEvent('viewportChanged', () => {
      const vh = webApp.viewportHeight ?? window.innerHeight;
      document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);
    });

    // Ensure expand() is called on the first real user interaction as well
    const handleFirstInteraction = () => {
      try {
        webApp.ready?.();
        webApp.expand?.();
      } catch {}
    };
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true });

    return () => {
      offTheme?.();
      offViewport?.();
    };
  }, []);

  // Ensure Telegram MainButton is hidden by default
  useEffect(() => {
    try {
      tg?.MainButton?.hide?.();
      tg?.MainButton?.setParams?.({ is_active: false, is_visible: false });
    } catch {
      // ignore
    }
  }, [tg]);

  const value = useMemo(
    () => ({ tg, themeParams, colorScheme, initDataUnsafe: initDataRef.current, isWebApp: !!tg }),
    [tg, themeParams, colorScheme]
  );

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegram() {
  return useContext(TelegramContext);
}