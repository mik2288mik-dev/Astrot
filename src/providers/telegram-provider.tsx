"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type TelegramUser = {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
};

export type TelegramThemeParams = {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
};

export type TelegramContextValue = {
  user: TelegramUser | null;
  isReady: boolean;
  colorScheme: 'light' | 'dark';
  themeParams: TelegramThemeParams;
  platform: string | undefined;
};

const TelegramContext = createContext<TelegramContextValue>({
  user: null,
  isReady: false,
  colorScheme: 'dark',
  themeParams: {},
  platform: undefined,
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');
  const [theme, setTheme] = useState<TelegramThemeParams>({});
  const [platform, setPlatform] = useState<string>();

  useEffect(() => {
    const init = async () => {
      try {
        // Проверяем наличие Telegram WebApp
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tg = (window as any).Telegram?.WebApp;
        
        if (tg) {
          // Инициализация
          tg.ready();
          tg.expand();
          
          // Получение данных пользователя
          const initData = tg.initDataUnsafe;
          if (initData?.user) {
            const tgUser = initData.user;
            setUser({
              id: tgUser.id,
              firstName: tgUser.first_name,
              lastName: tgUser.last_name,
              username: tgUser.username,
              languageCode: tgUser.language_code,
              isPremium: tgUser.is_premium,
              photoUrl: tgUser.photo_url || (tgUser.username ? 
                `https://t.me/i/userpic/320/${tgUser.username}.jpg` : undefined),
            });
          }
          
          // Получение темы
          const themeParams = tg.themeParams || {};
          setTheme(themeParams);
          setColorScheme(tg.colorScheme === 'light' ? 'light' : 'dark');
          setPlatform(tg.platform);
          
          // Применение стилей
          applyBrandTheme(tg.colorScheme === 'light' ? 'light' : 'dark', themeParams);
          
          // Слушаем изменения темы
          tg.onEvent('themeChanged', () => {
            const newColorScheme = tg.colorScheme === 'light' ? 'light' : 'dark';
            setColorScheme(newColorScheme);
            setTheme(tg.themeParams || {});
            applyBrandTheme(newColorScheme, tg.themeParams);
          });
          
          // Настройка viewport
          if (tg.viewportHeight) {
            document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
          }
          
          tg.onEvent('viewportChanged', () => {
            if (tg.viewportHeight) {
              document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
            }
          });
          
          // Скрываем кнопки по умолчанию
          if (tg.MainButton) {
            tg.MainButton.hide();
          }
          if (tg.BackButton) {
            tg.BackButton.hide();
          }
        } else {
          // Fallback для разработки
          console.log('Running outside Telegram WebApp');
          applyBrandTheme('dark', {});
        }
        
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize Telegram Mini App:', error);
        // Fallback для разработки
        setIsReady(true);
        applyBrandTheme('dark', {});
      }
    };
    
    init();
  }, []);

  const value = useMemo(
    () => ({ 
      user, 
      isReady, 
      colorScheme, 
      themeParams: theme,
      platform 
    }),
    [user, isReady, colorScheme, theme, platform]
  );

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegram() {
  return useContext(TelegramContext);
}

function applyBrandTheme(colorScheme: 'light' | 'dark', themeParams?: TelegramThemeParams) {
  const root = document.documentElement;
  root.setAttribute('data-color-scheme', colorScheme);

  const palette = colorScheme === 'dark'
    ? {
        bg: '#0E0D1B',
        surface: '#1A1A2E',
        accent: '#7C5DFA',
        muted: '#A1A1B2',
        text: '#FFFFFF',
        border: 'rgba(255, 255, 255, 0.1)',
      }
    : {
        bg: '#F7F7FB',
        surface: '#FFFFFF',
        accent: '#7C5DFA',
        muted: '#8A8C99',
        text: '#0E0D1B',
        border: 'rgba(0, 0, 0, 0.1)',
      };

  // Применяем цвета из Telegram, если они есть
  if (themeParams?.bg_color) palette.bg = themeParams.bg_color;
  if (themeParams?.text_color) palette.text = themeParams.text_color;
  if (themeParams?.button_color) palette.accent = themeParams.button_color;
  if (themeParams?.hint_color) palette.muted = themeParams.hint_color;

  const pairs: Array<[string, string]> = [
    ['--astrot-bg', palette.bg],
    ['--astrot-surface', palette.surface],
    ['--astrot-accent', palette.accent],
    ['--astrot-muted', palette.muted],
    ['--astrot-text', palette.text],
    ['--astrot-border', palette.border],
  ];
  
  pairs.forEach(([cssVar, value]) => {
    root.style.setProperty(cssVar, value);
  });

  // Keep Telegram variables in sync with brand
  const mapToTg: Record<string, string> = {
    '--tg-bg-color': palette.bg,
    '--tg-text-color': palette.text,
    '--tg-hint-color': palette.muted,
    '--tg-link-color': palette.accent,
    '--tg-button-color': palette.accent,
    '--tg-button-text-color': '#FFFFFF',
    '--tg-theme-bg-color': palette.bg,
    '--tg-theme-text-color': palette.text,
    '--tg-theme-hint-color': palette.muted,
    '--tg-theme-link-color': palette.accent,
    '--tg-theme-button-color': palette.accent,
    '--tg-theme-button-text-color': '#FFFFFF'
  };
  
  Object.entries(mapToTg).forEach(([cssVar, value]) => {
    root.style.setProperty(cssVar, value);
  });

  // Update <meta name="theme-color"> to match Telegram theme bg
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    const newMeta = document.createElement('meta');
    newMeta.name = 'theme-color';
    newMeta.content = palette.bg;
    document.head.appendChild(newMeta);
  } else {
    meta.setAttribute('content', palette.bg);
  }
}