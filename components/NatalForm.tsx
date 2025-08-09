"use client";
import { useMemo, useState } from 'react';

export default function NatalForm() {
  const [form, setForm] = useState({
    name: '',
    dateStr: '', // DD.MM.YYYY
    hour: '' as number | '',
    minute: '' as number | '',
    place: '', // City, Country
    lat: 55.7558,
    lon: 37.6173,
    tz: 'Europe/Moscow',
    houseSystem: 'P' as any
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<any | null>(null);
  const [daily, setDaily] = useState<any | null>(null);
  const [explain, setExplain] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('demo-user');

  function onChange<K extends keyof typeof form>(k: K, v: any) {
    setForm((s) => ({ ...s, [k]: typeof v === 'string' ? (v as any) : v }));
  }

  function parseDate(input: string): { year: number; month: number; day: number } | null {
    const m = input.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return null;
    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);
    if (
      Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year) ||
      day < 1 || day > 31 || month < 1 || month > 12 || year < 1 || year > 9999
    ) {
      return null;
    }
    return { year, month, day };
  }

  const { year, month, day } = useMemo(() => parseDate(form.dateStr) || { year: 0, month: 0, day: 0 }, [form.dateStr]);

  async function callFree() {
    setLoading(true); setError(null);
    try {
      if (!year || !month || !day) throw new Error('Введите дату в формате ДД.MM.ГГГГ');
      const hour = form.hour === '' ? 0 : Number(form.hour);
      const minute = form.minute === '' ? 0 : Number(form.minute);
      const payload = {
        year, month, day,
        hour, minute,
        lat: Number(form.lat),
        lon: Number(form.lon),
        tz: form.tz,
        houseSystem: form.houseSystem
      };
      const res = await fetch('/api/compute-chart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Ошибка расчета');
      const json = await res.json();
      setChart(json); setDaily(null); setExplain(null);
    } catch (e: any) { setError(e.message || 'Ошибка'); }
    finally { setLoading(false); }
  }

  async function callPremium() {
    setLoading(true); setError(null);
    try {
      if (!year || !month || !day) throw new Error('Введите дату в формате ДД.MM.ГГГГ');
      const hour = form.hour === '' ? 0 : Number(form.hour);
      const minute = form.minute === '' ? 0 : Number(form.minute);
      const payload = {
        year, month, day,
        hour, minute,
        lat: Number(form.lat),
        lon: Number(form.lon),
        tz: form.tz,
        houseSystem: form.houseSystem,
        userId
      };
      const res = await fetch('/api/natal-full', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="typ-caption text-muted">Имя</span>
          <input
            className="input"
            type="text"
            placeholder="Иван Иванов"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </label>

        <div className="grid grid-cols-12 gap-3 items-end">
          <label className="grid gap-1 col-span-6 sm:col-span-5">
            <span className="typ-caption text-muted">Дата рождения</span>
            <input
              className="input"
              inputMode="numeric"
              placeholder="ДД.MM.ГГГГ"
              value={form.dateStr}
              onChange={(e) => onChange('dateStr', e.target.value)}
            />
          </label>
          <label className="grid gap-1 col-span-3 sm:col-span-2">
            <span className="typ-caption text-muted">Часы</span>
            <input
              className="input text-center"
              type="number"
              min={0}
              max={23}
              placeholder="00"
              value={form.hour}
              onChange={(e) => onChange('hour', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </label>
          <label className="grid gap-1 col-span-3 sm:col-span-2">
            <span className="typ-caption text-muted">Минуты</span>
            <input
              className="input text-center"
              type="number"
              min={0}
              max={59}
              placeholder="00"
              value={form.minute}
              onChange={(e) => onChange('minute', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </label>
          <div className="col-span-12 sm:col-span-3 flex justify-end">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="h-[46px] w-[46px] rounded-xl bg-surface border border-gray-200/60 text-on/70 hover:text-on shadow-card focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 transition"
              aria-expanded={showAdvanced}
              aria-label={showAdvanced ? 'Скрыть доп. параметры' : 'Показать доп. параметры'}
            >
              {showAdvanced ? '–' : '+'}
            </button>
          </div>
        </div>

        <label className="grid gap-1">
          <span className="typ-caption text-muted">Место рождения</span>
          <input
            className="input"
            type="text"
            placeholder="Город, страна"
            value={form.place}
            onChange={(e) => onChange('place', e.target.value)}
          />
        </label>

        {showAdvanced && (
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="typ-caption text-muted">Широта</span>
              <input className="input" type="number" step="any" value={form.lat} onChange={(e) => onChange('lat', Number(e.target.value))} />
            </label>
            <label className="grid gap-1">
              <span className="typ-caption text-muted">Долгота</span>
              <input className="input" type="number" step="any" value={form.lon} onChange={(e) => onChange('lon', Number(e.target.value))} />
            </label>
            <label className="grid gap-1 col-span-2">
              <span className="typ-caption text-muted">Часовой пояс (IANA)</span>
              <input className="input" value={form.tz || ''} onChange={(e) => onChange('tz', e.target.value)} placeholder="Europe/Moscow" />
            </label>
            <label className="grid gap-1 col-span-2">
              <span className="typ-caption text-muted">User ID</span>
              <input className="input" value={userId} onChange={(e) => setUserId(e.target.value)} />
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={callFree}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-on text-surface font-semibold shadow-card hover:opacity-95 disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
        >
          Базовая карта
        </button>
        <button
          onClick={callPremium}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-primary text-on font-semibold shadow-card hover:opacity-95 disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
        >
          Полный анализ (Premium)
        </button>
      </div>

      {error && <div className="text-rose-600 typ-caption">{error}</div>}

      {chart && (
        <div className="grid gap-2 p-4 border rounded-xl bg-surface/70">
          <h3 className="font-semibold">Базовая карта</h3>
          <p className="text-sm whitespace-pre-wrap">{chart.summaryText}</p>
          <p className="text-sm">Солнце: {chart.sunSign}</p>
        </div>
      )}

      {daily && (
        <div className="grid gap-2 p-4 border rounded-xl bg-surface/70">
          <h3 className="font-semibold">Дневной гороскоп</h3>
          <p className="text-sm whitespace-pre-wrap">{daily.description}</p>
        </div>
      )}

      {explain && (
        <div className="grid gap-2 p-4 border rounded-xl bg-surface/70">
          <h3 className="font-semibold">Расшифровка ИИ-астролога</h3>
          <p className="text-sm whitespace-pre-wrap">{explain.text}</p>
        </div>
      )}
    </div>
  );
}