'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getActiveChart } from '../../lib/birth/storage';
import type { SavedChart } from '../../lib/birth/storage';
import NatalWheel, { type ChartData } from '@/components/natal/NatalWheel';

export default function HomePage() {
  const { firstName, photoUrl, userId } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const pathname = usePathname();
  const showBack = pathname !== '/';
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);
  const [chart, setChart] = useState<ChartData | 'loading' | 'error' | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Загружаем профиль для получения предпочитаемого имени
  useEffect(() => {
    if (userId) {
      loadProfile();
    }
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

  const birth = activeChart?.input;
  
  // Определяем имя для отображения
  const tg = (typeof window !== 'undefined') ? (window as any).Telegram?.WebApp?.initDataUnsafe?.user : null;
  const displayName = profile?.preferredName || 
    [tg?.first_name, tg?.last_name].filter(Boolean).join(' ') || 
    firstName || 
    'Гость';

  useEffect(() => {
    // Загружаем активную карту
    const savedChart = getActiveChart();
    setActiveChart(savedChart);
  }, []);

  useEffect(() => {
    if (!birth) { 
      setChart(null); 
      return; 
    }
    
    let stop = false;
    
    (async () => {
      try {
        setChart('loading');
        
        // Преобразуем данные рождения в формат API
        const date = new Date(birth.date);
        const [hours, minutes] = birth.time.split(':').map(Number);
        
        const birthData = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          hour: hours || 12,
          minute: minutes || 0,
          lat: birth.place?.lat || 0,
          lon: birth.place?.lon || 0,
          tz: birth.place?.tz || 'UTC',
          place: birth.place?.displayName
        };

        const r = await fetch('/api/natal/compute', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ birth: birthData })
        });

        if (!r.ok) throw 0;
        
        const response = await r.json();
        
        if (!stop && response.success && response.data) {
          // Преобразуем данные из API в формат компонента NatalWheel
          const apiData = response.data;
          
          const planets = apiData.planets.map((planet: { name: string; lon: number; speed?: number }) => ({
            id: planet.name,
            lon: planet.lon,
            speed: planet.speed
          }));

          const houses = apiData.houses.cusps.map((cusp: { degree: number }, index: number) => ({
            index: index + 1,
            lon: cusp.degree
          }));

          // Преобразуем аспекты
          const aspects = apiData.aspects.map((aspect: { planet1: string; planet2: string; type: string; orb: number }) => ({
            a: aspect.planet1,
            b: aspect.planet2,
            type: aspect.type,
            orb: aspect.orb
          }));

          const d = {
            planets,
            houses,
            aspects
          };
          
          if (!stop) setChart(d);
        }
      } catch { 
        if (!stop) setChart('error'); 
      }
    })();
    
    return () => { stop = true; };
  }, [birth]);

  const handleNatalChartClick = () => {
    hapticFeedback('impact', 'medium');
    window.location.href = '/natal';
  };

  const openInsight = (e: any) => {
    console.log('select', e);
    hapticFeedback('impact', 'light');
  };

  return (
    <main className="safe-page px-4 pb-20">
      <div className="page animate-fadeIn min-h-screen flex flex-col">
        {/* Шапка как на макете */}
        <header className="flex items-center justify-between mb-8">
          {showBack && (
            <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-accent-1"></div>
        </div>
      </header>

      {/* Основное содержимое */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Аватар пользователя */}
        <div className="mb-8">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={firstName || 'User'}
              width={120}
              height={120}
              unoptimized
              className="w-[120px] h-[120px] rounded-full border-4 border-white shadow-lg mx-auto"
            />
          ) : (
            <div className="w-[120px] h-[120px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg mx-auto">
              <div className="text-4xl">🥰</div>
            </div>
          )}
        </div>

        {/* Приветствие */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
            Привет,<br />{displayName}!
          </h1>
          {activeChart?.input?.date ? (
            <p className="text-gray-600 text-lg">
              {new Date(activeChart.input.date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </p>
          ) : (
            <button
              onClick={() => window.location.href = '/natal'}
              className="text-purple-600 text-lg underline hover:text-purple-700 transition-colors"
            >
              Указать дату рождения
            </button>
          )}
          {userId && (
            <p className="text-gray-400 text-sm mt-2">
              ID: {userId}
            </p>
          )}
        </div>

        {/* Всегда показываем колесо */}
        <div className="mt-6 flex justify-center">
          {chart && chart !== 'error' && chart !== 'loading' && typeof chart === 'object' ? (
            <NatalWheel data={chart} size={320} onSelect={(e) => openInsight(e)} />
          ) : (
            <img
              src="/art/astrot-wheel-classic.svg" 
              alt="Astrot wheel"
              width={320} 
              height={320}
              className="rounded-full select-none" 
              draggable={false}
            />
          )}
        </div>

        {/* Кнопка гороскопа */}
        <div className="mt-6">
          <a href="/horoscope" className="btn-primary w-full block text-center">
            Гороскоп дня
          </a>
        </div>

        {/* Кнопка натальной карты */}
        <div className="mt-4">
          <button
            onClick={handleNatalChartClick}
            className="btn-secondary w-full max-w-sm py-4 text-lg"
          >
            {activeChart ? 'Моя натальная карта' : 'Создать натальную карту'}
          </button>
        </div>
      </div>
      </div>
    </main>
  );
}