'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTelegramAuth } from './telegram-auth';

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      language_code?: string;
      is_premium?: boolean;
      added_to_attachment_menu?: boolean;
      allows_write_to_pm?: boolean;
    };
    chat?: unknown;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
  };
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
  isExpanded: boolean;
  viewportHeight: number;
  viewportWidth: number;
  platform: string;
  version: string;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: {
    text?: string;
  }, callback?: (data: string) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (data: string) => void) => void;
  requestWriteAccess: (callback?: (access: boolean) => void) => void;
  requestContact: (callback?: (contact: {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
    vcard?: string;
  }) => void) => void;
  invokeCustomMethod: (method: string, params?: unknown) => void;
  isVersionAtLeast: (version: string) => boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const { user, isAuthorized, platform, colorScheme } = useTelegramAuth();
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setWebApp(tg);
      tg.ready();
      setIsReady(true);
    }
  }, []);

  const showMainButton = useCallback((text: string, callback?: () => void) => {
    if (!webApp) return;
    
    webApp.MainButton.setText(text);
    if (callback) {
      webApp.MainButton.onClick(callback);
    }
    webApp.MainButton.show();
  }, [webApp]);

  const hideMainButton = useCallback(() => {
    if (!webApp) return;
    webApp.MainButton.hide();
  }, [webApp]);

  const showBackButton = useCallback((callback?: () => void) => {
    if (!webApp) return;
    
    if (callback) {
      webApp.BackButton.onClick(callback);
    }
    webApp.BackButton.show();
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    if (!webApp) return;
    webApp.BackButton.hide();
  }, [webApp]);

  const hapticFeedback = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    if (!webApp) return;
    webApp.HapticFeedback.impactOccurred(style);
  }, [webApp]);

  const showAlert = useCallback((message: string) => {
    if (!webApp) return;
    return new Promise<void>((resolve) => {
      webApp.showAlert(message, resolve);
    });
  }, [webApp]);

  const showConfirm = useCallback((message: string) => {
    if (!webApp) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      webApp.showConfirm(message, resolve);
    });
  }, [webApp]);

  const showPopup = useCallback((params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text: string;
    }>;
  }) => {
    if (!webApp) return Promise.resolve('');
    return new Promise<string>((resolve) => {
      webApp.showPopup(params, resolve);
    });
  }, [webApp]);

  const expand = useCallback(() => {
    if (!webApp) return;
    webApp.expand();
  }, [webApp]);

  const close = useCallback(() => {
    if (!webApp) return;
    webApp.close();
  }, [webApp]);

  const openLink = useCallback((url: string, options?: { try_instant_view?: boolean }) => {
    if (!webApp) return;
    webApp.openLink(url, options);
  }, [webApp]);

  const sendData = useCallback((data: string) => {
    if (!webApp) return;
    webApp.sendData(data);
  }, [webApp]);

  const getUserFullName = useCallback(() => {
    if (!user) return '';
    return [user.first_name, user.last_name].filter(Boolean).join(' ');
  }, [user]);

  const getUserDisplayName = useCallback(() => {
    if (!user) return '';
    return getUserFullName() || user.username || `User${user.id}`;
  }, [user, getUserFullName]);

  return {
    webApp,
    isReady,
    isAuthorized,
    user,
    platform,
    colorScheme,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    showPopup,
    expand,
    close,
    openLink,
    sendData,
    getUserFullName,
    getUserDisplayName,
  };
}