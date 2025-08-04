export {};

declare global {
  interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    platform: string;
    colorScheme?: string;
    initDataUnsafe?: {
      user?: {
        id?: number;
        first_name?: string;
        last_name?: string;
        username?: string;
        photo_url?: string;
      };
    };
  }

  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}
