import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import { computeChart } from '@/lib/astro/swiss';
import type { BirthInput } from '@/lib/astro/swiss';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ChartCalcSchema = z.object({
  tgId: z.number().optional(),
  // Если tgId не указан, требуются данные рождения
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  timeUnknown: z.boolean().default(false),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    tzOffset: z.number().min(-14).max(14)
  }).optional(),
  houseSystem: z.enum(['P', 'W']).default('P')
});

export async function POST(req: NextRequest) {
  try {
    const input = ChartCalcSchema.parse(await req.json());
    
    let birthData: BirthInput;
    
    // Если указан tgId, загружаем профиль
    if (input.tgId) {
      const profile = await kv.get(`profile:${input.tgId}`);
      
      if (!profile) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Profile not found' 
        }, { status: 404 });
      }
      
      const profileData = profile as {
        birthDate: string;
        birthTime?: string;
        timeUnknown?: boolean;
        location: {
          lat: number;
          lon: number;
          tzOffset: number;
        };
        houseSystem?: 'P' | 'W';
      };
      
      // Используем время из профиля или 12:00 если неизвестно
      const birthTime = profileData.timeUnknown ? '12:00' : (profileData.birthTime || '12:00');
      
      birthData = {
        date: profileData.birthDate,
        time: birthTime,
        tzOffset: profileData.location.tzOffset,
        lat: profileData.location.lat,
        lon: profileData.location.lon,
        houseSystem: profileData.houseSystem || 'P'
      };
    } else {
      // Используем переданные данные напрямую
      if (!input.birthDate || !input.location) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Birth date and location are required when tgId is not provided' 
        }, { status: 400 });
      }
      
      const birthTime = input.timeUnknown ? '12:00' : (input.birthTime || '12:00');
      
      birthData = {
        date: input.birthDate,
        time: birthTime,
        tzOffset: input.location.tzOffset,
        lat: input.location.lat,
        lon: input.location.lon,
        houseSystem: input.houseSystem
      };
    }
    
    // Вычисляем карту
    const chart = await computeChart(birthData);
    
    return NextResponse.json({ 
      ok: true, 
      chart,
      meta: {
        timeUnknown: input.timeUnknown || (input.tgId ? (await kv.get(`profile:${input.tgId}`) as { timeUnknown?: boolean })?.timeUnknown : false),
        houseSystem: birthData.houseSystem
      }
    });
    
  } catch (e: unknown) {
    console.error('Chart calculation error:', e);
    
    if (e instanceof z.ZodError) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Validation error', 
        details: e.errors 
      }, { status: 400 });
    }
    
    const error = e instanceof Error ? e.message : 'Chart calculation failed';
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}