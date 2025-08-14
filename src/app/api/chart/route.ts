import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeNatalChart } from '@/lib/astro/swiss';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const Schema = z.object({
  date: z.string(),
  time: z.string(),
  tzOffset: z.number(),
  lat: z.number(),
  lon: z.number(),
  houseSystem: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);
    const chart = computeNatalChart(data);
    return NextResponse.json({ ok: true, chart });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}