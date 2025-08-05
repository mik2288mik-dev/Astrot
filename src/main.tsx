import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

declare global {
  interface Window {
    appStarted?: boolean;
    telegramInitialized?: boolean;
    htmlReady?: unknown;
    Telegram?: {
      WebApp?: unknown;
    };
  }
}

// Prevent duplicate app initialization
if (window.appStarted) {
  console.error('🚨 App уже запущен! Предотвращаем дублирование');
  throw new Error('Duplicate app initialization prevented');
}
window.appStarted = true;

// Ensure telegramInitialized flag exists for diagnostics
if (typeof window.telegramInitialized === 'undefined') {
  window.telegramInitialized = false;
}

// Additional logs for diagnostics
const logExecutionContext = () => {
  console.log('🔍 Execution Context:', {
    location: 'React Bundle',
    telegramInitialized: window.telegramInitialized,
    htmlReady: window.htmlReady,
    telegramAPI: Boolean(window.Telegram?.WebApp),
    timestamp: new Date().toISOString(),
  });
};

// Log execution context immediately
logExecutionContext();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
