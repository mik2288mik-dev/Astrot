import React from 'react';
import { Monetization } from '../lib/Monetization';

interface MainMenuProps {
  navigate: (screen: string) => void;
}

export default function MainMenu({ navigate }: MainMenuProps) {
  return (
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col items-center pt-10"
      style={{ backgroundImage: "url('/assets/bg-main.png')" }}
    >
      <img src="/assets/cat-pose-1.png" alt="cat" className="w-40 h-40 mb-8" />
      <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
        <button
          onClick={() => navigate('natal')}
          className="flex flex-col items-center text-white"
        >
          <img src="/assets/button-natal.png" alt="Натальная карта" />
          <span>Натальная карта</span>
        </button>
        <button
          onClick={() => navigate('horoscope')}
          className="flex flex-col items-center text-white"
        >
          <img src="/assets/button-horoscope.png" alt="Гороскоп" />
          <span>Гороскоп</span>
        </button>
        <button
          onClick={() => navigate('games')}
          className="flex flex-col items-center text-white"
        >
          <img src="/assets/button-games.png" alt="Игры" />
          <span>Игры</span>
        </button>
        <button
          onClick={() => navigate('profile')}
          className="flex flex-col items-center text-white"
        >
          <img src="/assets/button-profile.png" alt="Профиль" />
          <span>Профиль</span>
        </button>
        <button
          onClick={() => Monetization.openPremium()}
          className="flex flex-col items-center text-white col-span-2"
        >
          <img src="/assets/button-premium.png" alt="Премиум" />
          <span>Премиум</span>
        </button>
      </div>
    </div>
  );
}
