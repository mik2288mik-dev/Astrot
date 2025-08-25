"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { impactOccurred } from '@/lib/haptics';

export function BackButton({ visible = true }: { visible?: boolean }) {
  const router = useRouter();
  
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    const bb = tg?.BackButton;
    
    if (!bb) return;
    
    if (visible) {
      bb.show?.();
    } else {
      bb.hide?.();
    }
    
    const handle = () => {
      impactOccurred('light');
      router.back();
    };
    
    bb.onClick?.(handle);
    
    return () => {
      bb.offClick?.(handle);
      bb.hide?.();
    };
  }, [visible, router]);
  
  return null;
}