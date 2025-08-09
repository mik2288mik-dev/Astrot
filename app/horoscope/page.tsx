"use client";

import { useEffect, useState } from 'react';
import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function HoroscopePage() {
  const [text, setText] = useState<string>('Загрузка...');

  useEffect(() => {
    fetch('/api/horoscope').then((r) => r.json()).then((j) => setText(j.daily || ''));
  }, []);

  return (
    <Screen bg="functions">
      <RouteTransition routeKey="horoscope">
        <div className="glass p-6">
          <h1 className="typ-h1">Совет дня</h1>
          <div className="mt-2 typ-body text-on/90">{text}</div>
        </div>
      </RouteTransition>
    </Screen>
  );
}