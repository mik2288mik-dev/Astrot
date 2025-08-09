import { NextRequest } from 'next/server';
import { computeInputSchema } from '@/lib/validation';
import { getEphemerisAdapter } from '@/lib/ephemeris/adapter';
import { z } from 'zod';

export const runtime = 'nodejs';

function baseUrlFromReq(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

async function verifyPremium(baseUrl: string, userId: string): Promise<boolean> {
  if (process.env.MOCK_PREMIUM_ALL === 'true') return true;
  try {
    const res = await fetch(`${baseUrl}/api/subscription/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.active;
  } catch {
    return false;
  }
}

const fullInputSchema = computeInputSchema.extend({ userId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = fullInputSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 422 });

  const baseUrl = baseUrlFromReq(req);
  const hasPremium = await verifyPremium(baseUrl, parsed.data.userId);
  if (!hasPremium) return Response.json({ error: 'premium_required' }, { status: 402 });

  try {
    const adapter = await getEphemerisAdapter();
    const chart = await adapter.compute(parsed.data);

    const aztroRes = await fetch(`${baseUrl}/api/horoscope`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sign: chart.sunSign.toLowerCase() })
    });
    const daily = aztroRes.ok ? await aztroRes.json() : null;

    const explainRes = await fetch(`${baseUrl}/api/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summaryText: chart.summaryText, dailyText: daily?.description, locale: 'ru' })
    });
    const explanation = explainRes.ok ? await explainRes.json() : { text: '' };

    return Response.json({ chart, daily, explanation });
  } catch (e: any) {
    return Response.json({ error: 'natal_full_failed', message: String(e?.message || e) }, { status: 500 });
  }
}