import React, { useState } from 'react';
import { ApiService } from '../lib/ApiService';

interface NatalFormProps {
  onResult: (data: unknown) => void;
}

export default function NatalForm({ onResult }: NatalFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, date, time, city };
    const res = await ApiService.postNatal(payload);
    console.log(res);
    onResult(res);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-sm mx-auto">
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded p-2 text-black"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded p-2 text-black"
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="rounded p-2 text-black"
        required
      />
      <input
        type="text"
        placeholder="Город рождения"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="rounded p-2 text-black"
        required
      />
      <button
        type="submit"
        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded"
      >
        Показать натальную карту
      </button>
    </form>
  );
}
