// единая декларация, совместимая с @telegram-apps/sdk
import type { WebApp } from '@telegram-apps/sdk';

export type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;          // ВАЖНО: без "?" у WebApp, чтобы совпало с базовой декларацией
    };
  }
}