"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import NatalForm from '@/components/NatalForm';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { ChartData } from '@/components/chart/ChartViewport';

const ChartViewport = dynamic(() => import('@/components/chart/ChartViewport'), { ssr: false });

export default function NatalFormPage() {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  // Подписываемся на кастомное событие от формы, чтобы отрисовать карту данными API
  useEffect(() => {
    function onChart(e: any) {
      const detail = e.detail as any;
      if (!detail) return;
      const mapped: ChartData = {
        jdUt: Number(detail.jdUt || detail.jd || Date.now()),
        tz: String(detail.tz || 'UTC'),
        planets: (detail.planets || []).map((p: any) => ({ name: String(p.name), lon: Number(p.lon ?? p.longitude ?? 0), retro: Boolean(p.retro) })),
        houses: detail.houses ? { asc: Number(detail.houses.asc), mc: Number(detail.houses.mc), cusps: detail.houses.cusps.map((n: any) => Number(n)) } : null,
        aspects: Array.isArray(detail.aspects) ? detail.aspects.map((a: any) => ({ a: String(a.a), b: String(a.b), type: String(a.type), orb: Number(a.orb ?? 0) })) : []
      };
      setChartData(mapped);
    }
    window.addEventListener('astrot:chart-ready', onChart);
    return () => window.removeEventListener('astrot:chart-ready', onChart);
  }, []);

  return (
    <Screen bg="home">
      <RouteTransition routeKey="natal-module">
        <div className="min-h-[70dvh] flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-xl grid gap-4">
            <div className="glass p-6 sm:p-8 grid gap-4">
              <h1 className="typ-h1 flex items-center gap-2">
                <Image src="/logo.png" alt="" width={18} height={18} className="opacity-70 grayscale" />
                Полная карта
              </h1>
              <p className="typ-body text-on/80">
                Перед тобой карта, которая отражает твои сильные и слабые стороны, скрытые таланты и жизненные вызовы. Используй её как компас для принятия важных решений.
              </p>
              <NatalForm />
              <div className="mt-2 grid grid-cols-2 gap-2 typ-caption text-on/70">
                <div className="bg-white/60 rounded-md p-3 border border-gray-200/60">Личностные черты</div>
                <div className="bg-white/60 rounded-md p-3 border border-gray-200/60">Таланты и ресурсы</div>
                <div className="bg-white/60 rounded-md p-3 border border-gray-200/60">Жизненные вызовы</div>
                <div className="bg-white/60 rounded-md p-3 border border-gray-200/60">Транзиты и цикл года</div>
              </div>
            </div>

            {chartData && (
              <ChartViewport data={chartData} />
            )}
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}