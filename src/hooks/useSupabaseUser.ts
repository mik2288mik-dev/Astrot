'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';

interface User {
  id: string;
  tgId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isPremium: boolean;
  photoUrl?: string;
}

interface Profile {
  id: string;
  userId: string;
  birthDate: string;
  birthTime?: string;
  timeUnknown: boolean;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  tzOffset: number;
  name?: string;
  gender?: string;
  email?: string;
  phone?: string;
  houseSystem: string;
}

export function useSupabaseUser() {
  const { user: telegramUser, initData } = useTelegram();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных пользователя
  useEffect(() => {
    if (!telegramUser) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/profile', {
          headers: {
            'X-Telegram-Init-Data': initData || '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
        setProfile(data.profile);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [telegramUser, initData]);

  // Функция обновления профиля
  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      setError(null);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData || '',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      return data.profile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  // Функция удаления профиля
  const deleteProfile = async () => {
    try {
      setError(null);

      const response = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'X-Telegram-Init-Data': initData || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      setProfile(null);
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    updateProfile,
    deleteProfile,
    refetch: () => {
      if (telegramUser) {
        setLoading(true);
        // Trigger re-fetch by changing a dependency
        setUser(null);
        setProfile(null);
      }
    },
  };
}