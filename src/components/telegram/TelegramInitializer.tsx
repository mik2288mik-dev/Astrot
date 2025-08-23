'use client';

import { useTelegramInit } from '@/hooks/useTelegramInit';

/**
 * Клиентский компонент для инициализации Telegram WebApp
 * Должен быть размещен в корне приложения
 */
export default function TelegramInitializer() {
  useTelegramInit();
  return null;
}