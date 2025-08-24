'use client';

import { useEffect } from 'react';

/**
 * Компонент для инициализации Telegram Web App и управления safe area
 * Рендерится один раз при загрузке приложения
 */
export default function SafeAreaInit() {
  useEffect(() => {
    // Получаем объект Telegram Web App
    const tg = window?.Telegram?.WebApp;
    
    if (tg) {
      // Инициализация Telegram Web App
      tg.ready?.();
      
      // Разворачиваем приложение на весь экран
      tg.expand?.();
      
      // Отключаем вертикальные свайпы для закрытия
      tg.disableVerticalSwipes?.();
      
      // Отключаем подтверждение закрытия
      tg.disableClosingConfirmation?.();
      
      // Устанавливаем цвет header bar
      tg.setHeaderColor?.('#1E1F36');
      
      // Устанавливаем цвет background
      tg.setBackgroundColor?.('#1E1F36');
    }
    
    // Отключаем overscroll behavior для предотвращения pull-to-refresh
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';
    
    // Добавляем стили для safe area
    document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
    document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
    
    // Cleanup функция
    return () => {
      // Восстанавливаем overscroll behavior при размонтировании
      document.documentElement.style.overscrollBehavior = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);
  
  // Компонент не рендерит никакой UI
  return null;
}