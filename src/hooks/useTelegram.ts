'use client';

import { useEffect, useState } from 'react';
import type { WebApp } from '@twa-dev/types';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_bot?: boolean;
  is_premium?: boolean;
}

// Расширяем window для Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Инициализация
      tg.ready();
      tg.expand();
      
      // Установка цветов для светлой темы
      tg.setHeaderColor('#FFFFFF');
      tg.setBackgroundColor('#FAFAFA');
      
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user as TelegramUser || null);
      setIsReady(true);
      
      // Логирование для отладки
      console.log('Telegram WebApp initialized:', {
        user: tg.initDataUnsafe?.user,
        version: tg.version,
        platform: tg.platform,
        colorScheme: tg.colorScheme,
      });
    }
  }, []);

  const showMainButton = (text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
    }
  };

  const showBackButton = (onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(onClick);
      webApp.BackButton.show();
    }
  };

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
    }
  };

  const hapticFeedback = (type: 'impact' | 'notification' | 'selection', style?: string) => {
    if (webApp?.HapticFeedback) {
      if (type === 'impact') {
        webApp.HapticFeedback.impactOccurred((style as 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') || 'medium');
      } else if (type === 'notification') {
        webApp.HapticFeedback.notificationOccurred((style as 'error' | 'success' | 'warning') || 'success');
      } else if (type === 'selection') {
        webApp.HapticFeedback.selectionChanged();
      }
    }
  };

  const showAlert = (message: string, callback?: () => void) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message, callback);
    } else {
      alert(message);
      callback?.();
    }
  };

  const showConfirm = (message: string, callback?: (confirmed: boolean) => void) => {
    if (webApp?.showConfirm) {
      webApp.showConfirm(message, callback);
    } else {
      const confirmed = confirm(message);
      callback?.(confirmed);
    }
  };

  return {
    webApp,
    user,
    isReady,
    initData: webApp?.initData || '',
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
  };
}

// Хук для получения имени пользователя
export function useTelegramUser() {
  const { user } = useTelegram();
  
  const fullName = user ? 
    `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : 
    'Гость';
  
  const firstName = user?.first_name || 'Гость';
  const username = user?.username;
  const photoUrl = user?.photo_url;
  const userId = user?.id;
  
  return {
    fullName,
    firstName,
    username,
    photoUrl,
    userId,
    user,
  };
}