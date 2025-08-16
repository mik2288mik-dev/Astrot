"use client";

import { useEffect, useMemo } from 'react';

export function useMainButton() {
  useEffect(() => {
    return () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tg = (window as any).Telegram?.WebApp;
        tg?.MainButton?.hide?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return useMemo(() => ({
    show(text?: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tg = (window as any).Telegram?.WebApp;
      if (!tg?.MainButton) return;
      if (text) tg.MainButton.setText?.(text);
      tg.MainButton.setParams?.({ is_active: true, is_visible: true });
      tg.MainButton.show?.();
    },
    hide() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tg = (window as any).Telegram?.WebApp;
      tg?.MainButton?.hide?.();
    },
  }), []);
}