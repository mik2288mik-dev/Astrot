export function impactLight(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      // Light vibration pulse ~10ms
      navigator.vibrate?.(10);
    } catch {
      // noop
    }
  }
}