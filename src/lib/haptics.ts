import { getTelegramWebApp } from '@/lib/telegram';

export function impactOccurred(style: 'light' | 'medium' | 'heavy' = 'light') {
  const tg = getTelegramWebApp();
  try {
    tg?.HapticFeedback?.impactOccurred?.(style);
  } catch {
    // ignore
  }
}

export function notificationOccurred(type: 'success' | 'warning' | 'error' = 'success') {
  const tg = getTelegramWebApp();
  try {
    tg?.HapticFeedback?.notificationOccurred?.(type);
  } catch {
    // ignore
  }
}