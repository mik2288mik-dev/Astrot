import React, { useState } from 'react';
import catStar from '../assets/cat_star.png';

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
    <div className="min-h-screen w-full overflow-y-auto bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Натальная карта</h1>
      <img
        src={catStar}
        alt="Кот"
        onClick={handleCatClick}
        className={`w-40 h-40 cursor-pointer select-none ${bouncing ? 'animate-bounce' : ''}`}
      />
      <div className="mt-8 w-full max-w-md">
        {/* Форма будет размещена здесь */}
      </div>
    </div>
  );
};

export default MainMenu;
