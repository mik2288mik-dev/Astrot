import React from 'react';

interface KoteusProps {
  message?: string;
  error?: string;
}

export default function Koteus({ message = 'Мяу! Я Котеус, помогу построить натальную карту.', error }: KoteusProps) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-4xl animate-bounce">
        🐱‍🚀
      </div>
      <div className={`text-lg ${error ? 'text-red-400' : ''}`}>{error || message}</div>
    </div>
  );
}

