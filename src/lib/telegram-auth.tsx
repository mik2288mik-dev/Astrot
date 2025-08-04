'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
}

export interface TelegramAuthState {
  user: TelegramUser | null;
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  viewport: {
    height: number;
    width: number;
    is_expanded: boolean;
  };
  colorScheme: 'light' | 'dark';
  platform: 'ios' | 'android' | 'web' | 'macos' | 'tdesktop' | 'weba' | 'unigram' | 'unknown';
}

interface TelegramAuthContextType extends TelegramAuthState {
  refreshUser: () => void;
  logout: () => void;
}

const TelegramAuthContext = createContext<TelegramAuthContextType | undefined>(undefined);

export function useTelegramAuth() {
  const context = useContext(TelegramAuthContext);
  if (context === undefined) {
    throw new Error('useTelegramAuth must be used within a TelegramAuthProvider');
  }
  return context;
}

interface TelegramAuthProviderProps {
  children: ReactNode;
}

export function TelegramAuthProvider({ children }: TelegramAuthProviderProps) {
  const [state, setState] = useState<TelegramAuthState>({
    user: null,
    isAuthorized: false,
    isLoading: true,
    error: null,
    theme: 'light',
    viewport: {
      height: 0,
      width: 0,
      is_expanded: false,
    },
    colorScheme: 'light',
    platform: 'unknown',
  });

  useEffect(() => {
    const initializeTelegram = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const tg = window.Telegram?.WebApp;
        if (tg) {
          tg.ready();

          const webAppUser = tg.initDataUnsafe?.user;
          if (webAppUser) {
            setState(prev => ({
              ...prev,
              user: webAppUser,
              isAuthorized: true,
              isLoading: false,
              theme: tg.colorScheme === 'dark' ? 'dark' : 'light',
              colorScheme: tg.colorScheme === 'dark' ? 'dark' : 'light',
              platform: tg.platform as any,
              viewport: {
                height: tg.viewportHeight,
                width: tg.viewportWidth,
                is_expanded: tg.isExpanded,
              },
            }));
          } else {
            setState(prev => ({
              ...prev,
              isAuthorized: false,
              isLoading: false,
              error: 'Пользователь не авторизован в Telegram',
            }));
          }
        } else {
          setState(prev => ({
            ...prev,
            isAuthorized: false,
            isLoading: false,
            error: 'Telegram WebApp не доступен',
          }));
        }
      } catch (error) {
        console.error('Ошибка инициализации Telegram:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        }));
      }
    };

    initializeTelegram();
  }, []);

  const refreshUser = () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setState(prev => ({
          ...prev,
          user,
          isAuthorized: true,
          error: null,
        }));
      }
    }
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      user: null,
      isAuthorized: false,
    }));
  };

  const contextValue: TelegramAuthContextType = {
    ...state,
    refreshUser,
    logout,
  };

  return (
    <TelegramAuthContext.Provider value={contextValue}>
      {children}
    </TelegramAuthContext.Provider>
  );
}
