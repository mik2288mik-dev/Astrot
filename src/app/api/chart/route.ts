import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getEphemerisAdapter, signFromLongitude } from '../../../../lib/ephemeris/adapter';
import { safeTzLookup } from '../../../../lib/geocode';
import type { ComputeInput } from '../../../../lib/ephemeris/adapter';
import type { NatalInput, NatalResult } from '../../../../lib/api/natal';
import type { BirthData } from '../../../../lib/birth/types';
import { DateTime } from 'luxon';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({
  name: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  unknownTime: z.boolean().optional(),
  place: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    displayName: z.string(),
    tz: z.string().optional()
  })
});

// Маппинг знаков с английского на русский
const SIGN_MAP: Record<string, string> = {
  'Aries': 'Овен',
  'Taurus': 'Телец', 
  'Gemini': 'Близнецы',
  'Cancer': 'Рак',
  'Leo': 'Лев',
  'Virgo': 'Дева',
  'Libra': 'Весы',
  'Scorpio': 'Скорпион',
  'Sagittarius': 'Стрелец',
  'Capricorn': 'Козерог',
  'Aquarius': 'Водолей',
  'Pisces': 'Рыбы'
};

// Маппинг элементов знаков
const ELEMENT_MAP: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
  'Овен': 'fire', 'Лев': 'fire', 'Стрелец': 'fire',
  'Телец': 'earth', 'Дева': 'earth', 'Козерог': 'earth', 
  'Близнецы': 'air', 'Весы': 'air', 'Водолей': 'air',
  'Рак': 'water', 'Скорпион': 'water', 'Рыбы': 'water'
};

export async function POST(req: NextRequest) {
  try {
    const parsedInput = Schema.parse(await req.json());
    const input: NatalInput = {
      date: parsedInput.date,
      time: parsedInput.time,
      place: {
        lat: parsedInput.place.lat,
        lon: parsedInput.place.lon,
        displayName: parsedInput.place.displayName,
        ...(parsedInput.place.tz && { tz: parsedInput.place.tz })
      },
      ...(parsedInput.name && { name: parsedInput.name }),
      ...(parsedInput.unknownTime && { unknownTime: parsedInput.unknownTime })
    };
    
    // Определяем таймзону если не указана
    const timezone = input.place.tz || safeTzLookup(input.place.lat, input.place.lon) || 'UTC';
    
    // Создаем DateTime объект для конвертации в UTC
    const localDateTime = DateTime.fromFormat(
      `${input.date} ${input.time}`, 
      'yyyy-MM-dd HH:mm', 
      { zone: timezone }
    );
    
    if (!localDateTime.isValid) {
      return NextResponse.json({ error: 'Invalid date/time' }, { status: 400 });
    }
    
    const utcDateTime = localDateTime.toUTC();
    
    const computeInput: ComputeInput = {
      year: utcDateTime.year,
      month: utcDateTime.month,
      day: utcDateTime.day,
      hour: utcDateTime.hour,
      minute: utcDateTime.minute,
      second: utcDateTime.second,
      lat: input.place.lat,
      lon: input.place.lon,
      tz: timezone
    };

    const adapter = await getEphemerisAdapter();
    const result = await adapter.compute(computeInput);
    
    // Найдем планеты
    const sun = result.planets.find(p => p.name.toLowerCase() === 'sun');
    const moon = result.planets.find(p => p.name.toLowerCase() === 'moon');
    
    if (!sun || !moon) {
      return NextResponse.json({ error: 'Failed to compute planetary positions' }, { status: 500 });
    }
    
    // Получаем знаки
    const sunSign = SIGN_MAP[signFromLongitude(sun.lon)] || signFromLongitude(sun.lon);
    const moonSign = SIGN_MAP[signFromLongitude(moon.lon)] || signFromLongitude(moon.lon);
    
    // Асцендент
    let ascSign: string | null = null;
    let ascDegree: number | null = null;
    let approx = false;
    
    if (input.unknownTime) {
      // Если время неизвестно - асцендент не рассчитываем
      approx = true;
    } else if (result.houses) {
      ascDegree = result.houses.asc;
      ascSign = SIGN_MAP[signFromLongitude(result.houses.asc)] || signFromLongitude(result.houses.asc);
    }
    
    // Считаем баланс стихий (только Солнце и Луна, так как асцендент может быть неизвестен)
    const elements = { fire: 0, earth: 0, air: 0, water: 0 };
    
    const sunElement = ELEMENT_MAP[sunSign];
    const moonElement = ELEMENT_MAP[moonSign];
    
    if (sunElement) elements[sunElement]++;
    if (moonElement) elements[moonElement]++;
    if (ascSign && !approx) {
      const ascElement = ELEMENT_MAP[ascSign];
      if (ascElement) elements[ascElement]++;
    }
    
    const natalResult: NatalResult = {
      big3: {
        sun: { sign: sunSign, degree: sun.lon },
        moon: { sign: moonSign, degree: moon.lon },
        asc: { sign: ascSign, degree: ascDegree, approx }
      },
      elements
    };
    
    return NextResponse.json(natalResult);
    
  } catch (e: unknown) {
    console.error('Chart calculation error:', e);
    const error = e instanceof Error ? e.message : 'Chart calculation failed';
    return NextResponse.json({ error }, { status: 400 });
  }
}
