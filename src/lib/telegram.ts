import { useEffect, useState } from 'react';

export type HapticImpactStyle = 'light' | 'medium' | 'heavy';
export type HapticNotificationType = 'success' | 'warning' | 'error';

export type TelegramMainButton = {
  setText?: (text: string) => void;
  show?: () => void;
  hide?: () => void;
  onClick?: (handler: () => void) => void;
  offClick?: (handler: () => void) => void;
  setParams?: (params: { is_active?: boolean; is_visible?: boolean }) => void;
};

export type TelegramBackButton = {
  show?: () => void;
  hide?: () => void;
  onClick?: (handler: () => void) => void;
  offClick?: (handler: () => void) => void;
};

export type TelegramHapticFeedback = {
  impactOccurred?: (style: HapticImpactStyle) => void;
  notificationOccurred?: (type: HapticNotificationType) => void;
};

export type TelegramThemeParams = Record<string, string>;

// Типы TG-пользователя
export type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
};

export type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  requestFullscreen?: () => void;
  enableClosingConfirmation?: () => void;
  onEvent?: (event: 'themeChanged' | 'viewportChanged', handler: (payload?: unknown) => void) => void;
  offEvent?: (event: 'themeChanged' | 'viewportChanged', handler: (payload?: unknown) => void) => void;
  themeParams?: TelegramThemeParams;
  colorScheme?: 'light' | 'dark';
  initDataUnsafe?: {
    user?: TgUser;
    [key: string]: unknown;
  };
  MainButton?: TelegramMainButton;
  BackButton?: TelegramBackButton;
  HapticFeedback?: TelegramHapticFeedback;
  viewportHeight?: number;
  viewportStableHeight?: number;
  isExpanded?: boolean;
};

let cachedTelegramWebApp: TelegramWebApp | null = null;

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  const tg = (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } })?.Telegram?.WebApp;
  return tg ?? null;
}

// Безопасное чтение пользователя
export function getTelegramUser(): TgUser | null {
  try {
    const tg = getTelegramWebApp();
    return tg?.initDataUnsafe?.user ?? null;
  } catch {
    return null;
  }
}

export function initTelegram(options?: {
  ready?: boolean
  expand?: boolean
  requestFullscreen?: boolean
  enableClosingConfirmation?: boolean
}) {
  const tg = getTelegramWebApp();
  if (!tg) return null;
  try {
    if (options?.ready !== false) tg.ready();
    if (options?.expand) tg.expand();
    if (options?.requestFullscreen) tg.requestFullscreen?.();
    if (options?.enableClosingConfirmation) tg.enableClosingConfirmation?.();
  } catch {
    // ignore
  }
  cachedTelegramWebApp = tg;
  return tg;
}

export function getTelegram(): TelegramWebApp | null {
  return cachedTelegramWebApp ?? getTelegramWebApp();
}

export function onTelegramEvent(event: 'themeChanged' | 'viewportChanged', handler: (payload?: unknown) => void) {
  const tg = getTelegramWebApp();
  if (!tg?.onEvent) return () => {};
  tg.onEvent?.(event, handler as any);
  return () => tg.offEvent?.(event, handler as any);
}

// Хук с мягким поллингом (SDK может прийти не мгновенно)
export function useTelegramUser() {
  const [user, setUser] = useState<TgUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let tries = 0;
    const tick = () => {
      const u = getTelegramUser();
      if (u) {
        setUser(u);
        setLoaded(true);
      } else if (tries++ > 12) {
        setLoaded(true); // через ~1.8s прекращаем ожидание
      }
    };
    const id = setInterval(tick, 150);
    tick();
    return () => clearInterval(id);
  }, []);

  return { user, loaded };
}