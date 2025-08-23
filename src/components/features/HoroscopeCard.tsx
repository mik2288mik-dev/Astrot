'use client';

import React from 'react';
import { 
  HeartIcon, 
  BriefcaseIcon, 
  SparklesIcon,
  SunIcon,
  LightBulbIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

interface HoroscopeData {
  general: string;
  love: string;
  career: string;
  health: string;
  lucky_numbers: number[];
  lucky_color: string;
  advice: string;
  energy_level: number;
  zodiac_sign: string;
  date: string;
}

interface HoroscopeCardProps {
  horoscope: HoroscopeData;
  isLoading?: boolean;
}

export default function HoroscopeCard({ horoscope, isLoading = false }: HoroscopeCardProps) {
  if (isLoading) {
    return <HoroscopeSkeleton />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getEnergyColor = (level: number) => {
    if (level >= 8) return 'text-green-600 bg-green-100';
    if (level >= 6) return 'text-yellow-600 bg-yellow-100';
    if (level >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getEnergyText = (level: number) => {
    if (level >= 8) return 'Высокий';
    if (level >= 6) return 'Средний';
    if (level >= 4) return 'Низкий';
    return 'Очень низкий';
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Заголовок */}
      <div className="text-center mb-6 animate-fadeIn">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Гороскоп для {horoscope.zodiac_sign}
        </h1>
        <p className="text-neutral-600 capitalize">
          {formatDate(horoscope.date)}
        </p>
      </div>

      {/* Общий прогноз */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white animate-fadeIn">
        <div className="flex items-center mb-4">
          <SparklesIcon className="w-6 h-6 mr-3" />
          <h2 className="text-lg font-semibold">Общий прогноз</h2>
        </div>
        <p className="text-sm leading-relaxed opacity-90">
          {horoscope.general}
        </p>
      </div>

      {/* Уровень энергии и счастливые элементы */}
      <div className="grid grid-cols-2 gap-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-neutral-100">
          <div className="flex items-center mb-2">
            <SunIcon className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="font-semibold text-sm text-neutral-900">Энергия</h3>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEnergyColor(horoscope.energy_level)}`}>
            {getEnergyText(horoscope.energy_level)} ({horoscope.energy_level}/10)
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-neutral-100">
          <div className="flex items-center mb-2">
            <SparklesIcon className="w-5 h-5 text-purple-500 mr-2" />
            <h3 className="font-semibold text-sm text-neutral-900">Цвет дня</h3>
          </div>
          <div className="text-sm font-medium text-neutral-700">
            {horoscope.lucky_color}
          </div>
        </div>
      </div>

      {/* Счастливые числа */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-neutral-100 animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center mb-3">
          <HashtagIcon className="w-5 h-5 text-indigo-500 mr-2" />
          <h3 className="font-semibold text-sm text-neutral-900">Счастливые числа</h3>
        </div>
        <div className="flex space-x-2">
          {horoscope.lucky_numbers.map((number, index) => (
            <div 
              key={index}
              className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            >
              {number}
            </div>
          ))}
        </div>
      </div>

      {/* Детальные прогнозы */}
      <div className="space-y-4">
        <HoroscopeSection
          title="Любовь"
          content={horoscope.love}
          icon={HeartIcon}
          gradient="from-pink-500 to-rose-500"
          delay={300}
        />
        
        <HoroscopeSection
          title="Карьера"
          content={horoscope.career}
          icon={BriefcaseIcon}
          gradient="from-green-500 to-emerald-500"
          delay={400}
        />
        
        <HoroscopeSection
          title="Здоровье"
          content={horoscope.health}
          icon={SunIcon}
          gradient="from-orange-500 to-yellow-500"
          delay={500}
        />
      </div>

      {/* Совет дня */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl p-6 text-white animate-fadeIn" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center mb-4">
          <LightBulbIcon className="w-6 h-6 mr-3" />
          <h2 className="text-lg font-semibold">Совет дня</h2>
        </div>
        <p className="text-sm leading-relaxed opacity-90">
          {horoscope.advice}
        </p>
      </div>
    </div>
  );
}

interface HoroscopeSectionProps {
  title: string;
  content: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
  delay: number;
}

function HoroscopeSection({ title, content, icon: Icon, gradient, delay }: HoroscopeSectionProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-10 mr-3`}>
            <Icon className={`w-5 h-5 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`} />
          </div>
          <h3 className="font-semibold text-neutral-900">{title}</h3>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}

function HoroscopeSkeleton() {
  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Заголовок */}
      <div className="text-center mb-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-48 mx-auto mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-32 mx-auto"></div>
      </div>

      {/* Общий прогноз */}
      <div className="bg-neutral-200 rounded-2xl p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 bg-neutral-300 rounded mr-3"></div>
          <div className="h-6 bg-neutral-300 rounded w-32"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-neutral-300 rounded w-full"></div>
          <div className="h-4 bg-neutral-300 rounded w-5/6"></div>
        </div>
      </div>

      {/* Карточки */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-lg animate-pulse">
          <div className="flex items-center mb-3">
            <div className="w-5 h-5 bg-neutral-200 rounded mr-2"></div>
            <div className="h-5 bg-neutral-200 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { HoroscopeSkeleton };