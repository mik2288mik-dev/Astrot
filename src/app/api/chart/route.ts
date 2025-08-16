import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeChart } from '@/lib/astro/swiss';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  tzOffset: z.number().min(-14).max(14),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  houseSystem: z.enum(['P','W']).optional()
});

export async function POST(req: NextRequest) {
  try {
    const input = Schema.parse(await req.json());
    const chart = computeChart(input);
    return NextResponse.json({ ok:true, chart });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e.message ?? 'Chart error' }, { status:400 });
  }
}
