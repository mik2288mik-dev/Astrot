'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTelegramUser } from '@/hooks/useTelegram';
import HoroscopeCard, { HoroscopeSkeleton } from '@/components/HoroscopeCard';
import { useRouter } from 'next/navigation';

interface HoroscopeData {
  general: string;
  love: string;
  career: string;
  health: string;
  lucky_numbers: number[];
  lucky_color: string;
  advice: string;
  energy_level: number;
  zodiac_sign: string;
  date: string;
}

export default function HoroscopePage() {
  const { userId } = useTelegramUser();
  const router = useRouter();
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!userId) {
        setError('Необходима авторизация через Telegram');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/horoscope?tgId=${userId}`);
        const data = await response.json();

        if (data.success) {
          setHoroscope(data.horoscope);
        } else {
          if (response.status === 404) {
            setError('Сначала создайте профиль в разделе "Натальная карта"');
          } else {
            setError(data.error || 'Ошибка загрузки гороскопа');
          }
        }
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        setError('Ошибка соединения. Попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoroscope();
  }, [userId]);

  const handleRetry = () => {
    if (userId) {
      setError(null);
      setIsLoading(true);
      // Перезагружаем компонент
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToProfile = () => {
    router.push('/chart');
  };

  if (error) {
    return (
      <div className="page-wrapper animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col">
        <div className="flex items-center mb-6">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors mr-3"
          >
            <ArrowLeftIcon className="w-6 h-6 text-neutral-700" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">Гороскоп дня</h1>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😔</span>
            </div>
            
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">
              Упс! Что-то пошло не так
            </h2>
            
            <p className="text-neutral-600 mb-6 text-sm">
              {error}
            </p>

            <div className="space-y-3">
              {error.includes('профиль') ? (
                <button
                  onClick={handleGoToProfile}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Создать профиль
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Попробовать снова
                </button>
              )}
              
              <button
                onClick={handleGoBack}
                className="w-full bg-neutral-100 text-neutral-700 font-semibold py-3 px-6 rounded-xl hover:bg-neutral-200 transition-all"
              >
                Назад
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center mb-6">
        <button
          onClick={handleGoBack}
          className="p-2 rounded-full hover:bg-neutral-100 transition-colors mr-3"
        >
          <ArrowLeftIcon className="w-6 h-6 text-neutral-700" />
        </button>
        <h1 className="text-xl font-bold text-neutral-900">Гороскоп дня</h1>
      </div>

      {isLoading ? (
        <HoroscopeSkeleton />
      ) : horoscope ? (
        <HoroscopeCard horoscope={horoscope} />
      ) : null}

      {/* Кнопка обновления */}
      {horoscope && !isLoading && (
        <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: '800ms' }}>
          <button
            onClick={handleRetry}
            className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
          >
            Обновить гороскоп
          </button>
        </div>
      )}
    </div>
  );
}