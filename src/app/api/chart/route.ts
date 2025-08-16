import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeNatalChart } from '@/lib/astro/swiss';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

async function loadSWE() {
  const m = await import('swisseph');
  return m.default ?? m;
}

function pickEphePath() {
  if (process.env.EPHE_PATH) return process.env.EPHE_PATH;
  if (process.env.VERCEL) return 'ephe';
  const full = join(process.cwd(), 'ephe-full');
  if (existsSync(full)) return 'ephe-full';
  return 'ephe';
}

const Schema = z.object({
  date: z.string(),
  time: z.string(),
  tzOffset: z.number(),
  lat: z.number(),
  lon: z.number(),
  houseSystem: z.string().optional()
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('health') === '1') {
    const swe = await loadSWE();
    const EPHE_PATH = pickEphePath();
    swe.swe_set_ephe_path(EPHE_PATH);
    return NextResponse.json({ ephePath: EPHE_PATH, ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);
    const swe = await loadSWE();
    const EPHE_PATH = pickEphePath();
    swe.swe_set_ephe_path(EPHE_PATH);
    const chart = computeNatalChart(data);
    return NextResponse.json({ ok: true, chart });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
