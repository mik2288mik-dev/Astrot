import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeChart } from '@/lib/astro/swiss';
import { makeTransits } from '@/lib/horoscope/transit';
import { buildHoroscope } from '@/lib/horoscope/build';
import rules from '@/lib/horoscope/rules.json';
import { generateDebugId, logApiRequest, logApiSuccess, logApiError, withDebugHeaders } from '@/lib/api/logger';
import { MOCK_HOROSCOPE } from '@/lib/api/mocks';
import { composeFriendly } from '@/lib/text/composeFriendly';

// Простой кеш в памяти для разработки
interface CacheEntry {
  data: unknown;
  expires: number;
}
const cache = new Map<string, CacheEntry>();

export const dynamic = 'force-dynamic';

const BirthDataSchema = z.object({
  date: z.string(), // 'YYYY-MM-DD'
  time: z.string().optional(), // 'HH:mm'
  tzOffset: z.number().optional(), // часы от UTC
  lat: z.number().optional(),
  lon: z.number().optional(),
  houseSystem: z.enum(['P', 'W']).optional()
});

const RequestSchema = z.object({
  birth: BirthDataSchema.optional(),
  userId: z.string().optional(), // telegram id или другой идентификатор
  tgId: z.string().optional(),
  date: z.string().optional() // дата для гороскопа
});

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key: string, data: unknown, ttlHours = 6) {
  const expires = Date.now() + (ttlHours * 60 * 60 * 1000);
  cache.set(key, { data, expires });
}

export async function POST(req: NextRequest) {
  const debugId = generateDebugId();
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    logApiRequest('/api/horoscope/full', 'POST', debugId, body);
    
    // Проверяем MOCK_MODE
    if (process.env.MOCK_MODE === 'true') {
      const friendlyMock = composeFriendly(MOCK_HOROSCOPE, { preferredName: 'друг' });
      const response = NextResponse.json(friendlyMock);
      logApiSuccess('/api/horoscope/full', debugId, Date.now() - startTime);
      return withDebugHeaders(response, debugId);
    }
    
    const parsedData = RequestSchema.parse(body);
    const { birth, userId, tgId, date } = parsedData;
    const effectiveUserId = userId || tgId || 'anonymous';
    const targetDate = date || new Date().toISOString().slice(0, 10);
    
    // Если нет birth данных, пытаемся загрузить из профиля
    let birthData = birth;
    if (!birthData && tgId) {
      try {
        const profileRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/profile?tgId=${tgId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.profile?.birthDate) {
            birthData = {
              date: profileData.profile.birthDate,
              time: profileData.profile.birthTime || '12:00',
              lat: profileData.profile.lat || 55.7558,
              lon: profileData.profile.lon || 37.6173,
              tzOffset: profileData.profile.tzOffset || 3
            };
          }
        }
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
    
    // Если всё ещё нет данных, используем дефолты
    if (!birthData) {
      birthData = {
        date: '1990-01-01',
        time: '12:00',
        lat: 55.7558,
        lon: 37.6173,
        tzOffset: 3
      };
    }
    
    // Убеждаемся что все обязательные поля заполнены
    const validBirthData = {
      date: birthData.date,
      time: birthData.time || '12:00',
      lat: birthData.lat || 55.7558,
      lon: birthData.lon || 37.6173,
      tzOffset: birthData.tzOffset || 3,
      houseSystem: birthData.houseSystem || 'P' as const
    };
    
    // Кеш-ключ на день
    const cacheKey = `horoscope:full:${effectiveUserId}:${targetDate}`;
    
    // Проверяем кеш
    const cached = getCachedData(cacheKey);
    if (cached) {
      const response = NextResponse.json(cached);
      logApiSuccess('/api/horoscope/full', debugId, Date.now() - startTime, true);
      return withDebugHeaders(response, debugId, true);
    }

    // Вычисляем натальный гороскоп
    const natal = await computeChart(validBirthData);
    
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

    // Добавляем дату в результат
    const horoscopeWithDate = {
      ...fullHoroscope,
      dateISO: targetDate
    };
    
    // Получаем профиль для персонализации
    let profile = null;
    if (tgId) {
      try {
        const profileRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/profile?tgId=${tgId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          profile = profileData.profile;
        }
      } catch (e) {
        // Игнорируем ошибку профиля
      }
    }
    
    // Преобразуем в дружелюбный формат
    const friendlyHoroscope = composeFriendly(horoscopeWithDate, profile);
    
    // Кешируем результат
    setCachedData(cacheKey, friendlyHoroscope, 6);

    const response = NextResponse.json(friendlyHoroscope);
    logApiSuccess('/api/horoscope/full', debugId, Date.now() - startTime);
    return withDebugHeaders(response, debugId);
    
  } catch (error) {
    logApiError('/api/horoscope/full', debugId, error, Date.now() - startTime);
    
    // Если включен MOCK_MODE, возвращаем мок-данные даже при ошибке
    if (process.env.MOCK_MODE === 'true') {
      const friendlyMock = composeFriendly(MOCK_HOROSCOPE, { preferredName: 'друг' });
      const response = NextResponse.json(friendlyMock);
      return withDebugHeaders(response, debugId);
    }
    
    const message = error instanceof Error ? error.message : 'Horoscope computation failed';
    const response = NextResponse.json({ 
      success: false, 
      error: message,
      debugId 
    }, { status: 400 });
    return withDebugHeaders(response, debugId);
  }
}