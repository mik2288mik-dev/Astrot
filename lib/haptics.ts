export function impactOccurred(style: 'light' | 'medium' | 'heavy' = 'light'): void {
  try {
    const tg = (typeof window !== 'undefined' ? (window as any)?.Telegram?.WebApp : null);
    if (tg?.HapticFeedback?.impactOccurred) {
      tg.HapticFeedback.impactOccurred(style);
      return;
    }
  } catch {
    // ignore
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      const patterns = { light: 10, medium: 50, heavy: 100 };
      navigator.vibrate?.(patterns[style]);
    } catch {
      // noop
    }
  }
}

// Backward compatibility
export function impactLight(): void {
  impactOccurred('light');
}

export function selectionChanged(): void {
  try {
    const tg = (typeof window !== 'undefined' ? (window as any)?.Telegram?.WebApp : null);
    if (tg?.HapticFeedback?.selectionChanged) {
      tg.HapticFeedback.selectionChanged();
      return;
    }
  } catch {
    // ignore
  }
}

export function notificationOccurred(type: 'error' | 'success' | 'warning'): void {
  try {
    const tg = (typeof window !== 'undefined' ? (window as any)?.Telegram?.WebApp : null);
    if (tg?.HapticFeedback?.notificationOccurred) {
      tg.HapticFeedback.notificationOccurred(type);
      return;
    }
  } catch {
    // ignore
  }
  // Fallback vibration patterns
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      const patterns = {
        error: [100, 50, 100],
        success: [50],
        warning: [100, 100, 100]
      };
      navigator.vibrate?.(patterns[type]);
    } catch {
      // noop
    }
  }
}