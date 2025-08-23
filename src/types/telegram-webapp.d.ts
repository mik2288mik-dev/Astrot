// Расширяем типы Telegram.WebApp локально (без импорта сторонних пакетов)
declare global {
  interface Window {
    Telegram?: { 
      WebApp?: TelegramWebApp;
    };
  }
  
  interface TelegramWebApp {
    // Основные методы
    ready?: () => void;
    expand?: () => void;
    close?: () => void;
    
    // Методы для управления свайпами
    disableVerticalSwipes?: () => void;
    enableVerticalSwipes?: () => void;
    isVerticalSwipesEnabled?: boolean;
    
    // Метод для подтверждения закрытия
    enableClosingConfirmation?: () => void;
    disableClosingConfirmation?: () => void;
    
    // Свойства
    version?: string;
    platform?: string;
    colorScheme?: 'light' | 'dark';
    themeParams?: {
      bg_color?: string;
      text_color?: string;
      hint_color?: string;
      link_color?: string;
      button_color?: string;
      button_text_color?: string;
      secondary_bg_color?: string;
    };
    
    // Данные пользователя
    initDataUnsafe?: {
      user?: {
        id?: number;
        first_name?: string;
        last_name?: string;
        username?: string;
        language_code?: string;
        photo_url?: string;
      };
      chat?: {
        id?: number;
        type?: string;
        title?: string;
        username?: string;
        photo_url?: string;
      };
    };
    
    // Кнопки
    MainButton?: {
      text?: string;
      color?: string;
      textColor?: string;
      isVisible?: boolean;
      isActive?: boolean;
      isProgressVisible?: boolean;
      show?: () => void;
      hide?: () => void;
      enable?: () => void;
      disable?: () => void;
      showProgress?: (leaveActive?: boolean) => void;
      hideProgress?: () => void;
      setText?: (text: string) => void;
      onClick?: (callback: () => void) => void;
      offClick?: (callback: () => void) => void;
    };
    
    BackButton?: {
      isVisible?: boolean;
      show?: () => void;
      hide?: () => void;
      onClick?: (callback: () => void) => void;
      offClick?: (callback: () => void) => void;
    };
    
    // Методы для уведомлений
    showAlert?: (message: string, callback?: () => void) => void;
    showConfirm?: (message: string, callback?: (confirmed: boolean) => void) => void;
    showPopup?: (params: {
      title?: string;
      message: string;
      buttons?: Array<{
        id?: string;
        type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
        text?: string;
      }>;
    }, callback?: (buttonId: string) => void) => void;
    
    // Haptic feedback
    HapticFeedback?: {
      impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
      notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
      selectionChanged?: () => void;
    };
    
    // Методы для работы с данными
    sendData?: (data: string) => void;
    openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
    openTelegramLink?: (url: string) => void;
    openInvoice?: (url: string, callback?: (status: string) => void) => void;
    
    // События
    onEvent?: (eventType: string, eventHandler: () => void) => void;
    offEvent?: (eventType: string, eventHandler: () => void) => void;
    
    // Viewport
    viewportHeight?: number;
    viewportStableHeight?: number;
    isExpanded?: boolean;
    
    // Методы для работы с QR
    showScanQrPopup?: (params?: { text?: string }, callback?: (text: string) => boolean | void) => void;
    closeScanQrPopup?: () => void;
    
    // Методы для настроек
    setHeaderColor?: (color: string) => void;
    setBackgroundColor?: (color: string) => void;
    enableClosingConfirmation?: () => void;
    disableClosingConfirmation?: () => void;
    
    // Cloud Storage
    CloudStorage?: {
      setItem?: (key: string, value: string, callback?: (error: Error | null, result?: boolean) => void) => void;
      getItem?: (key: string, callback?: (error: Error | null, result?: string) => void) => void;
      getItems?: (keys: string[], callback?: (error: Error | null, result?: Record<string, string>) => void) => void;
      removeItem?: (key: string, callback?: (error: Error | null, result?: boolean) => void) => void;
      removeItems?: (keys: string[], callback?: (error: Error | null, result?: boolean) => void) => void;
      getKeys?: (callback?: (error: Error | null, result?: string[]) => void) => void;
    };
  }
}

export {};