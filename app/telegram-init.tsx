"use client";

import { useEffect } from 'react';

declare global {
  interface Window { Telegram?: any }
}

export function TelegramInit() {
  useEffect(() => {
    try {
      const tg = window?.Telegram?.WebApp;
      if (!tg) return;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0f172a');
      tg.setBackgroundColor('#0f172a');
      // Enable haptic feedback on supported devices
      tg.HapticFeedback?.impactOccurred('light');
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}