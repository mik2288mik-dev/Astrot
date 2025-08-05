import React, { useEffect, useState } from 'react';
import { mockTelegramWebApp, isTelegramWebApp, initTelegramSDK, forceExpand } from '../lib/telegram-init';

export default function TelegramWrapper({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    try {
      // Initialize mock Telegram WebApp for development
      if (!isTelegramWebApp()) {
        mockTelegramWebApp();
      }
      
      // Initialize Telegram SDK
      const app = initTelegramSDK();
      setWebApp(app);
      
      if (app) {
        console.log('Telegram WebApp initialized successfully');
        
        // Force expand after a delay to ensure proper initialization
        setTimeout(() => {
          forceExpand();
        }, 500);
      }
      
      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize Telegram wrapper:', err);
      setError(err);
      // Still set as initialized to prevent infinite loading
      setIsInitialized(true);
    }
  }, []);

  // Additional effect to handle fullscreen expansion
  useEffect(() => {
    if (webApp && isTelegramWebApp()) {
      // Try to expand again after component mount
      const expandTimer = setTimeout(() => {
        forceExpand();
      }, 1000);

      // Also try on window focus (when user returns to app)
      const handleFocus = () => {
        setTimeout(() => {
          forceExpand();
        }, 100);
      };

      window.addEventListener('focus', handleFocus);
      
      return () => {
        clearTimeout(expandTimer);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [webApp]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="cosmic-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">*</div>
          <div className="text-cyan-100 text-lg">Инициализация космоса...</div>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="cosmic-bg min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-6xl mb-4">:(</div>
          <div className="text-red-300 text-lg mb-2">Космическая ошибка!</div>
          <div className="text-red-200 text-sm">
            Попробуйте перезагрузить страницу
          </div>
        </div>
      </div>
    );
  }

  return children;
}