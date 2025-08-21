'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { getActiveChart } from '../../lib/birth/storage';
import type { SavedChart } from '../../lib/birth/storage';
import NatalWheel, { type ChartData } from '@/components/natal/NatalWheel';
import FriendlyCard from '@/components/friendly/FriendlyCard';

export default function HomePage() {
  const { firstName, photoUrl, userId } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);
  const [chart, setChart] = useState<ChartData | 'loading' | 'error' | null>(null);
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
    'Друг';

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

  const handleHoroscopeClick = () => {
    hapticFeedback('impact', 'light');
    // Передаем tgId в URL для автоподстановки профиля
    const url = userId ? `/horoscope?tgId=${userId}` : '/horoscope';
    window.location.href = url;
  };

  const openInsight = (e: any) => {
    console.log('select', e);
    hapticFeedback('impact', 'light');
  };

  return (
    <main className="safe-page">
      <div className="page-content animate-fade-in">
        {/* Приветственный блок */}
        <div className="text-center mb-8">
          {/* Аватар пользователя */}
          <div className="mb-6 animate-bounce-in">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={firstName || 'User'}
                width={100}
                height={100}
                unoptimized
                className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-lg mx-auto"
              />
            ) : (
              <div className="w-[100px] h-[100px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                <div className="text-3xl">✨</div>
              </div>
            )}
          </div>

          {/* Приветствие */}
          <div className="mb-2">
            <h1 className="heading-1 mb-2">
              Привет, {displayName}!
            </h1>
            <p className="body-text-large text-center">
              Ваш помощник на каждый день
            </p>
          </div>
        </div>

        {/* Блок натальной карты */}
        <div className="card mb-6 text-center animate-slide-up">
          <div className="mb-4">
            <h2 className="card-title">Натальная карта</h2>
            {activeChart?.input?.date ? (
              <p className="card-caption">
                {new Date(activeChart.input.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            ) : (
              <p className="card-caption">
                Создайте свою персональную карту
              </p>
            )}
          </div>

          {/* Колесо натальной карты */}
          <div className="flex justify-center mb-6">
            {chart && chart !== 'error' && chart !== 'loading' && typeof chart === 'object' ? (
              <div className="animate-fade-in">
                <NatalWheel data={chart} size={280} onSelect={(e) => openInsight(e)} />
              </div>
            ) : chart === 'loading' ? (
              <div className="w-[280px] h-[280px] rounded-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center animate-pulse">
                <div className="text-2xl">⏳</div>
              </div>
            ) : (
                          <Image
              src="/art/astrot-natal-wheel.svg" 
              alt="Astrot wheel"
              width={280} 
              height={280}
              className="rounded-full select-none animate-fade-in" 
              draggable={false}
              priority
            />
            )}
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <button
              onClick={handleNatalChartClick}
              className="btn-secondary flex-1"
              aria-label={activeChart ? 'Открыть натальную карту' : 'Создать натальную карту'}
            >
              {activeChart ? 'Открыть карту' : 'Построить карту'}
            </button>
            <button
              onClick={handleHoroscopeClick}
              className="btn-primary flex-1"
              aria-label="Перейти к гороскопу дня"
            >
              Гороскоп
            </button>
          </div>
        </div>

        {/* Блок советов дня */}
        <FriendlyCard tgId={userId?.toString()} className="mb-6" />

        {/* Дополнительная информация */}
        {userId && (
          <div className="text-center">
            <p className="caption">
              ID: {userId}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}