"use client";

import { useEffect } from 'react';
import { useTelegram } from '@/providers/telegram-provider';

export function useBackButton(visible: boolean) {
  const { tg } = useTelegram();
  useEffect(() => {
    const bb = tg?.BackButton;
    if (!bb) return;
    if (visible) bb.show?.(); else bb.hide?.();
    return () => bb.hide?.();
  }, [tg, visible]);
}