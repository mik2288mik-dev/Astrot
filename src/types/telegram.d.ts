export {};

declare global {
  interface TelegramWebApp {
    ready?: () => void;
    expand?: () => void;
    enableClosingConfirmation?: () => void;
  }
  interface TelegramNamespace { WebApp?: TelegramWebApp }
  interface Window { Telegram?: TelegramNamespace }
}