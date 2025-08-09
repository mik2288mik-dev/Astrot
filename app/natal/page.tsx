"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import { useTelegram } from '@/app/telegram-context';
import { useState } from 'react';
import { impactLight, selectionChanged } from '@/lib/haptics';

export default function NatalFormPage() {
  const { user } = useTelegram();
  const [name, setName] = useState<string>(user?.first_name || '');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [timeUnknown, setTimeUnknown] = useState<boolean>(false);
  const [place, setPlace] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  function inputHash() {
    try {
      const canonical = JSON.stringify({ name, date, time: timeUnknown ? undefined : time, place, timeUnknown });
      const enc = new TextEncoder().encode(canonical);
      // simple djb2
      let h = 5381;
      for (let i = 0; i < enc.length; i++) h = ((h << 5) + h) + enc[i];
      return `natal:${h >>> 0}`;
    } catch {
      return 'natal:unknown';
    }
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const key = inputHash();
      const cachedRaw = sessionStorage.getItem(key);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        setResult(cached);
        impactLight();
        return;
      }
      const payload = { name, birthDate: date, birthTime: time, timeUnknown, place, language: 'ru', idempotencyKey: key };
      const res = await fetch('/api/natal-chart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.error?.message || 'Ошибка');
      setResult(json.data);
      sessionStorage.setItem(key, JSON.stringify(json.data));
      impactLight();
    } catch (e: any) {
      setError(e.message || 'Ошибка');
      selectionChanged();
    } finally {
      setLoading(false);
    }
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
              <div className="flex gap-3 items-center">
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={timeUnknown} className="h-12 rounded-md border border-black/10 px-3 bg-white focus:outline-none focus-visible:shadow-focus flex-1" />
                <label className="flex items-center gap-2 text-sm text-on/70">
                  <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} />
                  <span>Время неизвестно</span>
                </label>
              </div>
              {timeUnknown && (
                <p className="typ-caption text-amber-700/90">Будет использован полдень по месту рождения, точность ограничена.</p>
              )}
            </label>
            <label className="grid gap-2">
              <span className="typ-caption text-on/70">Место рождения</span>
              <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Город, страна" className="h-12 rounded-md border border-black/10 px-3 bg-white focus:outline-none focus-visible:shadow-focus" />
            </label>
            <Tap className="mt-2 h-12 rounded-md pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">{loading ? 'Загрузка…' : 'Отправить'}</Tap>
            {error && <p className="mt-2 text-rose-700">{error}</p>}
          </form>
          {result && (
            <div className="mt-6 grid gap-4">
              <div className="glass p-4">
                <h2 className="typ-h2 mb-2">Превью</h2>
                <p className="typ-body">Солнце: {result?.summary?.sun || '—'}</p>
                <p className="typ-body">Луна: {result?.summary?.moon || '—'}</p>
                <p className="typ-body">ASC: {result?.summary?.ascendant || '—'}</p>
                {result?.metadata?.warnings?.length ? (
                  <p className="typ-caption text-amber-700/90 mt-2">Предупреждения: {result.metadata.warnings.join(', ')}</p>
                ) : null}
              </div>

              <div className="glass p-4 grid gap-3">
                <h3 className="typ-h3">Полная версия</h3>
                {result?.interpretations?.personality?.length ? (
                  <section>
                    <h4 className="font-semibold mb-1">Личностные черты</h4>
                    <div className="grid gap-2">
                      {result.interpretations.personality.map((p: string, i: number) => (
                        <p key={i} className="typ-body text-on/80">{p}</p>
                      ))}
                    </div>
                  </section>
                ) : null}

                {result?.interpretations?.strengths?.length ? (
                  <section>
                    <h4 className="font-semibold mb-1">Сильные стороны</h4>
                    <div className="grid gap-2">
                      {result.interpretations.strengths.map((p: string, i: number) => (
                        <p key={i} className="typ-body text-on/80">{p}</p>
                      ))}
                    </div>
                  </section>
                ) : null}

                {result?.interpretations?.compatibility?.length ? (
                  <section>
                    <h4 className="font-semibold mb-1">Совместимость</h4>
                    <div className="grid gap-2">
                      {result.interpretations.compatibility.map((p: string, i: number) => (
                        <p key={i} className="typ-body text-on/80">{p}</p>
                      ))}
                    </div>
                  </section>
                ) : null}

                {result?.interpretations?.transits?.length ? (
                  <section>
                    <h4 className="font-semibold mb-1">Транзиты</h4>
                    <div className="grid gap-2">
                      {result.interpretations.transits.map((p: string, i: number) => (
                        <p key={i} className="typ-body text-on/80">{p}</p>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </RouteTransition>
    </Screen>
  );
}