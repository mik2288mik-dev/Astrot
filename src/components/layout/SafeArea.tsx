'use client';
import { useEffect } from 'react';
import type { WebApp } from '@twa-dev/types';

// Расширяем window для Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

export function SafeAreaInit() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    // Инициализация Telegram WebApp
    tg.ready();
    tg.expand();

    // Убираем сворачивание при свайпе вниз (если метод доступен)
    if ('disableVerticalSwipes' in tg && typeof tg.disableVerticalSwipes === 'function') {
      tg.disableVerticalSwipes();
    }

    // Подтверждение при закрытии
    tg.enableClosingConfirmation();

    // Безопасные отступы для шапки/низа
    document.documentElement.style.setProperty('--safe-top', 'calc(env(safe-area-inset-top) + 12px)');
    document.documentElement.style.setProperty('--safe-bot', 'calc(env(safe-area-inset-bottom) + 12px)');

    // Системное поведение браузера - предотвращаем pull-to-refresh
    const html = document.documentElement;
    const body = document.body;
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    
    // Cleanup при размонтировании
    return () => {
      // Восстанавливаем стандартное поведение если нужно
      if ('enableVerticalSwipes' in tg && typeof tg.enableVerticalSwipes === 'function') {
        tg.enableVerticalSwipes();
      }
      tg.disableClosingConfirmation();
    };
  }, []);

  return null;
}

// Оставляем старый компонент для обратной совместимости
export default function SafeArea({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    // Инициализация Telegram WebApp
    tg.ready();
    tg.expand();

    // Убираем сворачивание при свайпе вниз (если метод доступен)
    if ('disableVerticalSwipes' in tg && typeof tg.disableVerticalSwipes === 'function') {
      tg.disableVerticalSwipes();
    }

    // Подтверждение при закрытии
    tg.enableClosingConfirmation();
    
    // Безопасные отступы
    document.documentElement.style.setProperty('--safe-top', 'calc(env(safe-area-inset-top) + 12px)');
    document.documentElement.style.setProperty('--safe-bot', 'calc(env(safe-area-inset-bottom) + 12px)');

    // Предотвращаем pull-to-refresh
    const html = document.documentElement;
    const body = document.body;
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
  }, []);

  return <div className="safe-wrap">{children}</div>;
}