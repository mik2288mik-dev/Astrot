'use client';

import React from 'react';
import FunctionCard, { FunctionGrid } from '@/components/FunctionCard';
import { useTelegram } from '@/hooks/useTelegram';
import { 
  MapIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  SparklesIcon,
  MoonIcon,
  StarIcon,
  GlobeAltIcon,
  BookOpenIcon,
  AcademicCapIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

export default function FunctionsPage() {
  const { hapticFeedback } = useTelegram();

  return (
    <div className="page-wrapper animate-fadeIn">
      {/* Заголовок */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Все функции
        </h1>
        <p className="text-sm text-neutral-500">
          Исследуйте мир астрологии и эзотерики
        </p>
      </section>

      {/* Основные функции */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Популярные
        </h2>
        <FunctionGrid>
          <FunctionCard
            href="/chart"
            icon={<MapIcon className="w-7 h-7" />}
            title="Натальная карта"
            bgColor="bg-pastel-purple"
            iconColor="text-primary-600"
          />
          <FunctionCard
            href="/horoscope"
            icon="♈"
            title="Гороскоп"
            bgColor="bg-pastel-blue"
            iconColor="text-secondary-600"
          />
          <FunctionCard
            href="/chat"
            icon={<ChatBubbleLeftRightIcon className="w-7 h-7" />}
            title="AI Астролог"
            bgColor="bg-pastel-mint"
            iconColor="text-emerald-600"
          />
          <FunctionCard
            href="/tarot"
            icon="🎴"
            title="Таро"
            bgColor="bg-pastel-peach"
            iconColor="text-orange-600"
          />
          <FunctionCard
            href="/compat"
            icon={<HeartIcon className="w-7 h-7" />}
            title="Совместимость"
            bgColor="bg-pastel-pink"
            iconColor="text-pink-600"
          />
          <FunctionCard
            href="/shop"
            icon={<ShoppingBagIcon className="w-7 h-7" />}
            title="Магазин"
            bgColor="bg-pastel-lavender"
            iconColor="text-purple-600"
          />
        </FunctionGrid>
      </section>

      {/* Дополнительные функции */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Дополнительно
        </h2>
        <FunctionGrid>
          <FunctionCard
            href="/calendar"
            icon={<CalendarDaysIcon className="w-7 h-7" />}
            title="Лунный календарь"
            bgColor="bg-secondary-50"
            iconColor="text-secondary-600"
          />
          <FunctionCard
            href="/transits"
            icon={<GlobeAltIcon className="w-7 h-7" />}
            title="Транзиты"
            bgColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <FunctionCard
            href="/numerology"
            icon="🔢"
            title="Нумерология"
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          />
          <FunctionCard
            href="/dreams"
            icon={<MoonIcon className="w-7 h-7" />}
            title="Сонник"
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <FunctionCard
            href="/meditation"
            icon={<SparklesIcon className="w-7 h-7" />}
            title="Медитации"
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <FunctionCard
            href="/learn"
            icon={<AcademicCapIcon className="w-7 h-7" />}
            title="Обучение"
            bgColor="bg-rose-50"
            iconColor="text-rose-600"
          />
        </FunctionGrid>
      </section>

      {/* Премиум функции */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-primary-50 via-secondary-50 to-pastel-lavender p-5 rounded-2xl border border-primary-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">
                Премиум функции
              </h3>
              <p className="text-xs text-neutral-600">
                Откройте полный доступ ко всем возможностям
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/60 p-3 rounded-xl text-center">
              <GiftIcon className="w-6 h-6 text-primary-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-neutral-700">Подарки</p>
            </div>
            <div className="bg-white/60 p-3 rounded-xl text-center">
              <BookOpenIcon className="w-6 h-6 text-primary-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-neutral-700">База знаний</p>
            </div>
            <div className="bg-white/60 p-3 rounded-xl text-center">
              <StarIcon className="w-6 h-6 text-primary-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-neutral-700">VIP поддержка</p>
            </div>
          </div>
          
          <button 
            onClick={() => hapticFeedback('impact', 'medium')}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Попробовать бесплатно
          </button>
        </div>
      </section>
    </div>
  );
}