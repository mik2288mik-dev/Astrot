import React, { useState, useEffect } from 'react';
import { Page, Navbar, Block, Button, Link } from 'konsta/react';
import StarField from '../components/StarField';
import KoteusAstrolog from '../components/KoteusAstrolog';
import TelegramUserInfo from '../components/TelegramUserInfo';

export default function MainPage() {
  const [showPremiumOffer, setShowPremiumOffer] = useState(false);

  useEffect(() => {
    // Show premium offer after 5 seconds
    const timer = setTimeout(() => {
      setShowPremiumOffer(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Page className="cosmic-bg relative overflow-hidden text-center min-h-screen">
      <StarField />
      
      <Navbar 
        title="ASTROT - Космическая Астрология" 
        right={<Link navbar href="/settings/">Настройки</Link>}
        className="glassy border-b border-white/10"
      />
      
      <div className="relative z-10 pt-8 px-4">
        {/* Telegram User Info */}
        <TelegramUserInfo />
        
        {/* Main Hero Section */}
        <Block strong className="mt-4 glassy-enhanced max-w-sm mx-auto">
          <KoteusAstrolog isAnimating={true} />
          
          {/* Main CTA Button */}
          <Button href="/natal-form/" className="neon-btn mt-6 text-lg py-4">
            Построить Натальную Карту
          </Button>
          
          {/* Free features */}
          <div className="mt-4 text-cyan-200 text-sm">
            Бесплатно: базовая натальная карта
          </div>
        </Block>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4 mt-6 max-w-md mx-auto">
          {/* Premium Features Card */}
          <div className="glassy p-4 rounded-xl border border-purple-400/30">
            <h3 className="text-purple-300 font-bold mb-2">Премиум Возможности</h3>
            <ul className="text-cyan-100 text-sm space-y-1 text-left">
              <li>• Детальный анализ планет</li>
              <li>• Совместимость партнёров</li>
              <li>• Прогнозы на месяц/год</li>
              <li>• Персональные рекомендации</li>
            </ul>
            <button className="neon-btn mt-3 text-sm py-2 px-4 w-full">
              Премиум за 299₽/мес
            </button>
          </div>

          {/* Game Features */}
          <div className="glassy p-4 rounded-xl border border-cyan-400/30">
            <h3 className="text-cyan-300 font-bold mb-2">Космические Игры</h3>
            <ul className="text-cyan-100 text-sm space-y-1 text-left">
              <li>• Ежедневные астро-квесты</li>
              <li>• Сбор космических кристаллов</li>
              <li>• Рейтинги астрологов</li>
              <li>• Соревнования предсказаний</li>
            </ul>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-full text-sm mt-3 w-full font-medium">
              Скоро открытие!
            </button>
          </div>
        </div>

        {/* Premium Popup Offer */}
        {showPremiumOffer && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glassy-enhanced p-6 max-w-sm w-full text-center relative">
              <button 
                onClick={() => setShowPremiumOffer(false)}
                className="absolute top-3 right-3 text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>
              
              <div className="text-4xl mb-4">*</div>
              <h2 className="text-xl font-bold text-cyan-100 mb-3">
                Специальное предложение
              </h2>
              <p className="text-cyan-200 text-sm mb-4">
                Первая неделя Премиума бесплатно! 
                Получи полный доступ ко всем функциям.
              </p>
              
              <button className="neon-btn w-full mb-3">
                Активировать бесплатную неделю
              </button>
              
              <button 
                onClick={() => setShowPremiumOffer(false)}
                className="text-white/70 text-sm"
              >
                Может быть позже
              </button>
            </div>
          </div>
        )}

        {/* Cosmic Decorations */}
        <div className="absolute top-20 left-6 w-8 h-8 rounded-full bg-purple-400 opacity-30 animate-pulse"></div>
        <div className="absolute top-60 right-8 w-6 h-6 rounded-full bg-cyan-400 opacity-40 animate-ping"></div>
        <div className="absolute bottom-40 left-12 w-10 h-10 rounded-full bg-pink-400 opacity-20 animate-bounce"></div>
      </div>
    </Page>
  );
}
