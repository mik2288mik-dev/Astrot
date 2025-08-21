'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTelegramUser } from '@/hooks/useTelegram';
import { getActiveChart } from '../../../lib/birth/storage';
import type { SavedChart } from '../../../lib/birth/storage';
import type { FullHoroscope } from '@/lib/horoscope/types';
import { 
  CalendarIcon, 
  SparklesIcon, 
  HeartIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  MoonIcon,
  ClockIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

export default function HoroscopePage() {
  const { userId } = useTelegramUser();
  const searchParams = useSearchParams();
  const tgIdFromUrl = searchParams.get('tgId');
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);
  const [horoscope, setHoroscope] = useState<FullHoroscope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Используем tgId из URL или из Telegram
  const effectiveTgId = tgIdFromUrl || userId?.toString();

  useEffect(() => {
    const chart = getActiveChart();
    setActiveChart(chart);
  }, []);

  useEffect(() => {
    if (effectiveTgId) {
      loadHoroscope();
    }
  }, [effectiveTgId]);

  const loadHoroscope = async () => {
    if (!effectiveTgId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/horoscope/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth: activeChart?.input,
          tgId: effectiveTgId,
          userId: effectiveTgId
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки гороскопа');
      }
      
      const data = await response.json();
      setHoroscope(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const shareHoroscope = () => {
    if (!horoscope) return;
    
    const text = `Мой гороскоп на ${horoscope.dateISO}:\n\n` +
      `🌟 Настроение: ${horoscope.tldr.mood}\n` +
      `⚡ Энергия: ${horoscope.tldr.energy}\n` +
      `🎯 Фокус: ${horoscope.tldr.focus}\n` +
      `🍀 Счастливое число: ${horoscope.tldr.lucky.number}`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Показываем состояние загрузки или ошибки только если нет tgId
  if (!effectiveTgId) {
    return (
      <div className="safe-page">
        <div className="page-content animate-fade-in text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🔮</div>
            <h1 className="heading-1 mb-4">Гороскоп</h1>
            <p className="body-text mb-6">
              Для просмотра персонального гороскопа необходимо создать профиль
            </p>
            <a href="/profile" className="btn-primary">
              Создать профиль
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Гороскоп дня
            </h1>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {horoscope ? formatDate(horoscope.dateISO) : 'Загрузка...'}
            </div>
          </div>
          {horoscope && (
            <button
              onClick={shareHoroscope}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ShareIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Составляем ваш гороскоп...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
            <button 
              onClick={loadHoroscope}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {horoscope && (
          <div className="space-y-6">
            {/* TL;DR Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <SparklesIcon className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Сводка дня</h2>
                <div className={`ml-auto text-2xl font-bold ${getScoreColor(horoscope.score)}`}>
                  {horoscope.score}/100
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Настроение</div>
                  <div className="font-semibold text-gray-900">{horoscope.tldr.mood}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Энергия</div>
                  <div className="font-semibold text-gray-900">{horoscope.tldr.energy}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Фокус</div>
                  <div className="font-semibold text-gray-900">{horoscope.tldr.focus}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Счастливое число</div>
                  <div className="font-semibold text-gray-900">{horoscope.tldr.lucky.number}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: horoscope.tldr.lucky.color }}
                ></div>
                <span className="text-sm text-gray-600">Ваш цвет дня</span>
              </div>
            </div>

            {/* Key Transits */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ключевые влияния
              </h2>
              <div className="space-y-4">
                {horoscope.keyTransits.map((transit, index) => (
                  <div key={index} className="border-l-4 border-purple-300 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {transit.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{transit.why}</p>
                    <p className="text-purple-700 text-sm font-medium">
                      💡 {transit.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Love */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <HeartIcon className="w-5 h-5 text-pink-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Любовь</h3>
                </div>
                <ul className="space-y-2">
                  {horoscope.sections.love.map((tip, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Work */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <BriefcaseIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Работа</h3>
                </div>
                <ul className="space-y-2">
                  {horoscope.sections.work.map((tip, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Health */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <HeartIcon className="w-5 h-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Здоровье</h3>
                </div>
                <ul className="space-y-2">
                  {horoscope.sections.health.map((tip, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <AcademicCapIcon className="w-5 h-5 text-purple-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Развитие</h3>
                </div>
                <ul className="space-y-2">
                  {horoscope.sections.growth.map((tip, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Moon Info */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <MoonIcon className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Луна сегодня</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Знак</div>
                  <div className="font-semibold text-gray-900">{horoscope.moon.sign}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Фаза</div>
                  <div className="font-semibold text-gray-900">{horoscope.moon.phase}</div>
                </div>
                {horoscope.moon.house && (
                  <div>
                    <div className="text-sm text-gray-600">Дом</div>
                    <div className="font-semibold text-gray-900">{horoscope.moon.house}</div>
                  </div>
                )}
              </div>
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <div className="text-sm text-indigo-700 font-medium">
                  💫 {horoscope.moon.tip}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <ClockIcon className="w-6 h-6 text-orange-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Лента дня</h2>
              </div>
              <div className="space-y-4">
                {horoscope.timeline.map((period, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-sm font-semibold text-gray-900 capitalize">
                        {period.part === 'morning' ? 'Утро' : 
                         period.part === 'day' ? 'День' : 'Вечер'}
                      </div>
                      <div className={`text-xs font-bold ${getScoreColor(period.score)}`}>
                        {period.score}/100
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <ul className="space-y-1">
                        {period.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-gray-700 text-sm flex items-start">
                            <span className="text-orange-400 mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}