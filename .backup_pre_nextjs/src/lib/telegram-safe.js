// Safe wrappers for Telegram Mini App SDK
// This module provides safe versions of TMA SDK functions that won't crash the app

import React from 'react';
import { isTelegramWebApp } from './telegram-init';

// Safe wrapper for SDK initialization
export const safeSDKInit = () => {
  if (!isTelegramWebApp()) {
    return null;
  }

  try {
    // Try to import and initialize SDK only if in Telegram environment
    return import('@telegram-apps/sdk').then(sdk => {
      if (sdk && sdk.init) {
        return sdk.init();
      }
      return null;
    }).catch(error => {
      console.warn('Failed to initialize Telegram SDK:', error);
      return null;
    });
  } catch (error) {
    console.warn('Telegram SDK not available:', error);
    return null;
  }
};

// Safe hooks for React components
export const useSafeTelegramAuth = () => {
  const [user, setUser] = React.useState(null);
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!isTelegramWebApp()) {
      setIsLoading(false);
      setError('Not in Telegram environment');
      return;
    }

    setIsLoading(true);
    
    try {
      const webApp = window.Telegram.WebApp;
      if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
        setUser(webApp.initDataUnsafe.user);
        setIsAuthorized(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { user, isAuthorized, isLoading, error };
};

export const useSafeTelegram = () => {
  const showMainButton = (text, onClick) => {
    if (!isTelegramWebApp()) return;
    
    try {
      const mainButton = window.Telegram.WebApp.MainButton;
      mainButton.text = text;
      mainButton.show();
      mainButton.onClick(onClick);
    } catch (error) {
      console.warn('Failed to show main button:', error);
    }
  };

  const hapticFeedback = (type = 'impact') => {
    if (!isTelegramWebApp()) return;
    
    try {
      const haptic = window.Telegram.WebApp.HapticFeedback;
      if (type === 'impact') {
        haptic.impactOccurred('medium');
      } else if (type === 'notification') {
        haptic.notificationOccurred('success');
      } else if (type === 'selection') {
        haptic.selectionChanged();
      }
    } catch (error) {
      console.warn('Failed to trigger haptic feedback:', error);
    }
  };

  const showAlert = (message) => {
    if (!isTelegramWebApp()) {
      window.alert(message);
      return;
    }
    
    try {
      window.Telegram.WebApp.showAlert(message);
    } catch (error) {
      console.warn('Failed to show alert:', error);
      window.alert(message);
    }
  };

  return {
    showMainButton,
    hapticFeedback,
    showAlert,
    isInTelegram: isTelegramWebApp(),
  };
};