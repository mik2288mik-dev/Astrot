'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from '@/hooks/useTelegram';

interface NatalChart {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  pinned: boolean;
  inputData: any;
  chartData: any;
  timeUnknown: boolean;
  houseSystem: string;
  createdAt: string;
  updatedAt: string;
  interpretations?: Array<{
    id: string;
    type: string;
    createdAt: string;
  }>;
}

export function useSupabaseCharts() {
  const { user: telegramUser, initData } = useTelegram();
  const [charts, setCharts] = useState<NatalChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка карт
  const fetchCharts = useCallback(async () => {
    if (!telegramUser || !initData) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/charts', {
        headers: {
          'X-Telegram-Init-Data': initData,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch charts');
      }

      const data = await response.json();
      setCharts(data.charts || []);
    } catch (err) {
      console.error('Error fetching charts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [telegramUser, initData]);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  // Создание новой карты
  const createChart = async (chartData: {
    title?: string;
    description?: string;
    inputData: any;
    chartData: any;
    timeUnknown?: boolean;
    houseSystem?: string;
  }) => {
    try {
      setError(null);

      const response = await fetch('/api/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData || '',
        },
        body: JSON.stringify(chartData),
      });

      if (!response.ok) {
        throw new Error('Failed to create chart');
      }

      const data = await response.json();
      setCharts(prev => [data.chart, ...prev]);
      return data.chart;
    } catch (err) {
      console.error('Error creating chart:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  // Обновление карты
  const updateChart = async (id: string, updates: {
    title?: string;
    description?: string;
    pinned?: boolean;
  }) => {
    try {
      setError(null);

      const response = await fetch(`/api/charts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData || '',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update chart');
      }

      const data = await response.json();
      setCharts(prev => prev.map(chart => 
        chart.id === id ? data.chart : chart
      ));
      return data.chart;
    } catch (err) {
      console.error('Error updating chart:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  // Удаление карты
  const deleteChart = async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/charts/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Telegram-Init-Data': initData || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete chart');
      }

      setCharts(prev => prev.filter(chart => chart.id !== id));
    } catch (err) {
      console.error('Error deleting chart:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  // Закрепление карты
  const togglePin = async (id: string) => {
    const chart = charts.find(c => c.id === id);
    if (!chart) return;

    return updateChart(id, { pinned: !chart.pinned });
  };

  // Получение закрепленной карты
  const getPinnedChart = () => {
    return charts.find(chart => chart.pinned);
  };

  return {
    charts,
    loading,
    error,
    createChart,
    updateChart,
    deleteChart,
    togglePin,
    getPinnedChart,
    refetch: fetchCharts,
  };
}