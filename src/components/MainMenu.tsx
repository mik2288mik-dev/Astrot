import React, { useState } from 'react';
import catStar from '../assets/cat_star.png';
import iconStar from '../assets/icon_star.png';
import StarField from './StarField';

interface MainMenuProps {
  onNavigate?: (screen: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  const [bouncing, setBouncing] = useState(false);

  const handleCatClick = () => {
    setBouncing(!bouncing);
    onNavigate?.('natal');
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-gradient-to-b from-purple-950 via-indigo-900 to-blue-950 text-white flex flex-col items-center justify-center px-4 py-8">
      <StarField />
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center justify-center mb-4 space-x-2">
          <img src={iconStar} alt="Star" className="w-6 h-6 animate-pulse" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
            Натальная карта
          </h1>
          <img src={iconStar} alt="Star" className="w-6 h-6 animate-pulse" />
        </div>
        <img
          src={catStar}
          alt="Кот"
          onClick={handleCatClick}
          className={`w-40 h-40 mb-4 cursor-pointer select-none ${bouncing ? 'animate-bounce' : ''}`}
        />
        <div className="mt-8 w-full max-w-md">
          {/* Форма будет размещена здесь */}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
