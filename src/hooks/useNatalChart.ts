// Хук для работы с натальной картой

import { useState, useEffect, useCallback } from 'react';
import type { BirthData, ChartData } from '../../lib/astro/types';

export function useNatalChart() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateChart = useCallback(async (birthData: BirthData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/natal/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birth: birthData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при расчёте карты');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Неизвестная ошибка');
      }

      setChartData(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChart = useCallback(() => {
    setChartData(null);
    setError(null);
  }, []);

  // Загружаем карту из localStorage при инициализации
  useEffect(() => {
    const savedChart = localStorage.getItem('natalChart');
    if (savedChart) {
      try {
        const parsed = JSON.parse(savedChart);
        setChartData(parsed);
      } catch (err) {
        console.error('Ошибка при загрузке сохранённой карты:', err);
      }
    }
  }, []);

  // Сохраняем карту в localStorage при изменении
  useEffect(() => {
    if (chartData) {
      localStorage.setItem('natalChart', JSON.stringify(chartData));
    }
  }, [chartData]);

  return {
    chartData,
    loading,
    error,
    calculateChart,
    clearChart
  };
}