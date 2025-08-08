"use client";

import { TelegramInit } from './telegram-init';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TelegramInit />
      {children}
    </>
  );
}