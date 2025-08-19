import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getEphemerisAdapter } from '../../../../../lib/ephemeris/adapter';
import { safeTzLookup } from '../../../../../lib/geocode';
import type { ComputeInput } from '../../../../../lib/ephemeris/adapter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BirthDataSchema = z.object({
  year: z.number(),
  month: z.number().min(1).max(12),
  day: z.number().min(1).max(31),
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  tz: z.string().optional(),
  place: z.string().optional()
});

const RequestSchema = z.object({
  birth: BirthDataSchema
});

export async function POST(req: NextRequest) {
  try {
    const { birth } = RequestSchema.parse(await req.json());
    
    // Определяем таймзону если не указана
    const timezone = birth.tz || safeTzLookup(birth.lat, birth.lon) || 'UTC';
    
    const computeInput: ComputeInput = {
      year: birth.year,
      month: birth.month,
      day: birth.day,
      hour: birth.hour,
      minute: birth.minute,
      second: 0,
      lat: birth.lat,
      lon: birth.lon,
      tz: timezone,
      houseSystem: 'P' // Placidus
    };

    const adapter = await getEphemerisAdapter();
    const result = await adapter.compute(computeInput);
    
    // Преобразуем данные в формат для NatalWheel
    const planets = result.planets.map(planet => ({
      id: planet.name,
      lon: planet.lon,
      speed: 0 // Скорость планет не используется в визуализации
    }));

    const houses = result.houses ? result.houses.cusps.map((cusp, index) => ({
      index: index + 1,
      lon: cusp
    })) : undefined;

    // Простые аспекты между планетами
    const aspects = result.aspects.map(aspect => ({
      a: aspect.a,
      b: aspect.b,
      type: aspect.type,
      orb: aspect.orb
    }));

    const chartData = {
      planets,
      houses,
      aspects
    };

    return NextResponse.json({
      success: true,
      data: chartData
    });
    
  } catch (error) {
    console.error('Natal compute error:', error);
    const message = error instanceof Error ? error.message : 'Computation failed';
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 400 });
  }
}