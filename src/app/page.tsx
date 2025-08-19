'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getActiveChart } from '../../lib/birth/storage';
import type { SavedChart } from '../../lib/birth/storage';
import NatalWheel, { type ChartData } from '@/components/natal/NatalWheel';

export default function HomePage() {
  const { firstName, photoUrl, userId } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);

  const birth = activeChart?.input;

  useEffect(() => {
    // Загружаем активную карту
    const savedChart = getActiveChart();
    setActiveChart(savedChart);
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      if (!birth) {
        setChart(null);
        return;
      }

      setLoading(true);
      
      try {
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

        const res = await fetch('/api/natal/compute', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ birth: birthData })
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const response = await res.json();
        
        if (!cancelled && response.success && response.data) {
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

          setChart({
            planets,
            houses,
            aspects
          });
        }
      } catch (error) {
        console.error('Error loading natal chart:', error);
        if (!cancelled) {
          setChart(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [birth]);

  const handleNatalChartClick = () => {
    hapticFeedback('impact', 'medium');
    window.location.href = '/natal';
  };

  return (
    <div className="page animate-fadeIn min-h-screen flex flex-col">
      {/* Шапка как на макете */}
      <header className="flex items-center justify-between mb-8">
        <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
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
            Привет,<br />{firstName || 'Друг'}!
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

        {/* Натальный круг или CTA */}
        {chart ? (
          <div className="mt-4 flex justify-center">
            <NatalWheel 
              data={chart} 
              size={320} 
              onSelect={(e) => {
                console.log('select', e);
                hapticFeedback('impact', 'light');
              }} 
            />
          </div>
        ) : birth ? (
          loading ? (
            <div className="mt-4 flex justify-center">
              <div className="w-80 h-80 border-2 border-dashed border-purple-200 rounded-full flex items-center justify-center bg-white/50 backdrop-blur">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Рассчитываем карту...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleNatalChartClick}
                className="rounded-2xl px-5 py-3 border border-white/15 bg-white/60 backdrop-blur hover:bg-white/80 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          )
        ) : (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => window.location.href = '/natal'}
              className="rounded-2xl px-5 py-3 border border-white/15 bg-white/60 backdrop-blur hover:bg-white/80 transition-colors"
            >
              Указать дату рождения
            </button>
          </div>
        )}

        {/* Кнопка натальной карты */}
        <div className="mt-8">
          <button
            onClick={handleNatalChartClick}
            className="w-full max-w-sm bg-gradient-to-r from-purple-400 to-pink-300 text-white py-4 rounded-3xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {activeChart ? 'Моя натальная карта' : 'Создать натальную карту'}
          </button>
        </div>
      </div>
    </div>
  );
}