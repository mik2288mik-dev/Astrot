"use client";
import { useState } from 'react';

export default function NatalForm() {
  const [form, setForm] = useState({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    lat: 55.7558,
    lon: 37.6173,
    tz: 'Europe/Moscow',
    houseSystem: 'P' as any
  });
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<any | null>(null);
  const [daily, setDaily] = useState<any | null>(null);
  const [explain, setExplain] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('demo-user');

  function onChange<K extends keyof typeof form>(k: K, v: any) {
    setForm((s) => ({ ...s, [k]: typeof v === 'string' ? (v as any).trim() : v }));
  }

  async function callFree() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/compute-chart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Ошибка расчета');
      const json = await res.json();
      setChart(json); setDaily(null); setExplain(null);
    } catch (e: any) { setError(e.message || 'Ошибка'); }
    finally { setLoading(false); }
  }

  async function callPremium() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/natal-full', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, userId }) });
      const json = await res.json();
      if (res.status === 402 && json?.error === 'premium_required') {
        setError('Требуется премиум. Оплатите подписку, чтобы продолжить.');
        return;
      }
      if (!res.ok) throw new Error(json?.message || 'Ошибка');
      setChart(json.chart); setDaily(json.daily); setExplain(json.explanation);
    } catch (e: any) { setError(e.message || 'Ошибка'); }
    finally { setLoading(false); }
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1">
          <span className="text-xs text-gray-500">Год</span>
          <input className="input" type="number" value={form.year} onChange={(e) => onChange('year', Number(e.target.value))} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-gray-500">Месяц</span>
          <input className="input" type="number" value={form.month} onChange={(e) => onChange('month', Number(e.target.value))} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-gray-500">День</span>
          <input className="input" type="number" value={form.day} onChange={(e) => onChange('day', Number(e.target.value))} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-gray-500">Час</span>
          <input className="input" type="number" value={form.hour} onChange={(e) => onChange('hour', Number(e.target.value))} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-gray-500">Мин</span>
          <input className="input" type="number" value={form.minute} onChange={(e) => onChange('minute', Number(e.target.value))} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-gray-500">Широта</span>
          <input className="input" type="number" value={form.lat} onChange={(e) => onChange('lat', Number(e.target.value))} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-gray-500">Долгота</span>
          <input className="input" type="number" value={form.lon} onChange={(e) => onChange('lon', Number(e.target.value))} />
        </label>
        <label className="grid gap-1 col-span-2">
          <span className="text-xs text-gray-500">IANA TZ</span>
          <input className="input" value={form.tz || ''} onChange={(e) => onChange('tz', e.target.value)} placeholder="Europe/Moscow" />
        </label>
        <label className="grid gap-1 col-span-2">
          <span className="text-xs text-gray-500">User ID</span>
          <input className="input" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>
      </div>
      <div className="flex gap-3">
        <button onClick={callFree} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Базовая карта</button>
        <button onClick={callPremium} disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded">Полный анализ (Premium)</button>
      </div>
      {error && <div className="text-rose-600 text-sm">{error}</div>}

      {chart && (
        <div className="grid gap-2 p-4 border rounded">
          <h3 className="font-semibold">Базовая карта</h3>
          <p className="text-sm whitespace-pre-wrap">{chart.summaryText}</p>
          <p className="text-sm">Солнце: {chart.sunSign}</p>
        </div>
      )}

      {daily && (
        <div className="grid gap-2 p-4 border rounded">
          <h3 className="font-semibold">Дневной гороскоп</h3>
          <p className="text-sm whitespace-pre-wrap">{daily.description}</p>
        </div>
      )}

      {explain && (
        <div className="grid gap-2 p-4 border rounded">
          <h3 className="font-semibold">Расшифровка ИИ-астролога</h3>
          <p className="text-sm whitespace-pre-wrap">{explain.text}</p>
        </div>
      )}
    </div>
  );
}