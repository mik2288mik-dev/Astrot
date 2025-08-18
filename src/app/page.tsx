'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import BirthHeader from '@/components/birth/BirthHeader';
import { getActiveChart } from '../../lib/birth/storage';
import type { SavedChart } from '../../lib/birth/storage';

export default function HomePage() {
  const { firstName, photoUrl } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const [greeting, setGreeting] = useState('');
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) setGreeting('Доброй ночи');
    else if (hour < 12) setGreeting('Доброе утро');
    else if (hour < 18) setGreeting('Добрый день');
    else setGreeting('Добрый вечер');
    
    // Загружаем активную карту
    setActiveChart(getActiveChart());
  }, []);

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
              alt={firstName || 'Emily'}
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

        {/* Приветствие как на макете */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
            Welcome,<br />Emily
          </h1>
          <p className="text-gray-600 text-lg">
            June 12, 1994
          </p>
        </div>

        {/* Кнопка View Details */}
        <button
          onClick={handleNatalChartClick}
          className="w-full max-w-sm bg-gradient-to-r from-purple-400 to-pink-300 text-white py-4 rounded-3xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          View Details
        </button>
      </div>

      {/* Астрологическая карта */}
      <div className="relative mb-20">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-80 h-80 relative">
            {/* Основной круг */}
            <div className="w-full h-full border-2 border-purple-200 rounded-full bg-white/50 backdrop-blur">
              {/* Зодиакальные знаки */}
              <div className="absolute inset-2 border border-purple-100 rounded-full">
                {/* Линии аспектов */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                  <line x1="150" y1="50" x2="150" y2="250" stroke="#E5E7EB" strokeWidth="1" />
                  <line x1="50" y1="150" x2="250" y2="150" stroke="#E5E7EB" strokeWidth="1" />
                  <line x1="85" y1="85" x2="215" y2="215" stroke="#E5E7EB" strokeWidth="1" />
                  <line x1="215" y1="85" x2="85" y2="215" stroke="#E5E7EB" strokeWidth="1" />
                  
                  {/* Планеты */}
                  <circle cx="150" cy="80" r="4" fill="#FCD34D" />
                  <circle cx="120" cy="100" r="3" fill="#F87171" />
                  <circle cx="180" cy="120" r="3" fill="#60A5FA" />
                  <circle cx="200" cy="180" r="4" fill="#A78BFA" />
                  <circle cx="100" cy="200" r="3" fill="#34D399" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}