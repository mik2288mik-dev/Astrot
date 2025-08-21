'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTelegramUser } from '@/hooks/useTelegram';
import { getActiveChart } from '../../../lib/birth/storage';
import type { SavedChart } from '../../../lib/birth/storage';
import { 
  CalendarIcon, 
  SparklesIcon, 
  HeartIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  MoonIcon,
  ClockIcon,
  ShareIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface FriendlyHoroscope {
  dateISO: string;
  greeting: string;
  tldr: string[];
  keyTransits: Array<{
    title: string;
    description: string;
    advice: string;
  }>;
  sections: {
    love: string[];
    work: string[];
    health: string[];
    growth: string[];
  };
  moon: {
    tip: string;
  };
  timeline: Array<{
    part: 'morning' | 'day' | 'evening';
    icon: string;
    tips: string[];
  }>;
}

export default function HoroscopePage() {
  const { userId } = useTelegramUser();
  const searchParams = useSearchParams();
  const tgIdFromUrl = searchParams.get('tgId');
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);
  const [horoscope, setHoroscope] = useState<FriendlyHoroscope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugId, setDebugId] = useState<string | null>(null);

  const effectiveTgId = tgIdFromUrl || userId?.toString();

  useEffect(() => {
    const chart = getActiveChart();
    setActiveChart(chart);
  }, []);

  useEffect(() => {
    if (effectiveTgId || activeChart) {
      loadHoroscope();
    }
  }, [effectiveTgId, activeChart]);

  const loadHoroscope = async () => {
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
      
      // Сохраняем debug-id для отображения при ошибке
      const debugIdHeader = response.headers.get('x-debug-id');
      if (debugIdHeader) {
        setDebugId(debugIdHeader);
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка загрузки гороскопа');
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
    
    const text = `Мой гороскоп на ${formatDate(horoscope.dateISO)}:\n\n` +
      horoscope.tldr.join('\n') + '\n\n' +
      `💫 ${horoscope.moon.tip}`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Скопировано в буфер обмена!');
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

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'love': return <HeartIcon className="w-5 h-5" />;
      case 'work': return <BriefcaseIcon className="w-5 h-5" />;
      case 'health': return <SparklesIcon className="w-5 h-5" />;
      case 'growth': return <AcademicCapIcon className="w-5 h-5" />;
      default: return null;
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'love': return 'Любовь и отношения';
      case 'work': return 'Работа и карьера';
      case 'health': return 'Здоровье и энергия';
      case 'growth': return 'Личностный рост';
      default: return '';
    }
  };

  // Skeleton компонент
  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className || ''}`} />
  );

  // Показываем пустое состояние
  if (!effectiveTgId && !activeChart) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-2xl font-bold mb-4">Создайте профиль</h1>
          <p className="text-gray-600 mb-6">
            Чтобы получить персональный гороскоп, создайте профиль с датой рождения
          </p>
          <a href="/profile/form" className="btn btn-primary">
            Создать профиль
          </a>
        </div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-xl font-bold mb-2">Не удалось загрузить</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {debugId && (
            <p className="text-xs text-gray-400 mb-4">ID: {debugId}</p>
          )}
          <button onClick={loadHoroscope} className="btn btn-primary">
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {loading ? (
              <>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {horoscope?.greeting || 'Ваш гороскоп'}
                </h1>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {horoscope ? formatDate(horoscope.dateISO) : 'Сегодня'}
                </div>
              </>
            )}
          </div>
          {horoscope && (
            <button
              onClick={shareHoroscope}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              aria-label="Поделиться"
            >
              <ShareIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* TL;DR блок */}
        <div className="mb-6">
          {loading ? (
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="h-10 flex-1 rounded-full" />
            </div>
          ) : horoscope ? (
            <div className="flex flex-wrap gap-2">
              {horoscope.tldr.map((item, index) => (
                <div key={index} className="chip">
                  {item}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Главное сегодня */}
        {loading ? (
          <div className="mb-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </div>
        ) : horoscope?.keyTransits && horoscope.keyTransits.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Главное сегодня</h2>
            <div className="grid gap-4">
              {horoscope.keyTransits.map((transit, index) => (
                <div key={index} className="card">
                  <h3 className="font-medium mb-2">{transit.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{transit.description}</p>
                  <p className="text-sm text-blue-600">💡 {transit.advice}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Секции (2x2 сетка) */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        ) : horoscope ? (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {Object.entries(horoscope.sections).map(([key, items]) => (
              <div key={key} className="card">
                <div className="flex items-center mb-3">
                  {getSectionIcon(key)}
                  <h3 className="ml-2 font-medium">{getSectionTitle(key)}</h3>
                </div>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {/* Совет по луне */}
        {loading ? (
          <div className="mb-8">
            <Skeleton className="h-20 rounded-lg" />
          </div>
        ) : horoscope?.moon ? (
          <div className="card mb-8 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-start">
              <MoonIcon className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-2">Лунный совет</h3>
                <p className="text-gray-700">{horoscope.moon.tip}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        ) : horoscope?.timeline ? (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Распорядок дня
            </h2>
            <div className="space-y-3">
              {horoscope.timeline.map((period, index) => (
                <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="text-2xl mr-4">{period.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium capitalize mb-1">
                      {period.part === 'morning' ? 'Утро' : 
                       period.part === 'day' ? 'День' : 'Вечер'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {period.tips.join(' • ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Кнопка поделиться внизу */}
        {horoscope && (
          <div className="mt-8 text-center">
            <button
              onClick={shareHoroscope}
              className="btn btn-primary"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Поделиться гороскопом
            </button>
          </div>
        )}
      </div>
    </div>
  );
}