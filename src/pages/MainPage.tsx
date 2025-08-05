import React, { useState, useEffect, useRef } from 'react';
import { Page, Popup } from 'konsta/react';
import StarField from '../components/StarField';
import MagicCat from '../components/MagicCat';
import SplashScreen from '../components/SplashScreen';
import TelegramUserInfo from '../components/TelegramUserInfo';

let mainPageMounted = false;

export default function MainPage() {
  if (mainPageMounted) {
    console.error('🚨 MainPage уже смонтирован!');
    return null;
  }

  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<string | null>(null);

  const renderCount = useRef(0);
  renderCount.current++;

  console.log('🔄 MainPage RENDER:', renderCount.current);

  useEffect(() => {
    if (mainPageMounted) return;

    mainPageMounted = true;
    console.log('📱 MainPage MOUNTED (единственный раз)');

    return () => {
      mainPageMounted = false;
      console.log('💀 MainPage UNMOUNTED');
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const enterFullscreen = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    if (tg && !tg.isFullscreen) {
      tg.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Telegram?.WebApp?.exitFullscreen();
  };

  const menu = [
    { name: 'natal', icon: '🔮', title: 'Натальная карта' },
    { name: 'tarot', icon: '🎴', title: 'Таро' },
    { name: 'ai', icon: '🤖', title: 'AI-Астролог' },
    { name: 'daily', icon: '⭐️', title: 'Прогноз дня' },
    { name: 'shop', icon: '🛍', title: 'Магазин' },
    { name: 'games', icon: '🎮', title: 'Мини-игры' },
    { name: 'profile', icon: '👤', title: 'Профиль' },
    { name: 'achievements', icon: '🏆', title: 'Достижения' },
  ];

  return (
    <Page className="cosmic-bg relative text-center min-h-screen overflow-y-auto">
      <StarField />
      {loading ? (
        <SplashScreen />
      ) : (
        <div className="relative z-10 pt-4 px-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent mb-1">
            ASTROT
          </h1>
          <p className="text-white/90 mb-2">Твой магический проводник в космос 🌟</p>
          <MagicCat />
          <TelegramUserInfo />
          <div className="flex justify-center gap-2 mb-4">
            <button id="fullscreenBtn" className="neon-btn" onClick={enterFullscreen}>
              Полный экран
            </button>
            <button id="exitFullscreenBtn" className="neon-btn" onClick={exitFullscreen}>
              Выйти из полного экрана
            </button>
          </div>
          <div className="koteus-message">
            Мяу! Я Котеус - твой космический проводник! Погладь меня и выбери, что тебя интересует! ✨
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 max-w-md mx-auto">
            {menu.map((item) => (
              <div
                key={item.name}
                className="menu-item"
                onClick={() => setModal(item.name)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-title">{item.title}</span>
              </div>
            ))}
          </div>
          <div className="debug-info text-xs mt-2 text-white/50">
            <small>Renders: {renderCount.current}</small>
          </div>
        </div>
      )}

      {menu.map((item) => (
        <Popup
          key={item.name}
          opened={modal === item.name}
          onPopupClosed={() => setModal(null)}
        >
          <Page className="flex flex-col items-center justify-center text-center p-6">
            <h3 className="text-xl mb-4">{item.title}</h3>
            <p className="text-sm opacity-70">Раздел в разработке...</p>
          </Page>
        </Popup>
      ))}
    </Page>
  );
}

