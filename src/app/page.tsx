'use client';

import React, { useEffect, useState } from 'react';
import FunctionCard, { FunctionGrid } from '@/components/FunctionCard';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { 
  MapIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShoppingBagIcon,
  MoonIcon,
  StarIcon,
  SunIcon
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

export default function HomePage() {
  const { firstName, photoUrl } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const [dailyCard, setDailyCard] = useState(getDailyCard());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) setGreeting('Доброй ночи');
    else if (hour < 12) setGreeting('Доброе утро');
    else if (hour < 18) setGreeting('Добрый день');
    else setGreeting('Добрый вечер');
  }, []);

  const handleFunctionClick = () => {
    hapticFeedback('impact', 'light');
  };

  return (
    <div className="page-wrapper animate-fadeIn">
      {/* Приветствие */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {greeting}, {firstName}!
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Что вас интересует сегодня?
            </p>
          </div>
          {photoUrl && (
            <img 
              src={photoUrl} 
              alt={firstName}
              className="w-12 h-12 rounded-full border-2 border-white shadow-soft"
            />
          )}
        </div>
      </section>

      {/* Карта дня */}
      <section className="mb-6">
        <div className="bg-gradient-to-br from-pastel-purple via-pastel-pink to-pastel-peach p-5 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-neutral-800">
              Карта дня
            </h2>
            <span className="text-xs text-neutral-600 bg-white/60 px-2 py-1 rounded-lg">
              {dailyCard.date}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center">
                <MoonIcon className="w-5 h-5 text-primary-700" />
              </div>
              <div>
                <p className="text-xs text-neutral-600">Луна в знаке</p>
                <p className="text-sm font-semibold text-neutral-800">{dailyCard.moonSign}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/40 rounded-lg flex items-center justify-center">
                  <StarIcon className="w-4 h-4 text-primary-700" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Число</p>
                  <p className="text-sm font-semibold text-neutral-800">{dailyCard.luckyNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/40 rounded-lg flex items-center justify-center">
                  <SunIcon className="w-4 h-4 text-primary-700" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Цвет</p>
                  <p className="text-sm font-semibold text-neutral-800">{dailyCard.luckyColor}</p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              hapticFeedback('impact', 'light');
            }}
            className="mt-4 w-full bg-white/60 hover:bg-white/80 text-primary-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm"
          >
            Посмотреть полную карту →
          </button>
        </div>
      </section>

      {/* Функции */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Функции
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

      {/* Промо-блок */}
      <section className="mt-6 mb-20">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-2xl border border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-800">
                Попробуйте премиум
              </p>
              <p className="text-xs text-neutral-600 mt-0.5">
                Разблокируйте все функции приложения
              </p>
            </div>
            <button className="text-primary-600 font-medium text-sm px-3 py-1.5 bg-white rounded-lg">
              Узнать
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}