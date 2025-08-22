'use client';

import React, { useEffect, useState } from 'react';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { getActiveChart } from '../../lib/birth/storage';
import type { SavedChart } from '../../lib/birth/storage';
import CartoonNatalWheel from '@/components/natal/CartoonNatalWheel';
import type { ChartData } from '@/components/natal/NatalWheel';
import { designClasses } from '@/styles/design-tokens';

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
      hapticFeedback('impact', 'light');
    }
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] via-[#FFE5ED] to-[#FFE0EC] pb-28">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Приветствие */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-semibold text-[32px] text-[#2C2C2C] mb-2">
            Привет, {displayName}!
          </h1>
          <p className="text-[16px] text-[#666666]">
            Добро пожаловать в мир магии звёзд
          </p>
        </div>

        {/* Натальная карта */}
        <div className="rounded-[24px] shadow-md bg-white p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={designClasses.heading}>
              Натальная карта
            </h2>
            {birth && (
              <span className="text-[14px] text-[#666666] bg-gradient-to-r from-[#FFE0EC] to-[#E8D5FF] px-3 py-1 rounded-[12px]">
                {new Date(birth.date).toLocaleDateString('ru-RU')}
              </span>
            )}
          </div>
          
          <div className="h-[280px] bg-gradient-to-br from-[#E8D5FF] to-[#D6ECFF] rounded-[16px] flex items-center justify-center mb-6">
            {chart === 'loading' ? (
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#B3CFFF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-[14px] text-[#666666]">Загружаем магию...</p>
              </div>
            ) : chart === 'error' ? (
              <div className="text-center">
                <p className="text-[16px] text-[#666666] mb-4">Упс! Что-то пошло не так</p>
                <button 
                  onClick={loadChart} 
                  className="px-6 py-2 bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] text-white rounded-[16px] font-semibold text-[14px]"
                >
                  Попробовать снова
                </button>
              </div>
            ) : chart ? (
              <div className="relative p-5">
                <CartoonNatalWheel 
                  data={chart} 
                  size={240}
                  onPlanetClick={(planet) => {
                    console.log('Выбрана планета:', planet);
                  }}
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-[16px] text-[#666666] mb-2">Карта ещё не построена</p>
                <p className="text-[14px] text-[#999999]">Давайте откроем тайны звёзд!</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleNavigate(birth ? '/chart' : '/natal')}
              className="flex-1 bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] text-white rounded-[16px] py-3 font-semibold text-[14px] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>{birth ? 'Открыть карту' : 'Построить карту'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </button>
            <button
              onClick={() => handleNavigate('/horoscope')}
              className="flex-1 bg-white border border-gray-200 text-[#2C2C2C] rounded-[16px] py-3 font-semibold text-[14px] shadow-sm hover:shadow-md transition-all duration-300"
            >
              Гороскоп
            </button>
          </div>
        </div>

        {/* Совет дня */}
        {dailyTip && (
          <div className="rounded-[24px] bg-gradient-to-r from-[#FFF9D6] to-[#FFE5D6] p-5 mb-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-[24px]">💫</div>
              <div className="flex-1">
                <h3 className="font-semibold text-[16px] text-[#2C2C2C] mb-1">Совет дня</h3>
                <p className="text-[14px] leading-tight text-[#666666]">{dailyTip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Быстрые действия */}
        <div>
          <h2 className="font-semibold text-[20px] text-[#2C2C2C] mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleNavigate('/profile')}
              className="rounded-[24px] bg-white p-5 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="text-[32px] mb-3">👤</div>
              <div className="font-semibold text-[16px] text-[#2C2C2C] mb-1">Профиль</div>
              <div className="text-[14px] text-[#666666] leading-tight">Ваши данные</div>
            </button>
            
            <button
              onClick={() => handleNavigate('/functions')}
              className="rounded-[24px] bg-white p-5 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="text-[32px] mb-3">🎯</div>
              <div className="font-semibold text-[16px] text-[#2C2C2C] mb-1">Функции</div>
              <div className="text-[14px] text-[#666666] leading-tight">Все возможности</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}