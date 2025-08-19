import { getEphemerisAdapter, signFromLongitude, type ComputeInput } from '../../../lib/ephemeris/adapter';
import type { TransitHit, AspectType } from './types';

// Веса планет
const wPlanet = { 
  Sun: 1.2, Moon: 1.1, Mercury: 0.8, Venus: 0.9, Mars: 1.0, 
  Jupiter: 1.1, Saturn: 1.05, Uranus: 0.9, Neptune: 0.85, Pluto: 0.95 
};

// Веса аспектов
const wType = { 
  conjunction: 1.0, opposition: 0.95, trine: 0.8, square: 0.9, sextile: 0.7 
};

// Веса тел-получателей
const wTo = { 
  Sun: 1.2, Moon: 1.0, Mercury: 0.8, Venus: 0.9, Mars: 1.0, 
  ASC: 1.1, MC: 1.1, default: 0.8 
};

// Веса домов (index 0 не используется, 1-12)
const wHouse = [0, 1.0, 0.9, 0.95, 1.05, 1.1, 1.05, 0.95, 1.0, 1.1, 1.0, 0.95, 0.9];

// Орбы для аспектов
const orbByType = { conjunction: 6, opposition: 6, trine: 5, square: 5, sextile: 4 };

// Базовые углы аспектов
const baseAngles = { conjunction: 0, sextile: 60, square: 90, trine: 120, opposition: 180 };

// Нормализация угла 0-360
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

// Вычисление аспекта между двумя долготами
function aspect(a: number, b: number): { type: AspectType, orb: number } | null {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  const actualDiff = Math.min(diff, 360 - diff);

  for (const [aspectType, baseAngle] of Object.entries(baseAngles)) {
    const maxOrb = orbByType[aspectType as AspectType];
    const orb = Math.abs(actualDiff - baseAngle);
    
    if (orb <= maxOrb) {
      return { type: aspectType as AspectType, orb };
    }
  }
  
  return null;
}

// Определение дома по долготе
function houseOf(lon: number, cusps: number[]): number {
  const L = normalizeAngle(lon);
  for (let i = 0; i < 12; i++) {
    const a = normalizeAngle(cusps[i] ?? 0);
    const b = normalizeAngle(cusps[(i + 1) % 12] ?? 0);
    
    if (a <= b) {
      if (L >= a && L < b) return i + 1;
    } else {
      if (L >= a || L < b) return i + 1;
    }
  }
  return 12;
}

// Получение фазы Луны по долготе Солнца и Луны
function getMoonPhase(sunLon: number, moonLon: number): string {
  const angle = normalizeAngle(moonLon - sunLon);
  
  if (angle < 45 || angle >= 315) return 'Новолуние';
  if (angle >= 45 && angle < 135) return 'Растущая Луна';
  if (angle >= 135 && angle < 225) return 'Полнолуние';
  return 'Убывающая Луна';
}

export type NatalChart = {
  planets: Array<{ key: string; lon: number; lat: number; speed: number; sign: string; house: number }>;
  houses: { cusps: number[]; asc: number; mc: number };
  jdUT: number;
};

export type TransitResult = {
  hits: TransitHit[];
  moon: {
    sign: string;
    phase: string;
    house?: number;
    tip: string;
  };
};

export async function makeTransits(natal: NatalChart): Promise<TransitResult> {
  // Получаем текущие транзиты
  const now = new Date();
  const computeInput: ComputeInput = {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
    day: now.getUTCDate(),
    hour: now.getUTCHours(),
    minute: now.getUTCMinutes(),
    second: now.getUTCSeconds(),
    lat: 0, // Транзиты не зависят от местоположения
    lon: 0,
    houseSystem: 'P'
  };

  const adapter = await getEphemerisAdapter();
  const transitResult = await adapter.compute(computeInput);

  const hits: TransitHit[] = [];
  
  // Планеты для проверки транзитов
  const transitPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  
  // Натальные тела (планеты + углы)
  const natalBodies = [
    ...natal.planets.map(p => ({ key: p.key, lon: p.lon })),
    { key: 'ASC', lon: natal.houses.asc },
    { key: 'MC', lon: natal.houses.mc }
  ];

  // Проверяем аспекты транзитных планет к натальным телам
  for (const trPlanet of transitPlanets) {
    const trPosition = transitResult.planets.find(p => p.name === trPlanet);
    if (!trPosition) continue;

    for (const natalBody of natalBodies) {
      const aspectResult = aspect(trPosition.lon, natalBody.lon);
      if (!aspectResult) continue;

      const house = houseOf(trPosition.lon, natal.houses.cusps);
      
      // Вычисляем вес/балл
      const planetWeight = wPlanet[trPlanet as keyof typeof wPlanet] || 0.8;
      const typeWeight = wType[aspectResult.type];
      const toWeight = wTo[natalBody.key as keyof typeof wTo] || wTo.default;
      const houseWeight = wHouse[house] || 1.0;
      const orbWeight = 1 - aspectResult.orb / orbByType[aspectResult.type];
      
      const score = planetWeight * typeWeight * toWeight * houseWeight * orbWeight;

      hits.push({
        trPlanet,
        toBody: natalBody.key,
        type: aspectResult.type,
        orb: aspectResult.orb,
        score,
        house
      });
    }
  }

  // Сортируем по убыванию баллов и берем топ-30
  hits.sort((a, b) => b.score - a.score);
  const topHits = hits.slice(0, 30);

  // Информация о Луне
  const moonPosition = transitResult.planets.find(p => p.name === 'Moon');
  const sunPosition = transitResult.planets.find(p => p.name === 'Sun');
  
  const moonSign = moonPosition ? signFromLongitude(moonPosition.lon) : 'Aries';
  const moonPhase = (moonPosition && sunPosition) ? 
    getMoonPhase(sunPosition.lon, moonPosition.lon) : 'Новолуние';
  const moonHouse = moonPosition ? houseOf(moonPosition.lon, natal.houses.cusps) : undefined;
  
  // Простой совет по фазе Луны
  const phaseTips = {
    'Новолуние': 'Время новых начинаний и планирования',
    'Растущая Луна': 'Развивайте начатое, накапливайте ресурсы',
    'Полнолуние': 'Завершайте проекты, принимайте важные решения',
    'Убывающая Луна': 'Отпускайте лишнее, очищайтесь от ненужного'
  };

  return {
    hits: topHits,
    moon: {
      sign: moonSign,
      phase: moonPhase,
      house: moonHouse,
      tip: phaseTips[moonPhase as keyof typeof phaseTips] || 'Следуйте ритмам природы'
    }
  };
}