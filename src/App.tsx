import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import NatalForm from './components/NatalForm';
import NatalResultScreen from './components/NatalResultScreen';
import HoroscopeScreen from './components/HoroscopeScreen';
import GamesScreen from './components/GamesScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  const [screen, setScreen] = useState<'loading' | 'menu' | 'natal' | 'result' | 'horoscope' | 'games' | 'profile'>('loading');
  const [natalData, setNatalData] = useState<unknown>(null);

  if (screen === 'loading') {
    return <LoadingScreen onReady={() => setScreen('menu')} />;
  }

  if (screen === 'menu') {
    return <MainMenu navigate={setScreen} />;
  }

  if (screen === 'natal') {
    return (
      <NatalForm
        onResult={(data) => {
          setNatalData(data);
          setScreen('result');
        }}
      />
    );
  }

  if (screen === 'result') {
    return <NatalResultScreen data={natalData} onBack={() => setScreen('menu')} />;
  }

  if (screen === 'horoscope') {
    return <HoroscopeScreen onBack={() => setScreen('menu')} />;
  }

  if (screen === 'games') {
    return <GamesScreen onBack={() => setScreen('menu')} />;
  }

  if (screen === 'profile') {
    return <ProfileScreen onBack={() => setScreen('menu')} />;
  }

  return null;
}
