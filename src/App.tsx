import React, { useEffect, useState } from 'react';
import { App as KonstaApp } from 'konsta/react';
import { View } from 'framework7-react';
import routes from './routes.js';

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
    <KonstaApp theme="ios" dark={dark} routes={routes}>
      <View main url="/" />
    </KonstaApp>
  );
}
