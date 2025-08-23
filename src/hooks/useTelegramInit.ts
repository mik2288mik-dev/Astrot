'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        disableVerticalSwipes?: () => void;
        enableVerticalSwipes?: () => void;
        isVerticalSwipesEnabled?: boolean;
        version: string;
        platform: string;
        isVersionAtLeast: (version: string) => boolean;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

/**
 * Хук для инициализации Telegram Mini App с правильными настройками
 * Включает отключение вертикальных свайпов для предотвращения сворачивания
 */
export function useTelegramInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initTelegram = () => {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        console.warn('Telegram WebApp не найден');
        return;
      }

      // Основная инициализация
      tg.ready();
      tg.expand();
      
      // Отключаем вертикальные свайпы (Bot API 7.7+)
      if (tg.disableVerticalSwipes) {
        try {
          tg.disableVerticalSwipes();
          console.log('✅ Вертикальные свайпы отключены');
        } catch (error) {
          console.error('Ошибка при отключении свайпов:', error);
        }
      } else if (tg.isVersionAtLeast && tg.isVersionAtLeast('7.7')) {
        console.warn('disableVerticalSwipes недоступен, но версия поддерживается');
      } else {
        console.log('Версия Telegram WebApp не поддерживает disableVerticalSwipes');
      }

      // Устанавливаем цвета темы
      tg.setHeaderColor('#FFFFFF');
      tg.setBackgroundColor('#FFF6FB');
      
      // Логируем информацию для отладки
      console.log('Telegram WebApp инициализирован:', {
        version: tg.version,
        platform: tg.platform,
        user: tg.initDataUnsafe?.user,
        verticalSwipesDisabled: !tg.isVerticalSwipesEnabled
      });
    };

    // Пробуем инициализировать сразу
    if (window.Telegram?.WebApp) {
      initTelegram();
    } else {
      // Если Telegram еще не загружен, ждем немного
      const timer = setTimeout(initTelegram, 100);
      return () => clearTimeout(timer);
    }
  }, []);
}