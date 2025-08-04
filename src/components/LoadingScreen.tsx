'use client';

import React from 'react';
import { Block } from 'konsta/react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Block strong className="text-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <h2 className="text-xl font-semibold">Подключение к Telegram...</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Загружаем данные пользователя
          </p>
        </div>
      </Block>
    </div>
  );
};