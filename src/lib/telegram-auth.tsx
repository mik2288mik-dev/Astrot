'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramAuthContextType {
  user: TelegramUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initTelegram: () => void;
  logout: () => void;
}

const TelegramAuthContext = createContext<TelegramAuthContextType | undefined>(undefined);

export const useTelegramAuth = () => {
  const context = useContext(TelegramAuthContext);
  if (context === undefined) {
    throw new Error('useTelegramAuth must be used within a TelegramAuthProvider');
  }
  return context;
};

interface TelegramAuthProviderProps {
  children: ReactNode;
}

export const TelegramAuthProvider: React.FC<TelegramAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initTelegram = () => {
    try {
      setIsLoading(true);
      setError(null);

      const tg = window.Telegram?.WebApp;
      if (!tg) {
        throw new Error('Telegram Web App не доступен');
      }

      // Инициализация Telegram Web App
      tg.ready();

      // Получение данных пользователя
      const userData = tg.initDataUnsafe?.user;
      if (!userData) {
        throw new Error('Данные пользователя не найдены');
      }

      // Создание объекта пользователя
      const telegramUser: TelegramUser = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        language_code: userData.language_code,
        is_premium: userData.is_premium,
        photo_url: userData.photo_url,
      };

      setUser(telegramUser);
      setIsAuthenticated(true);

      // Настройка темы приложения
      tg.expand();
      tg.enableClosingConfirmation();

      // Сохранение данных в localStorage для персистентности
      localStorage.setItem('telegram_user', JSON.stringify(telegramUser));
      localStorage.setItem('telegram_auth', 'true');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка инициализации Telegram');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('telegram_user');
    localStorage.removeItem('telegram_auth');
  };

  useEffect(() => {
    // Проверяем, есть ли сохраненные данные пользователя
    const savedUser = localStorage.getItem('telegram_user');
    const savedAuth = localStorage.getItem('telegram_auth');

    if (savedUser && savedAuth === 'true') {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('telegram_user');
        localStorage.removeItem('telegram_auth');
      }
    }

    // Инициализируем Telegram при загрузке
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      initTelegram();
    } else {
      // Если Telegram Web App еще не загружен, ждем
      const checkTelegram = () => {
        if (window.Telegram?.WebApp) {
          initTelegram();
        } else {
          setTimeout(checkTelegram, 100);
        }
      };
      checkTelegram();
    }
  }, []);

  const value: TelegramAuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    initTelegram,
    logout,
  };

  return (
    <TelegramAuthContext.Provider value={value}>
      {children}
    </TelegramAuthContext.Provider>
  );
};