'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { StarIcon, SparklesIcon } from '@heroicons/react/24/outline';
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
    <div className="page animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col">
      {/* Блок персонализации пользователя */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4">
        {/* Аватар пользователя */}
        <div className="mb-6">
          {photoUrl ? (
            <div className="relative">
              <Image
                src={photoUrl}
                alt={firstName}
                width={96}
                height={96}
                unoptimized
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                <StarIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg mx-auto">
              <StarIcon className="w-8 h-8 text-purple-600" />
            </div>
          )}
        </div>

        {/* Приветствие */}
        <div className="mb-8">
          <h1 className="h1 mb-2">
            {greeting}, {firstName}!
          </h1>
          <p className="p max-w-sm mx-auto">
            Откройте тайны звёзд и узнайте больше о себе
          </p>
        </div>

        {/* Активная карта или основная кнопка */}
        <div className="w-full max-w-sm">
          {activeChart ? (
            <div className="space-y-4">
              <div className="glass p-4 text-center">
                <h2 className="card-title mb-3">
                  Моя карта
                </h2>
                <BirthHeader 
                  birth={activeChart.input} 
                  showEdit={true}
                  onEdit={() => {
                    hapticFeedback('impact', 'light');
                    window.location.href = '/natal';
                  }}
                />
              </div>
              
              <button
                onClick={() => {
                  hapticFeedback('impact', 'medium');
                  // Переход к результатам карты или детальному просмотру
                  window.location.href = '/natal';
                }}
                className="w-full cta"
              >
                <StarIcon className="w-5 h-5" />
                <span className="text-sm">Посмотреть карту</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleNatalChartClick}
                className="w-full cta"
              >
                <SparklesIcon className="w-6 h-6" />
                <span className="text-base">Рассчитать натальную карту</span>
              </button>
              
              <p className="p mt-3 px-4" style={{fontSize:'var(--fz-small)'}}>
                Персональный астрологический анализ на основе даты, времени и места рождения
              </p>
            </>
          )}
        </div>
      </section>

      {/* Дополнительная информация */}
      <section className="mt-8 mb-4">
        <div className="glass-weak p-4">
          <div className="flex items-center justify-center gap-2 text-purple-700">
            <StarIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              Исследуйте все возможности в разделе &quot;Функции&quot;
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}