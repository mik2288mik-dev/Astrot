"use client";

import { useEffect } from 'react';
import { useTelegram } from '@/providers/telegram-provider';
import { impactOccurred } from '@/lib/haptics';

type Props = {
  text: string;
  visible?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function MainButton({ text, visible = true, disabled = false, onClick }: Props) {
  const { tg } = useTelegram();
  useEffect(() => {
    if (!tg?.MainButton) return;
    const mb = tg.MainButton;
    mb.setText?.(text);
    mb.setParams?.({ is_active: !disabled });
    if (visible) mb.show?.(); else mb.hide?.();
    const handle = () => {
      impactOccurred('light');
      onClick?.();
    };
    mb.onClick?.(handle);
    return () => {
      mb.offClick?.(handle);
      mb.hide?.();
    };
  }, [tg, text, visible, disabled, onClick]);
  return null;
}