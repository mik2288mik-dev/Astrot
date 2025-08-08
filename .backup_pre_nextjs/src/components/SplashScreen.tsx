import React from 'react';
import MagicCat from './MagicCat';

export default function SplashScreen() {
  return (
    <div className="splash-screen fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 z-50">
      <div className="logo text-4xl font-bold mb-8">✨ ASTROT ✨</div>
      <MagicCat />
      <div className="loader" />
    </div>
  );
}

