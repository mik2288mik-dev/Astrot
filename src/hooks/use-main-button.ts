"use client";

import { useEffect, useMemo } from 'react';
import { useTelegram } from '@/providers/telegram-provider';

export function useMainButton() {
  const { tg } = useTelegram();

  useEffect(() => {
    return () => {
      try {
        tg?.MainButton?.hide?.();
      } catch {
        // ignore
      }
    };
  }, [tg]);

  return useMemo(() => ({
    show(text?: string) {
      if (!tg?.MainButton) return;
      if (text) tg.MainButton.setText?.(text);
      tg.MainButton.setParams?.({ is_active: true, is_visible: true });
      tg.MainButton.show?.();
    },
    hide() {
      tg?.MainButton?.hide?.();
    },
  }), [tg]);
}