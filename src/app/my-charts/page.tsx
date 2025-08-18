'use client';

import React, { useState, useEffect } from 'react';
import BirthHeader from '@/components/birth/BirthHeader';
import { getSavedCharts, setActiveChart, deleteChart } from '../../../lib/birth/storage';
import type { SavedChart } from '../../../lib/birth/storage';
import { TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function MyChartsPage() {
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [activeChartId, setActiveChartId] = useState<string | null>(null);

  useEffect(() => {
    const savedCharts = getSavedCharts();
    setCharts(savedCharts);
    
    // Определяем активную карту
    const activeChart = savedCharts.find(c => c.isActive);
    setActiveChartId(activeChart?.id || null);
  }, []);

  const handleSetActive = (chart: SavedChart) => {
    setActiveChart(chart);
    setActiveChartId(chart.id);
    
    // Обновляем локальное состояние
    setCharts(prevCharts => 
      prevCharts.map(c => ({
        ...c,
        isActive: c.id === chart.id
      }))
    );
  };

  const handleDelete = (chartId: string) => {
    deleteChart(chartId);
    setCharts(prevCharts => prevCharts.filter(c => c.id !== chartId));
    
    if (activeChartId === chartId) {
      setActiveChartId(null);
    }
  };

  return (
    <div className="page-wrapper animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col">
      {/* Заголовок */}
      <section className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Мои карты
        </h1>
        <p className="text-neutral-600">
          Сохранённые натальные карты
        </p>
      </section>

      {/* Список карт */}
      <section className="flex-1">
        {charts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">
              Нет сохранённых карт
            </h3>
            <p className="text-neutral-600 mb-6">
              Рассчитайте и сохраните первую натальную карту
            </p>
            <button
              onClick={() => window.location.href = '/natal'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3 px-6 rounded-2xl hover:shadow-lg transition-all"
            >
              Рассчитать карту
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className={`p-4 rounded-2xl border transition-all ${
                  chart.id === activeChartId
                    ? 'bg-purple-50 border-purple-200'
                    : 'bg-white border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <BirthHeader birth={chart.input} mini={true} />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSetActive(chart)}
                      className={`p-2 rounded-lg transition-colors ${
                        chart.id === activeChartId
                          ? 'text-purple-600 bg-purple-100'
                          : 'text-neutral-400 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                      title={chart.id === activeChartId ? 'Активная карта' : 'Сделать активной'}
                    >
                      {chart.id === activeChartId ? (
                        <StarIconSolid className="w-5 h-5" />
                      ) : (
                        <StarIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(chart.id)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Удалить карту"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-neutral-600 mb-3">
                  Создана: {new Date(chart.createdAt).toLocaleDateString('ru-RU')}
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    ☀️ {chart.result.big3.sun.sign}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    🌙 {chart.result.big3.moon.sign}
                  </span>
                  {chart.result.big3.asc.sign && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      ↗️ {chart.result.big3.asc.sign}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Кнопка добавить карту */}
      {charts.length > 0 && (
        <section className="mt-6">
          <button
            onClick={() => window.location.href = '/natal'}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-3 rounded-2xl transition-colors"
          >
            + Рассчитать новую карту
          </button>
        </section>
      )}
    </div>
  );
}