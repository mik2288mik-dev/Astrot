'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getActiveChart } from '../../lib/birth/storage';
import type { SavedChart } from '../../lib/birth/storage';
import NatalWheel from '@/components/natal/NatalWheel';
import type { SelectedEntity } from '@/components/natal/NatalWheel';
import { useNatalChart } from '@/hooks/useNatalChart';

export default function HomePage() {
  const { firstName, photoUrl, userId } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);
  const { chartData, loading, calculateChart } = useNatalChart();
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);

  useEffect(() => {
    // Загружаем активную карту
    const chart = getActiveChart();
    setActiveChart(chart);
    
    // Если есть сохранённая карта, рассчитываем натальные данные
    if (chart?.input) {
      const date = new Date(chart.input.date);
      const [hours, minutes] = chart.input.time.split(':').map(Number);
      
      const birthData = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: hours || 12,
        minute: minutes || 0,
        lat: chart.input.place?.lat || 0,
        lon: chart.input.place?.lon || 0,
        tz: chart.input.place?.tz || 'UTC',
        place: chart.input.place?.displayName
      };
      
      calculateChart(birthData).catch(console.error);
    }
  }, [calculateChart]);

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

        {/* Кнопка натальной карты */}
        <button
          onClick={handleNatalChartClick}
          className="w-full max-w-sm bg-gradient-to-r from-purple-400 to-pink-300 text-white py-4 rounded-3xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {activeChart ? 'Моя натальная карта' : 'Создать натальную карту'}
        </button>
      </div>

      {/* Интерактивная натальная карта */}
      <div className="relative mb-20">
        <div className="flex justify-center">
          {loading ? (
            <div className="w-80 h-80 border-2 border-dashed border-purple-200 rounded-full flex items-center justify-center bg-white/50 backdrop-blur">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Рассчитываем карту...</p>
              </div>
            </div>
          ) : (
            <NatalWheel 
              chartData={chartData}
              onSelect={(entity) => {
                setSelectedEntity(entity);
                hapticFeedback('impact', 'light');
              }}
              className="w-80 h-80"
            />
          )}
        </div>
        
        {/* Краткая информация о выбранном элементе */}
        {selectedEntity && (
          <div className="mt-4 mx-4 p-3 bg-white/90 backdrop-blur rounded-lg border border-purple-100 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-1">{selectedEntity.name}</h4>
            <p className="text-sm text-gray-600">
              Нажмите для подробной интерпретации
            </p>
          </div>
        )}
      </div>
    </div>
  );
}