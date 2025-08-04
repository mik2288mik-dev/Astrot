import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import NatalForm from './components/NatalForm';
import NatalChart from './components/NatalChart';
import NavMenu from './components/NavMenu';
import StarField from './components/StarField';

const translations = {
  ru: {
    appName: 'Astrot',
    buildChart: 'Построить натальную карту',
    name: 'Имя',
    birthDate: 'Дата рождения',
    birthPlace: 'Место рождения',
    submit: 'Показать карту',
    chartPlaceholder: 'Здесь будет твоя натальная карта',
    home: 'Главная',
    profile: 'Профиль',
    about: 'О приложении',
  },
  en: {
    appName: 'Astrot',
    buildChart: 'Build natal chart',
    name: 'Name',
    birthDate: 'Birth date',
    birthPlace: 'Birth place',
    submit: 'Show chart',
    chartPlaceholder: 'Your natal chart will appear here',
    home: 'Home',
    profile: 'Profile',
    about: 'About',
  },
};

export default function App() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [screen, setScreen] = useState<'start' | 'form' | 'chart'>('start');
  const t = translations[lang];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white">
      <StarField />
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex justify-end p-4">
          <button
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            className="text-sm uppercase"
          >
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
        <div className="flex-1">
          {screen === 'start' && (
            <StartScreen
              title={t.appName}
              button={t.buildChart}
              onStart={() => setScreen('form')}
            />
          )}
          {screen === 'form' && (
            <NatalForm t={t} onSubmit={() => setScreen('chart')} />
          )}
          {screen === 'chart' && (
            <NatalChart placeholder={t.chartPlaceholder} />
          )}
        </div>
        <NavMenu t={t} />
      </div>
    </div>
  );
}
