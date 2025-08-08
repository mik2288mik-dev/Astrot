import React, { useEffect, useState, useRef } from 'react';
import { mockTelegramWebApp, isTelegramWebApp, initTelegramSDK } from '../lib/telegram-init';

export default function TelegramWrapper({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    console.log('🎯 Запускаем инициализацию App');
    try {
      // Initialize mock Telegram WebApp for development
      if (!isTelegramWebApp()) {
        mockTelegramWebApp();
      }

      // Initialize Telegram SDK
      const result = initTelegramSDK();
      if (result) {
        console.log('Telegram WebApp initialized successfully');
        window.telegramInitialized = true;
        if (typeof result === 'function') {
          cleanupRef.current = result;
        }
      }

      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize Telegram wrapper:', err);
      setError(err);
      // Still set as initialized to prevent infinite loading
      setIsInitialized(true);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

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