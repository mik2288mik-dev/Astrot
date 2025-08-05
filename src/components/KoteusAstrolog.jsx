/* eslint-disable react/prop-types */
import React from 'react';

export default function KoteusAstrolog({ message = 'Мяу! Я Котеус, помогу построить натальную карту.', error }) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="text-5xl">🐱‍🔬</div>
      <div className={`text-lg ${error ? 'text-red-400' : ''}`}>{error || message}</div>
    </div>
  );
}
