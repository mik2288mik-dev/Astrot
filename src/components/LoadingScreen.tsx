import React, { useEffect } from 'react';
import '../types/telegram';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    // Таймер загрузки
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/bg-loading.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay для улучшения читаемости */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Основной контент */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Спиннер */}
        <div className="mb-8">
          <img 
            src="/assets/spinner.svg" 
            alt="Loading..." 
            className="w-16 h-16 animate-spin"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))'
            }}
          />
        </div>

        {/* Текст загрузки */}
        <div className="text-center">
          <h2 className="text-white text-xl font-semibold mb-2 animate-pulse">
            Загрузка...
          </h2>
          <p className="text-blue-200 text-sm opacity-80">
            Подготавливаем звездные карты
          </p>
        </div>

        {/* Дополнительные звездочки для атмосферы */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-20 right-16 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 right-12 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-32 left-1/3 w-1 h-1 bg-pink-300 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-cyan-200 rounded-full animate-ping opacity-30"></div>
      </div>

      {/* Прогресс-бар (опциональный) */}
      <div className="absolute bottom-16 left-8 right-8 z-10">
        <div className="w-full bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"
            style={{
              animation: 'loadingProgress 1.5s ease-in-out forwards'
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
