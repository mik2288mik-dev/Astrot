'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main className="safe-page">
      <div className="page-content animate-fade-in">
        {/* Заголовок */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white/90 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="heading-1">Настройки</h1>
        </div>

        {/* Секции настроек */}
        <div className="space-y-6">
          {/* Оформление */}
          <div className="card">
            <h2 className="card-title mb-4">Оформление</h2>
            <div className="space-y-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Уведомления */}
          <div className="card">
            <h2 className="card-title mb-4">Уведомления</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Ежедневные советы
                  </h3>
                  <p className="text-sm text-gray-500">
                    Получать персональные рекомендации каждый день
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Конфиденциальность */}
          <div className="card">
            <h2 className="card-title mb-4">Конфиденциальность</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Анонимные данные
                  </h3>
                  <p className="text-sm text-gray-500">
                    Помочь улучшить приложение, отправляя анонимную статистику
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* О приложении */}
          <div className="card">
            <h2 className="card-title mb-4">О приложении</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Версия</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Разработчик</span>
                <span className="font-medium">Astrot Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}