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

export default function Page() {
  const [hasData] = useState(false);
  const text = useMemo(() => (hasData ? 'Обновить данные' : 'Ввести данные рождения'), [hasData]);

  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<ChartView | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');

  async function getNatalReading(input: Record<string, unknown>) {
    const chartRes = await fetch('/api/chart', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input)
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
    setLoading(true);
    try {
      const { chart, text } = await getNatalReading({
        date: '1995-07-14',
        time: '10:30',
        tzOffset: 3,
        lat: 55.7558,
        lon: 37.6173,
        houseSystem: 'P'
      });
      setChart(chart);
      setInterpretation(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MainButton text={text} visible />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
        <Card>
          <h2 className="text-lg font-semibold">Онбординг данных рождения</h2>
          <p className="text-sm text-astrot-muted">Заполните дату, время и место рождения.</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Натальная карта</h2>
            <Button onClick={run} disabled={loading}>
              {loading ? 'Считаю…' : 'Рассчитать и интерпретировать'}
            </Button>
          </div>

          {chart && (
            <div className="mt-3">
              <h3 className="font-medium">Большая тройка</h3>
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
            </div>
          )}

          {interpretation && (
            <div className="mt-3 whitespace-pre-wrap">
              <h3 className="font-medium mb-1">Интерпретация</h3>
              {interpretation}
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
}