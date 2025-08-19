// Адаптер для расчёта натальной карты с использованием Swiss Ephemeris

import type { ComputeInput, ComputeOutput } from '@/lib/ephemeris/adapter';
import { computeNatalChart } from '@/lib/natal';
import { signFromLongitude } from '@/lib/ephemeris/adapter';
import type { 
  BirthData, 
  ChartData, 
  PlanetPos, 
  HouseCusp, 
  Aspect, 
  ZodiacSign,
  PlanetName
} from './types';
import { ZODIAC_SIGNS, PLANET_SYMBOLS, ASPECT_SYMBOLS } from './types';

/**
 * Основная функция для расчёта натальной карты
 * Преобразует BirthData в ChartData используя Swiss Ephemeris
 */
export async function calculateNatalChart(birthData: BirthData): Promise<ChartData> {
  // Преобразуем наши типы в формат для Swiss Ephemeris
  const computeInput: ComputeInput = {
    year: birthData.year,
    month: birthData.month,
    day: birthData.day,
    hour: birthData.hour,
    minute: birthData.minute,
    second: birthData.second || 0,
    lat: birthData.lat,
    lon: birthData.lon,
    tz: birthData.tz || 'UTC',
    houseSystem: 'P' // Placidus по умолчанию
  };

  // Получаем сырые данные от Swiss Ephemeris
  const rawData: ComputeOutput = await computeNatalChart(computeInput);

  // Преобразуем планеты в наш формат
  const planets: PlanetPos[] = rawData.planets.map(planet => {
    const sign = signFromLongitude(planet.lon);
    const signDegree = (planet.lon % 30 + 30) % 30;
    const symbol = PLANET_SYMBOLS[planet.name as PlanetName] || planet.name;

    return {
      name: planet.name,
      symbol,
      lon: planet.lon,
      lat: planet.lat,
      ...(planet.dist !== undefined && { dist: planet.dist }),
      sign,
      signDegree,
      isRetrograde: false // TODO: добавить расчёт ретроградности
    };
  });

  // Преобразуем дома в наш формат
  const houses = rawData.houses ? {
    asc: rawData.houses.asc,
    mc: rawData.houses.mc,
    cusps: rawData.houses.cusps.map((degree, index) => ({
      number: index + 1,
      degree,
      sign: signFromLongitude(degree),
      signDegree: (degree % 30 + 30) % 30
    })),
    system: 'Placidus'
  } : {
    asc: 0,
    mc: 0,
    cusps: [] as HouseCusp[],
    system: 'Placidus'
  };

  // Назначаем планетам дома
  planets.forEach(planet => {
    planet.house = findHouseForPlanet(planet.lon, houses.cusps);
  });

  // Преобразуем аспекты в наш формат
  const aspects: Aspect[] = rawData.aspects.map(aspect => ({
    planet1: aspect.a,
    planet2: aspect.b,
    type: aspect.type,
    angle: aspect.exact,
    orb: aspect.orb,
    applying: true, // TODO: добавить расчёт сходящихся/расходящихся
    strength: getAspectStrength(aspect.orb)
  }));

  // Находим основные знаки
  const sunPlanet = planets.find(p => p.name === 'Sun');
  const moonPlanet = planets.find(p => p.name === 'Moon');
  const sunSign = sunPlanet?.sign || 'Aries';
  const moonSign = moonPlanet?.sign || 'Aries';
  const risingSign = signFromLongitude(houses.asc);

  // Вычисляем доминирующие элементы и кресты
  const elements = calculateElements(planets);
  const qualities = calculateQualities(planets);

  return {
    birthData,
    planets,
    houses,
    aspects,
    julianDay: rawData.jdUt,
    siderealTime: 0, // TODO: добавить расчёт звёздного времени
    sunSign,
    moonSign,
    risingSign,
    elements,
    qualities
  };
}

/**
 * Определяет в каком доме находится планета по её долготе
 */
function findHouseForPlanet(planetLon: number, cusps: HouseCusp[]): number {
  if (cusps.length === 0) return 1;

  for (let i = 0; i < cusps.length; i++) {
    const currentCuspObj = cusps[i];
    const nextCuspObj = cusps[(i + 1) % cusps.length];
    
    if (!currentCuspObj || !nextCuspObj) continue;
    
    const currentCusp = currentCuspObj.degree;
    const nextCusp = nextCuspObj.degree;
    
    // Обрабатываем переход через 0°
    if (currentCusp > nextCusp) {
      if (planetLon >= currentCusp || planetLon < nextCusp) {
        return i + 1;
      }
    } else {
      if (planetLon >= currentCusp && planetLon < nextCusp) {
        return i + 1;
      }
    }
  }
  
  return 1; // fallback
}

/**
 * Определяет силу аспекта по орбу
 */
function getAspectStrength(orb: number): 'tight' | 'moderate' | 'wide' {
  if (orb <= 2) return 'tight';
  if (orb <= 4) return 'moderate';
  return 'wide';
}

/**
 * Вычисляет распределение планет по элементам
 */
function calculateElements(planets: PlanetPos[]) {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  
  planets.forEach(planet => {
    const sign = planet.sign;
    if (['Aries', 'Leo', 'Sagittarius'].includes(sign)) {
      elements.fire++;
    } else if (['Taurus', 'Virgo', 'Capricorn'].includes(sign)) {
      elements.earth++;
    } else if (['Gemini', 'Libra', 'Aquarius'].includes(sign)) {
      elements.air++;
    } else if (['Cancer', 'Scorpio', 'Pisces'].includes(sign)) {
      elements.water++;
    }
  });
  
  return elements;
}

/**
 * Вычисляет распределение планет по крестам
 */
function calculateQualities(planets: PlanetPos[]) {
  const qualities = { cardinal: 0, fixed: 0, mutable: 0 };
  
  planets.forEach(planet => {
    const sign = planet.sign;
    if (['Aries', 'Cancer', 'Libra', 'Capricorn'].includes(sign)) {
      qualities.cardinal++;
    } else if (['Taurus', 'Leo', 'Scorpio', 'Aquarius'].includes(sign)) {
      qualities.fixed++;
    } else if (['Gemini', 'Virgo', 'Sagittarius', 'Pisces'].includes(sign)) {
      qualities.mutable++;
    }
  });
  
  return qualities;
}

/**
 * Вспомогательная функция для преобразования градусов в читаемый формат
 */
export function formatDegree(degree: number): string {
  const sign = signFromLongitude(degree);
  const signDegree = Math.floor((degree % 30 + 30) % 30);
  const minutes = Math.floor(((degree % 30 + 30) % 30 - signDegree) * 60);
  return `${signDegree}°${minutes.toString().padStart(2, '0')}'`;
}

/**
 * Получает символ знака зодиака
 */
export function getSignSymbol(sign: string): string {
  const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  };
  return signSymbols[sign] || sign;
}