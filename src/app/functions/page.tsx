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
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] via-[#FFE5ED] to-[#FFE0EC] pb-28">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Заголовок */}
        <section className="mb-8 text-center">
          <h1 className="font-semibold text-[32px] text-[#2C2C2C] mb-2">
            Функции
          </h1>
          <p className="text-[16px] text-[#666666]">
            Исследуйте мир астрологии и эзотерики
          </p>
        </section>

        {/* Карта дня */}
        <section className="mb-8">
          <div className="rounded-[24px] bg-white shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-[20px] text-[#2C2C2C]">
                Карта дня
              </h2>
              <span className="text-[12px] text-[#666666] bg-gradient-to-r from-[#FFE0EC] to-[#E8D5FF] px-3 py-1 rounded-[12px]">
                {dailyCard.date}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E8D5FF] to-[#D6ECFF] rounded-[16px] flex items-center justify-center">
                  <MoonIcon className="w-6 h-6 text-[#666666]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#999999] leading-tight">Луна в знаке</p>
                  <p className="text-[16px] font-semibold text-[#2C2C2C]">{dailyCard.moonSign}</p>
                </div>
              </div>
              
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-[12px] flex items-center justify-center">
                    <StarIcon className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <p className="text-[12px] text-[#999999] leading-tight">Число</p>
                    <p className="text-[14px] font-semibold text-[#2C2C2C]">{dailyCard.luckyNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-[12px] flex items-center justify-center">
                    <SunIcon className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <p className="text-[12px] text-[#999999] leading-tight">Цвет</p>
                    <p className="text-[14px] font-semibold text-[#2C2C2C]">{dailyCard.luckyColor}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                hapticFeedback('impact', 'light');
                window.location.href = '/horoscope';
              }}
              className="mt-6 w-full bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] text-white rounded-[16px] py-3 font-semibold text-[14px] shadow-md hover:shadow-lg transition-all duration-300"
            >
              Посмотреть гороскоп дня →
            </button>
          </div>
        </section>

        {/* Основные функции */}
        <section className="mb-8">
          <h2 className="font-semibold text-[20px] text-[#2C2C2C] mb-4">
            Популярные
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/natal'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-[16px] flex items-center justify-center">
                <span className="text-[24px]">♈</span>
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Натальная карта</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/my-charts'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-[16px] flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-[#666666]" />
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Мои карты</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/horoscope'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-[16px] flex items-center justify-center">
                <span className="text-[24px]">⭐</span>
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Гороскоп</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/chat'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-teal-100 to-blue-100 rounded-[16px] flex items-center justify-center">
                <span className="text-[24px]">💬</span>
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">AI Астролог</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/compat'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-[16px] flex items-center justify-center">
                <span className="text-[24px]">💕</span>
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Совместимость</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/premium'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-orange-100 rounded-[16px] flex items-center justify-center">
                <span className="text-[24px]">👑</span>
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Премиум</p>
            </button>
          </div>
        </section>

        {/* Дополнительные функции */}
        <section className="mb-8">
          <h2 className="font-semibold text-[20px] text-[#2C2C2C] mb-4">
            Дополнительные
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/calendar'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-indigo-50 rounded-[16px] flex items-center justify-center">
                <CalendarDaysIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Лунный календарь</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/transits'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-50 rounded-[16px] flex items-center justify-center">
                <GlobeAltIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Транзиты</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/numerology'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-amber-50 rounded-[16px] flex items-center justify-center">
                <span className="text-[24px]">🔢</span>
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Нумерология</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/dreams'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-indigo-50 rounded-[16px] flex items-center justify-center">
                <MoonIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Сонник</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/meditation'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-50 rounded-[16px] flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Медитации</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/learn'}
              className="rounded-[24px] bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-rose-50 rounded-[16px] flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2C] leading-tight">Обучение</p>
            </button>
          </div>
        </section>

        {/* Премиум блок */}
        <section className="mb-6">
          <div className="rounded-[24px] bg-gradient-to-br from-purple-50 to-pink-50 shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FDCBFF] to-[#B3CFFF] rounded-[16px] flex items-center justify-center shadow-md">
                <StarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[18px] text-[#2C2C2C]">
                  Премиум доступ
                </h3>
                <p className="text-[14px] text-[#666666] leading-tight">
                  Откройте полный доступ ко всем возможностям
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/70 p-3 rounded-[16px] text-center">
                <GiftIcon className="w-6 h-6 text-[#666666] mx-auto mb-2" />
                <p className="text-[12px] font-medium text-[#2C2C2C]">Подарки</p>
              </div>
              <div className="bg-white/70 p-3 rounded-[16px] text-center">
                <BookOpenIcon className="w-6 h-6 text-[#666666] mx-auto mb-2" />
                <p className="text-[12px] font-medium text-[#2C2C2C]">База знаний</p>
              </div>
              <div className="bg-white/70 p-3 rounded-[16px] text-center">
                <StarIcon className="w-6 h-6 text-[#666666] mx-auto mb-2" />
                <p className="text-[12px] font-medium text-[#2C2C2C]">VIP поддержка</p>
              </div>
            </div>
            
            <button 
              onClick={() => hapticFeedback('impact', 'medium')}
              className="w-full bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] text-white rounded-[16px] py-3 font-semibold text-[14px] shadow-md hover:shadow-lg transition-all duration-300"
            >
              Попробовать бесплатно
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}