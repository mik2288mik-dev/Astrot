import React, { useEffect, useState } from 'react';
import MainPage from './pages/MainPage';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  console.log('🎯 APP COMPONENT RENDER');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.APP_COMPONENT_MOUNTED) {
      console.log('⚠️ App компонент уже смонтирован');
      return;
    }

    w.APP_COMPONENT_MOUNTED = true;
    setIsReady(true);

    return () => {
      w.APP_COMPONENT_MOUNTED = false;
    };
  }, []);

  useTelegramWebApp();

  // Мониторинг состояния каждые 3 секунды
  useEffect(() => {
    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      console.log('📊 App State:', {
        appMounted: w.APP_COMPONENT_MOUNTED,
        mainPageMounted: w.mainPageMountedGlobally,
        timestamp: new Date().toISOString(),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Проверяем DOM на дубликаты
  useEffect(() => {
    const checkDuplicates = () => {
      const mainPages = document.querySelectorAll('.main-page');
      const roots = document.querySelectorAll('#root > *');

      if (mainPages.length > 1) {
        console.error('🚨 НАЙДЕНО ДУБЛИКАТОВ MainPage:', mainPages.length);
        for (let i = 1; i < mainPages.length; i++) {
          mainPages[i].remove();
          console.log('🗑 Удален дублированный MainPage');
        }
      }

      console.log('✅ DOM проверка:', {
        mainPages: mainPages.length,
        rootChildren: roots.length,
      });
    };

    const timer = setTimeout(checkDuplicates, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <div className="loading">Инициализация...</div>;
  }

  return <MainPage />;
}

