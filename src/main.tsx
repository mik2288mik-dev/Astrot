import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🏁 MAIN.TSX EXECUTION START');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);

setInterval(() => {
  const apps = document.querySelectorAll('#root > *');
  const mainPages = document.querySelectorAll('.main-page');

  if (apps.length > 1 || mainPages.length > 1) {
    console.error('🚨 НАЙДЕНЫ ДУБЛИКАТЫ В DOM!', {
      apps: apps.length,
      mainPages: mainPages.length,
    });
  }
}, 2000);
