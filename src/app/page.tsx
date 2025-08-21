'use client';

import React, { useEffect, useState } from 'react';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { getActiveChart } from '../../lib/birth/storage';
import type { SavedChart } from '../../lib/birth/storage';
import NatalWheel, { type ChartData } from '@/components/natal/NatalWheel';
import { 
  ChartBarIcon, 
  SparklesIcon,
  UserCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { firstName, userId } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);
  const [chart, setChart] = useState<ChartData | 'loading' | 'error' | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dailyTip, setDailyTip] = useState<string>('');

  // Загружаем профиль для получения предпочитаемого имени
  useEffect(() => {
    if (userId) {
      loadProfile();
    }
    loadDailyTip();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const res = await fetch(`/api/profile?tgId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadDailyTip = async () => {
    try {
      const res = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tgId: userId?.toString() })
      });
      if (res.ok) {
        const data = await res.json();
        // Берём первый элемент из tldr или используем дефолт
        if (data.tldr && Array.isArray(data.tldr)) {
          setDailyTip(data.tldr[0] || 'Сегодня отличный день для новых начинаний!');
        } else {
          setDailyTip('Доверьтесь своей интуиции сегодня');
        }
      }
    } catch (error) {
      setDailyTip('Звёзды благоволят вам сегодня');
    }
  };

  const birth = activeChart?.input;
  
  // Определяем имя для отображения
  const tg = (typeof window !== 'undefined') ? (window as any).Telegram?.WebApp?.initDataUnsafe?.user : null;
  const displayName = profile?.preferredName || 
    [tg?.first_name, tg?.last_name].filter(Boolean).join(' ') || 
    firstName || 
    'друг';

  useEffect(() => {
    // Загружаем активную карту
    const savedChart = getActiveChart();
    setActiveChart(savedChart);
  }, []);

  useEffect(() => {
    if (birth) {
      setChart('loading');
      loadChart();
    }
  }, [birth]);

  const loadChart = async () => {
    if (!birth) {
      setChart(null);
      return;
    }

    try {
      const response = await fetch('/api/chart/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birth })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate chart');
      }

      const data = await response.json();
      setChart(data);
    } catch (error) {
      console.error('Error loading chart:', error);
      setChart('error');
    }
  };

  const handleNavigate = (path: string) => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container py-8 pb-24">
        {/* Приветствие */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Привет, {displayName}! 👋
          </h1>
          <p className="text-gray-600">
            Добро пожаловать в мир астрологии
          </p>
        </div>

        {/* Натальная карта */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Натальная карта</h2>
            {birth && (
              <span className="text-sm text-gray-500">
                {new Date(birth.date).toLocaleDateString('ru-RU')}
              </span>
            )}
          </div>
          
          <div className="relative h-64 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4">
            {chart === 'loading' ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            ) : chart === 'error' ? (
              <div className="text-center">
                <p className="text-gray-500 mb-2">Ошибка загрузки карты</p>
                <button onClick={loadChart} className="text-blue-600 hover:underline">
                  Попробовать снова
                </button>
              </div>
            ) : chart ? (
              <div className="w-full h-full p-4">
                <NatalWheel 
                  chartData={chart} 
                  width={240} 
                  height={240}
                  showAspects={false}
                  showHouses={false}
                />
              </div>
            ) : (
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Карта не построена</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleNavigate(birth ? '/chart' : '/natal')}
              className="btn btn-primary flex-1"
            >
              {birth ? 'Открыть карту' : 'Построить карту'}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => handleNavigate('/horoscope')}
              className="btn btn-secondary flex-1"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Гороскоп
            </button>
          </div>
        </div>

        {/* Совет дня */}
        {dailyTip && (
          <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400">
            <div className="flex items-start">
              <span className="text-2xl mr-3">💫</span>
              <div>
                <h3 className="font-semibold mb-1">Совет дня</h3>
                <p className="text-gray-700">{dailyTip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Быстрые действия */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleNavigate('/profile')}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <UserCircleIcon className="w-6 h-6 text-purple-600 mb-2" />
              <div className="font-medium">Профиль</div>
              <div className="text-xs text-gray-500">Ваши данные</div>
            </button>
            
            <button
              onClick={() => handleNavigate('/functions')}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <SparklesIcon className="w-6 h-6 text-blue-600 mb-2" />
              <div className="font-medium">Функции</div>
              <div className="text-xs text-gray-500">Все возможности</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}