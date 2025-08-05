import React from 'react';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

interface KoteusProps {
  message?: string;
  error?: string;
}

// Простая функция генерации звука "мяу" без использования внешних файлов
function playMeow() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext!;
  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

export default function Koteus({ message = 'Мяу! Я Котеус, помогу построить натальную карту.', error }: KoteusProps) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-4xl animate-bounce">
        🐱‍🚀
      </div>
      <div className={`text-lg ${error ? 'text-red-400' : ''}`}>{error || message}</div>
      <button
        type="button"
        onClick={playMeow}
        className="ml-auto px-3 py-1 bg-purple-700 text-white rounded-full shadow"
      >
        Мяу
      </button>
    </div>
  );
}

