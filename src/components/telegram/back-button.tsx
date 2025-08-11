"use client";

import { useEffect } from 'react';
import { useTelegram } from '@/providers/telegram-provider';
import { useRouter } from 'next/navigation';
import { impactOccurred } from '@/lib/haptics';

export function BackButton({ visible = true }: { visible?: boolean }) {
  const { tg } = useTelegram();
  const router = useRouter();
  useEffect(() => {
    const bb = tg?.BackButton;
    if (!bb) return;
    if (visible) bb.show?.(); else bb.hide?.();
    const handle = () => {
      impactOccurred('light');
      router.back();
    };
    bb.onClick?.(handle);
    return () => bb.offClick?.(handle);
  }, [tg, visible, router]);
  return null;
}