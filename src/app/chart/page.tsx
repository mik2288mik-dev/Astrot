'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTelegramUser } from '@/hooks/useTelegram';
import ProfileForm from '@/components/ProfileForm';
import InterpretationCards, { SkeletonCards } from '@/components/InterpretationCards';
import { useRouter } from 'next/navigation';

interface ProfileData {
  name: string;
  birthDate: string;
  birthTime: string;
  timeUnknown: boolean;
  location: {
    name: string;
    lat: number;
    lon: number;
    timezone: string;
    tzOffset: number;
  };
  houseSystem: 'P' | 'W';
}

interface InterpretationData {
  summary: string;
  personality: string;
  work_money: string;
  love_social: string;
  health_energy: string;
  today_focus: string;
  disclaimers: string[];
}

interface HoroscopeData {
  general: string;
  love: string;
  career: string;
  health: string;
  lucky_numbers: number[];
  lucky_color: string;
  advice: string;
  energy_level: number;
}

export default function ChartPage() {
  const { userId } = useTelegramUser();
  const router = useRouter();
  const [existingProfile, setExistingProfile] = useState<ProfileData | null>(null);
  const [interpretation, setInterpretation] = useState<InterpretationData | null>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setIsLoadingProfile(false);
        setShowForm(true);
        return;
      }

      try {
        const response = await fetch(`/api/profile?tgId=${userId}`);

        if (response.ok) {
          const data = await response.json();
          setExistingProfile(data.profile);

          // Автоматически загружаем интерпретацию для существующего профиля
          await loadInterpretationAndHoroscope(userId);
        } else {
          // Профиль не найден или произошла другая ошибка - показываем форму без сообщения об ошибке
          setShowForm(true);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setShowForm(true);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [userId]);

  const loadInterpretationAndHoroscope = async (tgId: number) => {
    try {
      setIsLoadingInterpretation(true);
      setError(null);

      // Параллельно вызываем все API
      const [chartResponse, horoscopeResponse] = await Promise.all([
        // Вычисляем карту
        fetch('/api/chart/calc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tgId })
        }),
        // Получаем гороскоп
        fetch(`/api/horoscope?tgId=${tgId}`)
      ]);

      if (!chartResponse.ok) {
        throw new Error('Ошибка вычисления карты');
      }

      const chartData = await chartResponse.json();
      
      if (!chartData.ok) {
        throw new Error(chartData.error || 'Ошибка вычисления карты');
      }

      // Получаем интерпретацию на основе карты
      const interpretResponse = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tgId,
          chart: chartData.chart
        })
      });

      if (!interpretResponse.ok) {
        throw new Error('Ошибка интерпретации карты');
      }

      const interpretData = await interpretResponse.json();

      if (interpretData.ok) {
        setInterpretation(interpretData.data);
      } else {
        throw new Error(interpretData.error || 'Ошибка интерпретации карты');
      }

      // Обрабатываем гороскоп
      if (horoscopeResponse.ok) {
        const horoscopeData = await horoscopeResponse.json();
        if (horoscopeData.success) {
          // Добавляем данные гороскопа в интерпретацию
          setHoroscope(horoscopeData.horoscope);
          // Обновляем today_focus данными из гороскопа
          if (interpretData.data && horoscopeData.horoscope) {
            setInterpretation(prev => prev ? {
              ...prev,
              today_focus: horoscopeData.horoscope.general || prev.today_focus
            } : null);
          }
        }
      }

    } catch (error) {
      console.error('Error loading interpretation:', error);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    } finally {
      setIsLoadingInterpretation(false);
    }
  };

  const handleProfileSubmit = async (profileData: { 
    name: string; 
    birthDate: string; 
    birthTime: string; 
    timeUnknown: boolean; 
    location: { name: string; lat: number; lon: number; timezone: string; tzOffset: number } | null; 
    houseSystem: 'P' | 'W'; 
    tgId: number 
  }) => {
    try {
      setIsSavingProfile(true);
      setError(null);
      if (!profileData.location) {
        throw new Error('Location is required');
      }

      // Сохраняем или обновляем профиль через API
      const method = existingProfile ? 'PUT' : 'POST';
      const response = await fetch('/api/profile', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          location: profileData.location
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка сохранения профиля');
      }

      const data = await response.json();
      setExistingProfile(data.profile);
      setShowForm(false);

      // Загружаем интерпретацию и гороскоп
      await loadInterpretationAndHoroscope(profileData.tgId);

    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error instanceof Error ? error.message : 'Ошибка сохранения профиля');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleEditProfile = () => {
    setShowForm(true);
    setInterpretation(null);
    setHoroscope(null);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoadingProfile) {
    return (
      <div className="page-wrapper animate-fadeIn">
        <div className="flex items-center mb-6 pt-safe">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors mr-3"
          >
            <ArrowLeftIcon className="w-6 h-6 text-neutral-700" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">Натальная карта</h1>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 animate-pulse">
            <div className="h-6 bg-neutral-200 rounded w-48 mx-auto mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-neutral-200 rounded"></div>
              <div className="h-12 bg-neutral-200 rounded"></div>
              <div className="h-12 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="flex items-center mb-6 pt-safe">
        <button
          onClick={handleGoBack}
          className="p-2 rounded-full hover:bg-neutral-100 transition-colors mr-3"
        >
          <ArrowLeftIcon className="w-6 h-6 text-neutral-700" />
        </button>
        <h1 className="text-xl font-bold text-neutral-900">Натальная карта</h1>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fadeIn">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 text-xs mt-2 underline"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showForm ? (
        <ProfileForm
          onSubmit={handleProfileSubmit}
          initialData={existingProfile ?? undefined}
          isLoading={isSavingProfile}
        />
      ) : existingProfile ? (
        <div className="space-y-6">
          {/* Профиль карточка */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">Ваши данные</h2>
                <button
                  onClick={handleEditProfile}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Изменить
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500 block">Имя</span>
                  <span className="font-medium text-neutral-900">{existingProfile.name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Дата рождения</span>
                  <span className="font-medium text-neutral-900">
                    {new Date(existingProfile.birthDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Время</span>
                  <span className="font-medium text-neutral-900">
                    {existingProfile.timeUnknown ? 'Неизвестно' : existingProfile.birthTime}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Место</span>
                  <span className="font-medium text-neutral-900">{existingProfile.location.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Интерпретация и результаты */}
          {isLoadingInterpretation ? (
            <SkeletonCards />
          ) : interpretation ? (
            <div className="max-w-md mx-auto">
              <InterpretationCards interpretation={interpretation} />
              
              {/* Дополнительная карточка с гороскопом если есть */}
              {horoscope && (
                <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Ваш гороскоп на сегодня
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-purple-700">Совет дня:</span>
                      <p className="text-neutral-700 mt-1">{horoscope.advice}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-purple-100">
                      <div>
                        <span className="text-xs text-neutral-500">Счастливые числа</span>
                        <div className="flex gap-2 mt-1">
                          {horoscope.lucky_numbers.map(num => (
                            <span key={num} className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full text-purple-600 font-semibold text-sm">
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-neutral-500">Цвет дня</span>
                        <div className="text-purple-600 font-medium">{horoscope.lucky_color}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <button
                onClick={() => loadInterpretationAndHoroscope(userId!)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Получить интерпретацию
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}