import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeNatalChart } from '@/lib/astro/swiss';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

async function loadSWE() {
  const mod = await import('swisseph');
  return mod.default ?? mod;
}
const EPHE_PATH = process.env.EPHE_PATH || 'ephe';

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
    const swisseph = await loadSWE();
    swisseph.swe_set_ephe_path(EPHE_PATH);
    const chart = computeNatalChart(data);
    return NextResponse.json({ ok: true, chart });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}