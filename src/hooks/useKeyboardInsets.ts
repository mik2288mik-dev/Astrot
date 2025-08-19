'use client';
import { useEffect } from 'react';

export function useKeyboardInsets() {
  useEffect(() => {
    const set = (px: number) =>
      document.documentElement.style.setProperty('--kb', `${Math.max(0, Math.round(px))}px`);

    const updFromViewport = () => {
      const vv = (window as unknown as { visualViewport?: { height: number; offsetTop: number } }).visualViewport;
      if (!vv) return set(0);
      const kb = window.innerHeight - vv.height - vv.offsetTop;
      set(kb);
    };

    const tg = (window as unknown as { Telegram?: { WebApp?: { viewportHeight?: number; onEvent?: (event: string, callback: () => void) => void; offEvent?: (event: string, callback: () => void) => void } } }).Telegram?.WebApp;
    const onVC = () => {
      // Telegram viewport height -> инсет снизу
      const h = tg?.viewportHeight;
      if (h) set(window.innerHeight - h);
    };

    updFromViewport();
    window.visualViewport?.addEventListener('resize', updFromViewport);
    window.visualViewport?.addEventListener('scroll', updFromViewport);
    tg?.onEvent?.('viewportChanged', onVC);

    return () => {
      window.visualViewport?.removeEventListener?.('resize', updFromViewport);
      window.visualViewport?.removeEventListener?.('scroll', updFromViewport);
      tg?.offEvent?.('viewportChanged', onVC);
    };
  }, []);
}