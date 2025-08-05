import { useEffect } from 'react';

let telegramInitialized = false;

export const useTelegramWebApp = () => {
  useEffect(() => {
    if (telegramInitialized) {
      console.log('⚠️ Telegram уже инициализирован');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    telegramInitialized = true;
    console.log('🚀 Единственная инициализация Telegram WebApp');

    tg.ready();
    console.log('Версия:', tg.version);
    console.log('Платформа:', tg.platform);
    console.log('Высота до expand:', tg.viewportHeight);

    if (!tg.isExpanded) {
      tg.expand();
    }

    setTimeout(() => {
      console.log('Высота после expand:', tg.viewportHeight);
      console.log('isExpanded:', tg.isExpanded);

      if (tg.version >= 6.1 && !tg.isFullscreen) {
        try {
          tg.requestFullscreen();
        } catch (e) {
          console.log('Fullscreen не поддерживается');
        }
      }
    }, 100);

    const handleViewportChanged = () => {
      console.log('Viewport изменен!');
      console.log('Новая высота:', tg.viewportHeight);
    };

    tg.onEvent('viewportChanged', handleViewportChanged);

    return () => {
      tg.offEvent('viewportChanged', handleViewportChanged);
      telegramInitialized = false;
    };
  }, []);
};
