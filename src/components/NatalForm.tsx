import React, { useState } from 'react';
import { ApiService } from '../ApiService';

export function NatalForm({ onResult }: { onResult: (data: Record<string, unknown>) => void }) {
  const tg = window.Telegram.WebApp;
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');

  const submit = async () => {
    const payload = {
      telegramId: tg.initDataUnsafe.user.id,
      name, date, time, city
    };
    const result = await ApiService.postNatal(payload);
    onResult(result);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <input className="input" placeholder="Имя" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
        <input className="input" placeholder="Город" value={city} onChange={e => setCity(e.target.value)} />
        <button className="btn-primary mt-4 w-full" onClick={submit}>
          Показать натальную карту
        </button>
      </div>
    </div>
  );
}
