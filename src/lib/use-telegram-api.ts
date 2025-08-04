'use client';

import { useState, useCallback } from 'react';
import { TelegramUser } from './telegram-auth';

export interface TelegramApiResponse<T> {
  ok: boolean;
  result: T;
  error_code?: number;
  description?: string;
}

export interface TelegramUserFull extends TelegramUser {
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
}

export const useTelegramApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMe = useCallback(async (): Promise<TelegramUserFull | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        throw new Error('Telegram Web App не доступен');
      }

      // Получаем базовые данные пользователя
      const userData = tg.initDataUnsafe?.user;
      if (!userData) {
        throw new Error('Данные пользователя не найдены');
      }

      // Здесь можно добавить вызов к вашему бэкенду для получения дополнительных данных
      // Например, если у вас есть бот с токеном, вы можете вызвать метод getMe
      
      const user: TelegramUserFull = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        language_code: userData.language_code,
        is_premium: userData.is_premium,
        photo_url: userData.photo_url,
      };

      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения данных пользователя';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendData = useCallback(async (data: string): Promise<boolean> => {
    try {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        throw new Error('Telegram Web App не доступен');
      }

      tg.sendData(data);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отправки данных';
      setError(errorMessage);
      return false;
    }
  }, []);

  const showAlert = useCallback((message: string): void => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.showAlert(message);
      }
    } catch (err) {
      console.error('Ошибка показа алерта:', err);
    }
  }, []);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const tg = window.Telegram?.WebApp;
        if (tg) {
          tg.showConfirm(message, (confirmed) => {
            resolve(confirmed);
          });
        } else {
          resolve(false);
        }
      } catch (err) {
        console.error('Ошибка показа подтверждения:', err);
        resolve(false);
      }
    });
  }, []);

  const openLink = useCallback((url: string, options?: { try_instant_view?: boolean }): void => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.openLink(url, options);
      }
    } catch (err) {
      console.error('Ошибка открытия ссылки:', err);
    }
  }, []);

  const requestContact = useCallback(async (): Promise<{
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
    vcard?: string;
  } | null> => {
    try {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        throw new Error('Telegram Web App не доступен');
      }

      return await tg.requestContact();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка запроса контакта';
      setError(errorMessage);
      return null;
    }
  }, []);

  const readClipboard = useCallback(async (): Promise<string | null> => {
    try {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        throw new Error('Telegram Web App не доступен');
      }

      return await tg.readTextFromClipboard();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка чтения буфера обмена';
      setError(errorMessage);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    getMe,
    sendData,
    showAlert,
    showConfirm,
    openLink,
    requestContact,
    readClipboard,
    isLoading,
    error,
    clearError,
  };
};