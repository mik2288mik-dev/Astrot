import React, { useEffect, useState } from 'react';
import { WebApp } from '../Monetization';

export function MainMenu({ navigate }: { navigate: (screen: string) => void }) {
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe.user;
  const [pose, setPose] = useState(1);

  useEffect(() => {
    tg.expand();
    const interval = setInterval(() => {
      setPose(p => (p % 4) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center pt-8">
      <img src="/assets/bg-main.png" className="absolute inset-0 w-full h-full object-cover" />
      <img src={user.photo_url} className="w-16 h-16 rounded-full z-10" alt="avatar" />
      <h2 className="text-white text-xl z-10">{user.first_name} {user.last_name}</h2>
      <p className="text-gray-300 z-10">ID: {user.id}</p>
      <img
        src={`/assets/cat-pose-${pose}.png`}
        className="w-48 h-48 my-4 z-10"
        alt="кот"
      />
      <div className="grid grid-cols-2 gap-4 z-10">
        <button onClick={() => navigate('natal')}><img src="/assets/button-natal.png" alt="" /></button>
        <button onClick={() => navigate('horoscope')}><img src="/assets/button-horoscope.png" alt="" /></button>
        <button onClick={() => navigate('games')}><img src="/assets/button-games.png" alt="" /></button>
        <button onClick={() => navigate('profile')}><img src="/assets/button-profile.png" alt="" /></button>
        <button className="col-span-2" onClick={() => WebApp.openPremium()}>
          <img src="/assets/button-premium.png" alt="" />
        </button>
      </div>
    </div>
  );
}
