'use client';

import React, { useState } from 'react';
import FunctionCard, { FunctionGrid } from '@/components/FunctionCard';
import { useTelegram } from '@/hooks/useTelegram';
import {
  CalendarDaysIcon,
  SparklesIcon,
  MoonIcon,
  StarIcon,
  SunIcon,
  GlobeAltIcon,
  BookOpenIcon,
  AcademicCapIcon,
  GiftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Данные для карты дня
const getDailyCard = () => {
  const moonSigns = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
  const colors = ['Розовый', 'Голубой', 'Зеленый', 'Фиолетовый', 'Желтый', 'Оранжевый', 'Бирюзовый', 'Красный'];
  const numbers = [3, 7, 9, 11, 13, 21, 33, 42];
  
  const today = new Date();
  const dayIndex = today.getDate() % 12;
  const colorIndex = today.getDate() % colors.length;
  const numberIndex = today.getDate() % numbers.length;
  
  return {
    moonSign: moonSigns[dayIndex],
    luckyNumber: numbers[numberIndex],
    luckyColor: colors[colorIndex],
    date: today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  };
};

export default function FunctionsPage() {
  const { hapticFeedback } = useTelegram();
  const [dailyCard] = useState(getDailyCard());

  return (
    <div className="page animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col" style={{ ['--page-top' as any]: 'calc(var(--safe-top) + 32px)' }}>
      {/* Заголовок */}
      <section className="mb-6 text-center">
        <h1 className="h1 mb-2">
          Функции
        </h1>
        <p className="p">
          Исследуйте мир астрологии и эзотерики
        </p>
      </section>

      {/* Карта дня */}
      <section className="mb-8">
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title">
              Карта дня
            </h2>
            <span className="chip text-xs">
              {dailyCard.date}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 glass-weak rounded-xl flex items-center justify-center">
                <MoonIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 font-medium">Луна в знаке</p>
                <p className="text-base font-semibold text-neutral-800">{dailyCard.moonSign}</p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass-weak rounded-xl flex items-center justify-center">
                  <StarIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600 font-medium">Число</p>
                  <p className="text-sm font-semibold text-neutral-800">{dailyCard.luckyNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass-weak rounded-xl flex items-center justify-center">
                  <SunIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600 font-medium">Цвет</p>
                  <p className="text-sm font-semibold text-neutral-800">{dailyCard.luckyColor}</p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              hapticFeedback('impact', 'light');
              window.location.href = '/horoscope';
            }}
            className="mt-4 w-full cta"
          >
            Посмотреть гороскоп дня →
          </button>
        </div>
      </section>

      {/* Основные функции */}
      <section className="mb-8">
        <h2 className="h2 mb-4">
          Популярные
        </h2>
        <FunctionGrid>
          <FunctionCard
            href="/natal"
            icon="/assets/deepsoul/zodiac.svg"
            title="Натальная карта"
            bgColor="bg-gradient-to-br from-purple-100 to-pink-100"
          />
          <FunctionCard
            href="/my-charts"
            icon={<ChartBarIcon className="w-7 h-7 text-purple-600" />}
            title="Мои карты"
            bgColor="bg-gradient-to-br from-purple-100 to-pink-100"
          />
          <FunctionCard
            href="/horoscope"
            icon="/assets/deepsoul/star.svg"
            title="Гороскоп"
            bgColor="bg-gradient-to-br from-blue-100 to-purple-100"
          />
          <FunctionCard
            href="/chat"
            icon="/assets/deepsoul/chat.svg"
            title="AI Астролог"
            bgColor="bg-gradient-to-br from-teal-100 to-blue-100"
          />
          <FunctionCard
            href="/compat"
            icon="/assets/deepsoul/hearts.svg"
            title="Совместимость"
            bgColor="bg-gradient-to-br from-pink-100 to-purple-100"
          />
          <FunctionCard
            href="/premium"
            icon="/assets/deepsoul/crown.svg"
            title="Премиум"
            bgColor="bg-gradient-to-br from-purple-100 to-orange-100"
          />
        </FunctionGrid>
      </section>

      {/* Дополнительные функции */}
      <section className="mb-8">
        <h2 className="h2 mb-4">
          Дополнительные
        </h2>
        <FunctionGrid>
          <FunctionCard
            href="/calendar"
            icon={<CalendarDaysIcon className="w-7 h-7 text-indigo-600" />}
            title="Лунный календарь"
            bgColor="bg-indigo-50"
          />
          <FunctionCard
            href="/transits"
            icon={<GlobeAltIcon className="w-7 h-7 text-emerald-600" />}
            title="Транзиты"
            bgColor="bg-emerald-50"
          />
          <FunctionCard
            href="/numerology"
            icon={<span className="text-xl">🔢</span>}
            title="Нумерология"
            bgColor="bg-amber-50"
          />
          <FunctionCard
            href="/dreams"
            icon={<MoonIcon className="w-7 h-7 text-indigo-600" />}
            title="Сонник"
            bgColor="bg-indigo-50"
          />
          <FunctionCard
            href="/meditation"
            icon={<SparklesIcon className="w-7 h-7 text-purple-600" />}
            title="Медитации"
            bgColor="bg-purple-50"
          />
          <FunctionCard
            href="/learn"
            icon={<AcademicCapIcon className="w-7 h-7 text-rose-600" />}
            title="Обучение"
            bgColor="bg-rose-50"
          />
        </FunctionGrid>
      </section>

      {/* Премиум блок */}
      <section className="mb-6">
        <div className="glass p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 text-lg">
                Премиум доступ
              </h3>
              <p className="text-sm text-neutral-600">
                Откройте полный доступ ко всем возможностям
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="glass-weak p-3 rounded-xl text-center">
              <GiftIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-neutral-700">Подарки</p>
            </div>
            <div className="glass-weak p-3 rounded-xl text-center">
              <BookOpenIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-neutral-700">База знаний</p>
            </div>
            <div className="glass-weak p-3 rounded-xl text-center">
              <StarIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-neutral-700">VIP поддержка</p>
            </div>
          </div>
          
          <button 
            onClick={() => hapticFeedback('impact', 'medium')}
            className="w-full cta"
          >
            Попробовать бесплатно
          </button>
        </div>
      </section>
    </div>
  );
}