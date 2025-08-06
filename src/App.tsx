import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import NatalForm from './components/NatalForm';
import NatalResultScreen from './components/NatalResultScreen';
import { NatalResult } from './services/ApiService';
import './types/telegram';

// Типы экранов
type Screen = 'loading' | 'menu' | 'natal' | 'result' | 'horoscope' | 'games' | 'profile';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [natalResult, setNatalResult] = useState<NatalResult | null>(null);

  // Эффект для обработки Telegram WebApp
  useEffect(() => {
    // Настройка темы Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Установка темной темы
      tg.setHeaderColor('#1e1b4b');
      tg.setBackgroundColor('#0f0c29');
      
      // Обработка кнопки "Назад" в Telegram
      const handleBackButton = () => {
        if (screen === 'result' || screen === 'natal') {
          setScreen('menu');
        } else if (screen !== 'loading' && screen !== 'menu') {
          setScreen('menu');
        }
      };

      tg.BackButton.onClick(handleBackButton);
      
      // Показ/скрытие кнопки "Назад"
      if (screen === 'menu' || screen === 'loading') {
        tg.BackButton.hide();
      } else {
        tg.BackButton.show();
      }

      return () => {
        tg.BackButton.offClick(handleBackButton);
      };
    }
  }, [screen]);

  const handleNavigate = (targetScreen: string) => {
    setScreen(targetScreen as Screen);
  };

  const handleNatalResult = (result: NatalResult) => {
    setNatalResult(result);
    setScreen('result');
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  // Простые заглушки для остальных экранов
  const SimpleScreen: React.FC<{ title: string; icon: string; onBack: () => void }> = 
    ({ title, icon, onBack }) => (
      <div 
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
        style={{
          backgroundImage: 'url(/assets/bg-main.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-white text-2xl font-bold mb-4">{title}</h1>
          <p className="text-blue-200 text-sm mb-8 opacity-80">
            Эта функция находится в разработке
          </p>
          <button
            onClick={onBack}
            className="py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-purple-600 hover:to-pink-600 active:scale-95"
          >
            ← Назад в меню
          </button>
        </div>
      </div>
    );

  // Рендеринг экранов
  switch (screen) {
    case 'loading':
      return <LoadingScreen onLoadingComplete={() => setScreen('menu')} />;

    case 'menu':
      return <MainMenu onNavigate={handleNavigate} />;

    case 'natal':
      return (
        <NatalForm
          onResult={handleNatalResult}
          onBack={handleBackToMenu}
        />
      );

    case 'result':
      return natalResult ? (
        <NatalResultScreen 
          result={natalResult} 
          onBack={handleBackToMenu} 
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center text-white">
          <p>Нет данных для отображения</p>
        </div>
      );

    case 'horoscope':
      return (
        <SimpleScreen 
          title="Гороскоп" 
          icon="⭐" 
          onBack={handleBackToMenu} 
        />
      );

    case 'games':
      return (
        <SimpleScreen 
          title="Игры" 
          icon="🎮" 
          onBack={handleBackToMenu} 
        />
      );

    case 'profile':
      return (
        <SimpleScreen 
          title="Профиль" 
          icon="👤" 
          onBack={handleBackToMenu} 
        />
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center text-white">
          <p>Неизвестный экран</p>
        </div>
      );
  }
}
