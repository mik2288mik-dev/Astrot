import React, { useState, useEffect } from 'react';
import { monetizationService } from '../services/Monetization';
import '../types/telegram';

interface MainMenuProps {
  onNavigate: (screen: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  const [currentCatPose, setCurrentCatPose] = useState(1);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Получение информации о пользователе из Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      const userData = tg.initDataUnsafe?.user;
      setUser(userData);
    }

    // Анимация смены котов каждые 5 секунд
    const catInterval = setInterval(() => {
      setCurrentCatPose(prev => prev === 4 ? 1 : prev + 1);
    }, 5000);

    return () => clearInterval(catInterval);
  }, []);

  const handlePremiumClick = async () => {
    if (user?.id) {
      try {
        const result = await monetizationService.initiatePremiumPayment(user.id);
        if (result.success) {
          // Обновить UI или показать успешное сообщение
          console.log('Премиум успешно приобретен!');
        } else {
          console.log('Ошибка при покупке премиума:', result.error);
        }
      } catch (error) {
        console.error('Ошибка при покупке премиума:', error);
        // Для демонстрации показываем popup с информацией о премиуме
        monetizationService.showPremiumInfo();
      }
    } else {
      // Если нет доступа к Telegram, показываем информацию о премиуме
      monetizationService.showPremiumInfo();
    }
  };

  const MenuButton: React.FC<{ 
    imageSrc: string; 
    onClick: () => void; 
    alt: string;
    className?: string;
  }> = ({ imageSrc, onClick, alt, className = "" }) => (
    <button 
      onClick={onClick}
      className={`transform transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      style={{
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
      }}
    >
      <img 
        src={imageSrc} 
        alt={alt}
        className="w-full h-auto max-w-[150px]"
      />
    </button>
  );

  // Заглушка для пользователя, если Telegram недоступен
  const defaultUser = {
    first_name: 'Космический',
    last_name: 'Путешественник',
    id: 12345,
    photo_url: null
  };

  const displayUser = user || defaultUser;

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden px-4 py-8"
      style={{
        backgroundImage: 'url(/assets/bg-main.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay для улучшения читаемости */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Основной контент */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Информация о пользователе */}
        <div className="text-center mb-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 w-full">
          {/* Аватар пользователя */}
          <div className="mb-4">
            {displayUser.photo_url ? (
              <img 
                src={displayUser.photo_url} 
                alt="User Avatar"
                className="w-16 h-16 rounded-full mx-auto border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {displayUser.first_name?.[0] || '👤'}
              </div>
            )}
          </div>

          {/* Имя пользователя */}
          <h2 className="text-white text-xl font-bold mb-1">
            {displayUser.first_name} {displayUser.last_name || ''}
          </h2>
          
          {/* ID пользователя */}
          <p className="text-blue-200 text-sm opacity-80">
            ID: {displayUser.id}
          </p>
        </div>

        {/* Анимированный кот */}
        <div className="mb-8 transform transition-all duration-1000 hover:scale-110">
          <img 
            src={`/assets/cat-pose-${currentCatPose}.svg`}
            alt={`Cat Pose ${currentCatPose}`}
            className="w-32 h-32 mx-auto animate-bounce"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))',
              animationDuration: '3s'
            }}
          />
        </div>

        {/* Сетка кнопок навигации */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          
          {/* Кнопка натальной карты */}
          <MenuButton
            imageSrc="/assets/button-natal.svg"
            onClick={() => onNavigate('natal')}
            alt="Натальная карта"
            className="col-span-2"
          />

          {/* Кнопка гороскопа */}
          <MenuButton
            imageSrc="/assets/button-horoscope.svg"
            onClick={() => onNavigate('horoscope')}
            alt="Гороскоп"
          />

          {/* Кнопка игр */}
          <MenuButton
            imageSrc="/assets/button-games.svg"
            onClick={() => onNavigate('games')}
            alt="Игры"
          />

          {/* Кнопка профиля */}
          <MenuButton
            imageSrc="/assets/button-profile.svg"
            onClick={() => onNavigate('profile')}
            alt="Профиль"
          />

          {/* Кнопка премиума */}
          <MenuButton
            imageSrc="/assets/button-premium.svg"
            onClick={handlePremiumClick}
            alt="Премиум"
          />
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-white text-sm opacity-70">
            ✨ Откройте тайны звезд ✨
          </p>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-16 left-8 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-32 right-12 w-2 h-2 bg-pink-300 rounded-full animate-ping opacity-40"></div>
      <div className="absolute bottom-32 left-16 w-2 h-2 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-48 right-8 w-1 h-1 bg-white rounded-full animate-ping opacity-70"></div>
      <div className="absolute top-48 left-4 w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-40"></div>
    </div>
  );
};

export default MainMenu;
