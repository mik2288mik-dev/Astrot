"use client";

import { useEffect } from 'react';

export function useBackButton(visible: boolean) {
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
    
    return () => bb.hide?.();
  }, [visible]);
}