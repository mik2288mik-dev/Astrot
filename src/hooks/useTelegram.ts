'use client';

import { useEffect, useState } from 'react';

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

interface WebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    isVisible: boolean;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    chat?: object;
    start_param?: string;
    can_send_after?: number;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (color: 'bg_color' | 'secondary_bg_color' | string) => void;
  setBackgroundColor: (color: 'bg_color' | 'secondary_bg_color' | string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text?: string }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params?: { text?: string }, callback?: (text: string) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (text: string) => void) => void;
  requestWriteAccess: (callback?: (granted: boolean) => void) => void;
  requestContact: (callback?: (shared: boolean) => void) => void;
  invokeCustomMethod: (method: string, params?: object, callback?: (result: unknown) => void) => void;
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
      setUser(tg.initDataUnsafe?.user || null);
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
    if (webApp) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    if (webApp) {
      webApp.MainButton.hide();
    }
  };

  const showBackButton = (onClick: () => void) => {
    if (webApp) {
      webApp.BackButton.onClick(onClick);
      webApp.BackButton.show();
    }
  };

  const hideBackButton = () => {
    if (webApp) {
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
    if (webApp) {
      webApp.showAlert(message, callback);
    } else {
      alert(message);
      callback?.();
    }
  };

  const showConfirm = (message: string, callback?: (confirmed: boolean) => void) => {
    if (webApp) {
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