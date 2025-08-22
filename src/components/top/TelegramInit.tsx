"use client";
import { useEffect } from "react";

export default function TelegramInit() {
  useEffect(() => {
    try {
      const wa = (window as any)?.Telegram?.WebApp;
      wa?.ready?.();
      wa?.expand?.();
    } catch {}
  }, []);
  return null;
}