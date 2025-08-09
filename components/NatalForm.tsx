"use client";
import { useEffect, useMemo, useRef, useState } from 'react';

type GeoSuggestion = {
  latitude: number;
  longitude: number;
  resolvedAddress?: string;
  timezone?: string;
};

export default function NatalForm() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(''); // YYYY-MM-DD
  const [birthTime, setBirthTime] = useState(''); // HH:MM

  const [placeQuery, setPlaceQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<GeoSuggestion | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chart, setChart] = useState<any | null>(null);
  const [daily, setDaily] = useState<any | null>(null);
  const [explain, setExplain] = useState<any | null>(null);

  const [userId, setUserId] = useState('demo-user');

  const suggTimer = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setShowSug(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Debounced fetch for autocomplete
  useEffect(() => {
    if (!placeQuery || placeQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    if (suggTimer.current) window.clearTimeout(suggTimer.current);
    suggTimer.current = window.setTimeout(async () => {
      try {
        const url = `/api/geocode?q=${encodeURIComponent(placeQuery)}&limit=5`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        const results: GeoSuggestion[] = json?.results || [];
        setSuggestions(results);
        setShowSug(true);
      } catch {
        // ignore
      }
    }, 300);
  }, [placeQuery]);

  function selectSuggestion(s: GeoSuggestion) {
    setSelectedPlace(s);
    setPlaceQuery(s.resolvedAddress || '');
    setShowSug(false);
  }

  const dateParts = useMemo(() => {
    if (!birthDate) return null;
    const [y, m, d] = birthDate.split('-').map((p) => Number(p));
    if (!y || !m || !d) return null;
    return { year: y, month: m, day: d };
  }, [birthDate]);

  const timeParts = useMemo(() => {
    if (!birthTime) return { hour: 0, minute: 0 };
    const [hh, mm] = birthTime.split(':').map((p) => Number(p));
    if (Number.isNaN(hh) || Number.isNaN(mm)) return { hour: 0, minute: 0 };
    return { hour: hh, minute: mm };
  }, [birthTime]);

  async function callFree() {
    setLoading(true); setError(null);
    try {
      if (!name.trim()) throw new Error('Введите имя');
      if (!dateParts) throw new Error('Укажите дату рождения');
      if (!birthTime) throw new Error('Укажите время рождения');
      if (!selectedPlace) throw new Error('Выберите место рождения из списка');

      const payload = {
        year: dateParts.year,
        month: dateParts.month,
        day: dateParts.day,
        hour: timeParts.hour,
        minute: timeParts.minute,
        lat: Number(selectedPlace.latitude),
        lon: Number(selectedPlace.longitude),
        tz: selectedPlace.timezone,
        houseSystem: 'P'
      };

      const res = await fetch('/api/compute-chart', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Ошибка расчета');
      const json = await res.json();
      setChart(json); setDaily(null); setExplain(null);
    } catch (e: any) {
      setError(e.message || 'Ошибка');
    } finally { setLoading(false); }
  }

  async function callPremium() {
    setLoading(true); setError(null);
    try {
      if (!name.trim()) throw new Error('Введите имя');
      if (!dateParts) throw new Error('Укажите дату рождения');
      if (!birthTime) throw new Error('Укажите время рождения');
      if (!selectedPlace) throw new Error('Выберите место рождения из списка');

      const payload = {
        year: dateParts.year,
        month: dateParts.month,
        day: dateParts.day,
        hour: timeParts.hour,
        minute: timeParts.minute,
        lat: Number(selectedPlace.latitude),
        lon: Number(selectedPlace.longitude),
        tz: selectedPlace.timezone,
        houseSystem: 'P',
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
    <div className="grid gap-5">
      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="typ-caption text-muted">Имя</span>
          <input
            className="input"
            type="text"
            placeholder="Иван Иванов"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="typ-caption text-muted">Дата рождения</span>
            <input
              className="input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="typ-caption text-muted">Время рождения</span>
            <input
              className="input"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
            />
          </label>
        </div>

        <div className="grid gap-1" ref={wrapperRef}>
          <span className="typ-caption text-muted">Место рождения</span>
          <div className="relative">
            <input
              className="input"
              type="text"
              placeholder="Город, страна"
              value={placeQuery}
              onChange={(e) => { setPlaceQuery(e.target.value); setSelectedPlace(null); }}
              onFocus={() => suggestions.length && setShowSug(true)}
              autoComplete="off"
            />
            {showSug && suggestions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-200/60 bg-surface shadow-card max-h-60 overflow-auto">
                {suggestions.map((s, idx) => (
                  <button
                    key={`${s.latitude}-${s.longitude}-${idx}`}
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className="w-full text-left px-3 py-2 hover:bg-accent/10"
                  >
                    {s.resolvedAddress}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
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
        <div className="grid gap-2 p-4 border rounded-xl bg-surface/70 animate-polaroid">
          <h3 className="font-semibold text-gradient-soft">Базовая карта</h3>
          <p className="text-sm whitespace-pre-wrap">{chart.summaryText}</p>
          {chart.sunSign && <p className="text-sm">Солнце: {chart.sunSign}</p>}
        </div>
      )}

      {daily && (
        <div className="grid gap-2 p-4 border rounded-xl bg-surface/70 animate-polaroid">
          <h3 className="font-semibold text-gradient-soft">Дневной гороскоп</h3>
          <p className="text-sm whitespace-pre-wrap">{daily.description}</p>
        </div>
      )}

      {explain && (
        <div className="grid gap-2 p-4 border rounded-xl bg-surface/70 animate-polaroid">
          <h3 className="font-semibold text-gradient-soft">Расшифровка ИИ-астролога</h3>
          <p className="text-sm whitespace-pre-wrap">{explain}</p>
        </div>
      )}

      <div className="hidden">
        {/* developer toggle to simulate premium auth if needed */}
        <input value={userId} onChange={(e) => setUserId(e.target.value)} />
      </div>
    </div>
  );
}