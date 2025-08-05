import React, { useEffect, useState } from 'react';
import { App as KonstaApp } from 'konsta/react';
import { App as F7App, View } from 'framework7-react';
import routes from './routes.js';
import TelegramWrapper from './components/TelegramWrapper';
import ErrorBoundary from './components/ErrorBoundary';
import Framework7 from 'framework7/lite-bundle';
import Framework7React from 'framework7-react';
import 'framework7/framework7-bundle.css';

// Register Framework7 React plugin (required for Framework7 components to work correctly)
Framework7.use(Framework7React);

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
