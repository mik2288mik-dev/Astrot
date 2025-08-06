import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🏁 MAIN.TSX EXECUTION START');

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// ❌ БЕЗ React.StrictMode!
root.render(<App />);

// Очистка при выходе
window.addEventListener('beforeunload', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).APP_COMPONENT_MOUNTED = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).mainPageMountedGlobally = false;
  console.log('🧹 Глобальная очистка при выходе');
});
