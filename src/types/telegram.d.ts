import type { WebApp } from '@twa-dev/types';

// Глобальное расширение Window
declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

// Экспортируем типы для использования в проекте
export type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
};

export {};