import { NextRequest } from 'next/server';
import { computeInputSchema } from '@/lib/validation';
import { getEphemerisAdapter } from '@/lib/ephemeris/adapter';
import { find } from 'geo-tz';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = computeInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 422 });
  }
  const input = parsed.data;
  if (!input.tz) {
    try {
      const zones = find(input.lat, input.lon);
      input.tz = zones?.[0] || 'UTC';
    } catch {
      input.tz = 'UTC';
    }
  }
  try {
    const adapter = await getEphemerisAdapter();
    const chart = await adapter.compute(input);
    return Response.json(chart);
  } catch (e: any) {
    return Response.json({ error: 'compute_failed', message: String(e?.message || e) }, { status: 500 });
  }
}