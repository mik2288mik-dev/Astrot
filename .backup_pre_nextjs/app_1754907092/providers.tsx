"use client";

import { TelegramProvider } from './telegram-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return <TelegramProvider>{children}</TelegramProvider>;
}