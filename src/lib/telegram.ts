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

export type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  enableClosingConfirmation?: () => void;
  onEvent?: (event: 'themeChanged' | 'viewportChanged', handler: () => void) => void;
  offEvent?: (event: 'themeChanged' | 'viewportChanged', handler: () => void) => void;
  themeParams?: TelegramThemeParams;
  colorScheme?: 'light' | 'dark';
  initDataUnsafe?: unknown;
  MainButton?: TelegramMainButton;
  BackButton?: TelegramBackButton;
  HapticFeedback?: TelegramHapticFeedback;
  viewportHeight?: number;
};

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  const tg = (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } })?.Telegram?.WebApp;
  return tg ?? null;
}

export function initTelegram(options?: { ready?: boolean; expand?: boolean; enableClosingConfirmation?: boolean }) {
  const tg = getTelegramWebApp();
  if (!tg) return null;
  try {
    if (options?.ready !== false) tg.ready();
    if (options?.expand !== false) tg.expand();
    if (options?.enableClosingConfirmation) tg.enableClosingConfirmation?.();
  } catch {
    // ignore
  }
  return tg;
}

export function onTelegramEvent(event: 'themeChanged' | 'viewportChanged', handler: () => void) {
  const tg = getTelegramWebApp();
  if (!tg?.onEvent) return () => {};
  tg.onEvent?.(event, handler);
  return () => tg.offEvent?.(event, handler);
}