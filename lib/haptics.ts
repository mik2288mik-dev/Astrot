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