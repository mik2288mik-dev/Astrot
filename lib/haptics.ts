export function impactLight(): void {
  try {
    const tg = (typeof window !== 'undefined' ? (window as any)?.Telegram?.WebApp : null);
    if (tg?.HapticFeedback?.impactOccurred) {
      tg.HapticFeedback.impactOccurred('light');
      return;
    }
  } catch {
    // ignore
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate?.(10);
    } catch {
      // noop
    }
  }
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