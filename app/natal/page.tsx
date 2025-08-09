"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import { useTelegram } from '@/app/telegram-context';
import { useState } from 'react';

export default function NatalFormPage() {
  const { user } = useTelegram();
  const [name, setName] = useState<string>(user?.first_name || '');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [place, setPlace] = useState<string>('');

  async function submit() {
    const payload = { name, date, time, place, from: user?.id };
    await fetch('/api/natal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    alert('Запрос отправлен (mock).');
  }

  return (
    <Screen bg="home">
      <RouteTransition routeKey="natal">
        <div>
          <h1 className="typ-h1">Полная карта</h1>
          <form className="mt-4 glass p-6 grid gap-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <label className="grid gap-2">
              <span className="typ-caption text-on/70">Имя</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className="h-12 rounded-md border border-black/10 px-3 bg-white focus:outline-none focus-visible:shadow-focus"
              />
            </label>
            <label className="grid gap-2">
              <span className="typ-caption text-on/70">Дата рождения</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-12 rounded-md border border-black/10 px-3 bg-white focus:outline-none focus-visible:shadow-focus" />
            </label>
            <label className="grid gap-2">
              <span className="typ-caption text-on/70">Время рождения</span>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12 rounded-md border border-black/10 px-3 bg-white focus:outline-none focus-visible:shadow-focus" />
            </label>
            <label className="grid gap-2">
              <span className="typ-caption text-on/70">Место рождения</span>
              <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Город, страна" className="h-12 rounded-md border border-black/10 px-3 bg-white focus:outline-none focus-visible:shadow-focus" />
            </label>
            <Tap className="mt-2 h-12 rounded-md pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">Отправить</Tap>
          </form>
        </div>
      </RouteTransition>
    </Screen>
  );
}