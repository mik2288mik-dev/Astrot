import React, { useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { MainMenu } from './components/MainMenu';
import { NatalForm } from './components/NatalForm';
import { NatalResultScreen } from './components/NatalResultScreen';

export function App() {
  const [screen, setScreen] = useState<'loading'|'menu'|'natal'|'result'>('loading');
  const [natalData, setNatalData] = useState<Record<string, unknown> | null>(null);

  if (screen === 'loading') return <LoadingScreen onReady={() => setScreen('menu')} />;
  if (screen === 'menu')   return <MainMenu navigate={setScreen} />;
  if (screen === 'natal')  return <NatalForm onResult={data => { setNatalData(data); setScreen('result'); }} />;
  if (screen === 'result') return <NatalResultScreen data={natalData} />;

  return null;
}
