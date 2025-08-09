import { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';
import { horoscopeSchema } from '@/lib/validation';

const cache = new LRUCache<string, any>({ max: 200, ttl: 1000 * 60 * 60 });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = horoscopeSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 422 });

  const { sign, day = 'today' } = parsed.data;
  const key = `${sign}:${day}`;
  const cached = cache.get(key);
  if (cached) return Response.json(cached);

  try {
    const res = await fetch(`https://aztro.sameerkumar.website/?sign=${encodeURIComponent(sign)}&day=${encodeURIComponent(day)}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Aztro HTTP ${res.status}`);
    const data = await res.json();
    const payload = {
      date: data.current_date,
      sign,
      day,
      description: data.description,
      mood: data.mood,
      color: data.color,
      lucky_number: data.lucky_number,
      lucky_time: data.lucky_time
    };
    cache.set(key, payload);
    return Response.json(payload);
  } catch (e: any) {
    return Response.json({ error: 'aztro_failed', message: String(e?.message || e) }, { status: 502 });
  }
}