import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeChart } from '@/lib/astro/swiss';
import { makeTransits } from '@/lib/horoscope/transit';
import { buildHoroscope } from '@/lib/horoscope/build';
import rules from '@/lib/horoscope/rules.json';

// Простой кеш в памяти для разработки
const cache = new Map<string, { data: any; expires: number }>();

export const dynamic = 'force-dynamic';

const BirthDataSchema = z.object({
  date: z.string(), // 'YYYY-MM-DD'
  time: z.string(), // 'HH:mm'
  tzOffset: z.number(), // часы от UTC
  lat: z.number(),
  lon: z.number(),
  houseSystem: z.enum(['P', 'W']).optional()
});

const RequestSchema = z.object({
  birth: BirthDataSchema,
  userId: z.string() // telegram id или другой идентификатор
});

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key: string, data: any, ttlHours = 6) {
  const expires = Date.now() + (ttlHours * 60 * 60 * 1000);
  cache.set(key, { data, expires });
}

export async function POST(req: NextRequest) {
  try {
    const { birth, userId } = RequestSchema.parse(await req.json());
    
    // Кеш-ключ на день
    const today = new Date().toISOString().slice(0, 10);
    const cacheKey = `full:${userId}:${today}`;
    
    // Проверяем кеш
    const cached = getCachedData(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Вычисляем натальный гороскоп
    const natal = await computeChart(birth);
    
    // Преобразуем в формат для транзитов
    const natalChart = {
      planets: natal.planets,
      houses: natal.houses,
      jdUT: natal.jdUT
    };

    // Вычисляем транзиты
    const transitResult = await makeTransits(natalChart);
    
    // Собираем полный гороскоп
    const fullHoroscope = buildHoroscope(natalChart, transitResult, rules);

    // Кешируем результат
    setCachedData(cacheKey, fullHoroscope, 6);

    return NextResponse.json(fullHoroscope);
    
  } catch (error) {
    console.error('Full horoscope error:', error);
    const message = error instanceof Error ? error.message : 'Horoscope computation failed';
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 400 });
  }
}