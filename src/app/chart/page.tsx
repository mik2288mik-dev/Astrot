"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MainButton } from '@/components/telegram/main-button';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type PlanetView = { key: string; sign: string; house?: number; lon: number };

type ChartView = {
  bigThree: { Sun: string; Moon: string; Ascendant: string };
  planets: PlanetView[];
};

type ResolveResult = {
  name: string;
  date: string;
  time: string;
  lat: number;
  lon: number;
  tz?: string;
  tzOffset: number;
  address?: string;
};

export default function Page() {
  const [hasData] = useState(false);
  const text = useMemo(() => (hasData ? 'Обновить данные' : 'Ввести данные рождения'), [hasData]);

  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<ChartView | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');

  const [name, setName] = useState('Алексей');
  const [birthDate, setBirthDate] = useState('1995-07-14');
  const [birthTime, setBirthTime] = useState('10:30');
  const [place, setPlace] = useState('Москва');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resolved, setResolved] = useState<ResolveResult | null>(null);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Введите имя';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) errs.birthDate = 'Формат YYYY-MM-DD';
    if (!/^\d{2}:\d{2}$/.test(birthTime)) errs.birthTime = 'Формат HH:mm';
    if (!place.trim()) errs.place = 'Укажите место рождения';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function resolvePlace(): Promise<ResolveResult> {
    const res = await fetch('/api/resolve', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, birthDate, birthTime, place })
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Resolve failed');
    return json.resolved as ResolveResult;
  }

  async function getNatalReading(input: { date: string; time: string; tzOffset: number; lat: number; lon: number; }) {
    const chartRes = await fetch('/api/chart', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...input, houseSystem: 'P' })
    });
    const chartJson = (await chartRes.json()) as { chart: ChartView };
    const readRes = await fetch('/api/interpret', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chart: chartJson.chart, locale: 'ru', tone: 'friendly' })
    });
    const readJson = (await readRes.json()) as { text: string };
    return { chart: chartJson.chart, text: readJson.text };
  }

  async function run() {
    if (!validate()) return;
    setLoading(true);
    setInterpretation('');
    setChart(null);
    try {
      const r = await resolvePlace();
      setResolved(r);
      const { chart, text } = await getNatalReading({
        date: r.date,
        time: r.time,
        tzOffset: r.tzOffset,
        lat: r.lat,
        lon: r.lon
      });
      setChart(chart);
      setInterpretation(text);
    } catch (e) {
      setErrors((prev) => ({ ...prev, form: e instanceof Error ? e.message : 'Ошибка' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MainButton text={text} visible />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Данные рождения</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm mb-1">Имя</label>
              <input
                className="w-full rounded-lg border border-[rgb(var(--astrot-border))] bg-transparent px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Дата рождения</label>
                <input
                  className="w-full rounded-lg border border-[rgb(var(--astrot-border))] bg-transparent px-3 py-2 text-sm"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
                {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">Время рождения</label>
                <input
                  className="w-full rounded-lg border border-[rgb(var(--astrot-border))] bg-transparent px-3 py-2 text-sm"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  placeholder="HH:mm"
                />
                {errors.birthTime && <p className="text-xs text-red-500 mt-1">{errors.birthTime}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Место рождения</label>
              <input
                className="w-full rounded-lg border border-[rgb(var(--astrot-border))] bg-transparent px-3 py-2 text-sm"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Город, страна"
              />
              {errors.place && <p className="text-xs text-red-500 mt-1">{errors.place}</p>}
            </div>
            {resolved && (
              <div className="text-xs text-astrot-muted">
                Определено: {resolved.address || '—'} {resolved.tz ? `(часовой пояс: ${resolved.tz})` : ''}
              </div>
            )}
            {errors.form && <div className="text-xs text-red-500">{errors.form}</div>}
            <div className="flex justify-end">
              <Button onClick={run} disabled={loading}>
                {loading ? 'Считаю…' : 'Рассчитать и интерпретировать'}
              </Button>
            </div>
          </div>
        </Card>

        {chart && (
          <Card>
            <h3 className="text-lg font-semibold">Большая тройка</h3>
            <p className="text-sm">Солнце: <b>{chart.bigThree.Sun}</b></p>
            <p className="text-sm">Луна: <b>{chart.bigThree.Moon}</b></p>
            <p className="text-sm">Асцендент: <b>{chart.bigThree.Ascendant}</b></p>

            <h4 className="mt-2 font-medium">Планеты</h4>
            <ul className="list-disc pl-4">
              {chart.planets.map((p) => (
                <li key={p.key} className="text-sm">
                  {p.key}: {p.sign} — дом {p.house} ({p.lon.toFixed(2)}°)
                </li>
              ))}
            </ul>
          </Card>
        )}

        {interpretation && (
          <Card>
            <h3 className="text-lg font-semibold mb-1">Интерпретация</h3>
            <div className="whitespace-pre-wrap text-sm">{interpretation}</div>
          </Card>
        )}
      </motion.div>
    </>
  );
}