import React, { useEffect, useState } from 'react';
import { monetizationService } from '../services/Monetization';
import '../types/telegram';

// card images
import catWand from '../assets/cat_wand.png';
import catStar from '../assets/cat_star.png';
import catHands from '../assets/cat_handsup.png';
import catWink2 from '../assets/cat_wink2.png';
import catPhone from '../assets/cat_phone.png';
import catPhone2 from '../assets/cat_phone2.png';
import iconCoin2 from '../assets/icon_coin2.png';
import iconPlus from '../assets/icon_plus.png';

interface MainMenuProps {
  onNavigate: (screen: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<{ first_name?: string; last_name?: string; id?: number; photo_url?: string } | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      const userData = tg.initDataUnsafe?.user;
      setUser(userData);
    }
  }, []);

  const handlePremiumClick = () => {
    monetizationService.openPremiumPayment(100);
  };

  const defaultUser = {
    first_name: 'Космический',
    last_name: 'Путешественник',
    id: 12345,
    photo_url: null,
  };

  const displayUser = user || defaultUser;

  const cards = [
    { label: 'Натальная карта', image: catWand, onClick: () => onNavigate('natal') },
    { label: 'Датанная карта', image: catStar, onClick: () => onNavigate('horoscope') },
    { label: 'Таро', image: catHands, onClick: () => onNavigate('tarot1') },
    { label: 'Таро', image: catWink2, onClick: () => onNavigate('tarot2') },
    { label: 'ИИ-Астролог', image: catPhone, onClick: () => onNavigate('ai1') },
    { label: 'ИИ-Астролог', image: catPhone2, onClick: () => onNavigate('ai2') },
    { label: 'Магазин', image: iconCoin2, onClick: () => onNavigate('shop') },
    { label: 'Подписка', image: iconPlus, onClick: handlePremiumClick },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white">
      {/* user card */}
      <div className="w-full max-w-md mb-6">
        <div className="bg-white/10 rounded-xl p-4 flex items-center gap-4">
          {displayUser.photo_url ? (
            <img src={displayUser.photo_url} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xl font-bold">
              {displayUser.first_name?.[0] || '👤'}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {displayUser.first_name} {displayUser.last_name || ''}
            </h2>
            <p className="text-xs text-blue-200">ID: {displayUser.id}</p>
          </div>
        </div>
      </div>

      {/* grid of menu cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md flex-1">
        {cards.map((card) => (
          <div
            key={card.label}
            onClick={card.onClick}
            className="cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-between bg-gradient-to-br from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 transition-transform transform hover:scale-105"
          >
            <img src={card.image} alt={card.label} className="w-20 h-20 object-contain mb-2" />
            <span className="text-sm font-medium text-center leading-tight">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
