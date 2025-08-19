'use client';
import { useEffect, useState } from 'react';
import { getActiveChart } from '../../../lib/birth/storage';

type State = 'loading' | 'ready' | 'error';

export default function HoroscopePage() {
  const activeChart = getActiveChart();
  const birth = activeChart?.input;
  const [state, setState] = useState<State>('loading');
  const [data, setData] = useState<any>(null);

  async function load() {
    try {
      setState('loading');
      const r = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ birth })
      });
      if (!r.ok) throw 0;
      const d = await r.json();
      setData(d);
      setState('ready');
    } catch {
      setState('error');
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="safe-page px-4 pb-24">
      <h1 className="text-2xl font-semibold mb-4">Гороскоп дня</h1>

      {state === 'loading' && (
        <div className="rounded-2xl p-6 bg-white border border-[#EAEAF2] shadow">
          Генерируем ваш прогноз…
        </div>
      )}

      {state === 'ready' && (
        <div className="rounded-2xl p-6 bg-white border border-[#EAEAF2] shadow">
          <p className="text-[15px] leading-6 whitespace-pre-line">{data.text}</p>
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-2xl p-6 bg-white border border-[#EAEAF2] shadow text-center">
          <div className="text-lg font-medium mb-3">Упс! Что-то пошло не так</div>
          <button onClick={load} className="btn-primary w-full mb-2">
            Попробовать снова
          </button>
          <a href="/" className="w-full block text-center rounded-2xl px-5 py-3 bg-[#F7F7FB] border border-[#EAEAF2]">
            На главную
          </a>
        </div>
      )}
    </main>
  );
}