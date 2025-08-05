import React, { useEffect, useState } from 'react';
import { App as KonstaApp } from 'konsta/react';
import { App as F7App, View } from 'framework7-react';
import routes from './routes.js';
import TelegramWrapper from './components/TelegramWrapper';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
    const handler = (e: Event) => setDark((e as CustomEvent<boolean>).detail);
    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  }, []);

  return (
    <ErrorBoundary>
      <TelegramWrapper>
        <KonstaApp theme="ios" dark={dark}>
          <F7App theme="ios" routes={routes}>
            <View main url="/" />
          </F7App>
        </KonstaApp>
      </TelegramWrapper>
    </ErrorBoundary>
  );
}
