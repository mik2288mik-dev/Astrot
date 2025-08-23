import type { BirthData } from './types';
import type { NatalResult } from '../api/natal';

export interface SavedChart {
  id: string;
  input: BirthData;
  result: NatalResult;
  createdAt: string;
  isActive?: boolean;
}

// Ключи localStorage
const SAVED_CHARTS_KEY = 'savedCharts';
const ACTIVE_CHART_KEY = 'activeChart';

export function getSavedCharts(): SavedChart[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SAVED_CHARTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChart(input: BirthData, result: NatalResult): SavedChart {
  const chart: SavedChart = {
    id: Date.now().toString(),
    input,
    result,
    createdAt: new Date().toISOString()
  };
  
  const charts = getSavedCharts();
  charts.unshift(chart); // Добавляем в начало
  
  // Ограничиваем до 10 карт
  if (charts.length > 10) {
    charts.splice(10);
  }
  
  localStorage.setItem(SAVED_CHARTS_KEY, JSON.stringify(charts));
  return chart;
}

export function getActiveChart(): SavedChart | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(ACTIVE_CHART_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setActiveChart(chart: SavedChart | null): void {
  if (chart) {
    localStorage.setItem(ACTIVE_CHART_KEY, JSON.stringify(chart));
  } else {
    localStorage.removeItem(ACTIVE_CHART_KEY);
  }
}

export function getLastSavedChart(): SavedChart | null {
  const charts = getSavedCharts();
  return charts.length > 0 ? charts[0] || null : null;
}

export function deleteChart(id: string): void {
  const charts = getSavedCharts().filter(chart => chart.id !== id);
  localStorage.setItem(SAVED_CHARTS_KEY, JSON.stringify(charts));
  
  // Если удаляем активную карту, сбрасываем активность
  const activeChart = getActiveChart();
  if (activeChart?.id === id) {
    setActiveChart(null);
  }
}