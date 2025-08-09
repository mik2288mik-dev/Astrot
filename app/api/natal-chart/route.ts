import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { DateTime } from 'luxon';
import { getNatalSchema } from '@/lib/validation/natal';
import { geocodePlace, safeTzLookup } from '@/lib/geocode';
import { rememberPromise } from '@/lib/idempotency';
import { rateLimitAllow } from '@/lib/rateLimit';
import { fetchNatalFromAstroApi } from '@/lib/astro/client';
import type { NatalApiResponse, NatalChartData, NatalInput } from '@/types/natal';
import { t } from '@/lib/i18n';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';
  const body = (await req.json().catch(() => ({}))) as Partial<NatalInput>;
  const lang = (body.language as any) === 'en' ? 'en' : 'ru';

  // Rate limit
  const rl = rateLimitAllow(`natal:${ip}`);
  if (!rl.allowed) {
    return json({ ok: false, error: { code: 429, message: t(lang, 'rate_limited'), language: lang } }, 429, rl.retryAfterSec);
  }

  // Validate
  const schema = getNatalSchema(lang);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: {
          code: 422,
          message: t(lang, 'invalid'),
          details: parsed.error.flatten(),
          language: lang
        }
      },
      422
    );
  }

  const v = parsed.data;

  // Build idempotency key
  const idKey = v.idempotencyKey || makeHash({ ...v, name: maskName(v.name) });

  const result = await rememberPromise(idKey, async () => {
    // Geocode or use provided coordinates
    let latitude = v.latitude;
    let longitude = v.longitude;
    let resolvedAddress: string | undefined;
    let timezone = v.timezone;
    const warnings: string[] = [];

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      try {
        const geo = await geocodePlace(v.place!);
        latitude = geo.latitude;
        longitude = geo.longitude;
        resolvedAddress = geo.resolvedAddress;
        timezone = timezone || geo.timezone;
        if (geo.warnings?.length) warnings.push(...geo.warnings);
      } catch (e) {
        return makeError(422, t(lang, 'geocode_failed'), lang, { error: String(e) });
      }
    }

    // Timezone policy
    if (!timezone) {
      timezone = safeTzLookup(latitude!, longitude!) || 'UTC';
      if (timezone === 'UTC') warnings.push('timezone_fallback_utc');
    }

    // Datetime construction
    const hasTime = !v.timeUnknown && !!v.birthTime;
    const hhmm = hasTime ? v.birthTime! : '12:00';
    if (!hasTime) warnings.push('time_unknown_noon_used');

    const dt = DateTime.fromISO(`${v.birthDate}T${hhmm}`, { zone: timezone });
    const birthDateISO = dt.isValid ? dt.toISO()! : `${v.birthDate}T${hhmm}:00.000Z`;

    const astroParams = {
      name: v.name.trim(),
      birthDateISO,
      latitude: latitude!,
      longitude: longitude!,
      timezone: timezone!,
      language: lang
    } as const;

    const data: NatalChartData = await fetchNatalFromAstroApi(astroParams);
    data.metadata.warnings = [...(data.metadata.warnings || []), ...warnings];
    data.metadata.timeUnknown = !hasTime;
    data.metadata.idempotencyKey = idKey;
    return { ok: true, data } as NatalApiResponse;
  });

  if (!result.ok) {
    return json(result, result.error.code);
  }
  return json(result, 200);
}

function json(payload: NatalApiResponse, status = 200, retryAfterSec?: number) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (retryAfterSec) headers.set('Retry-After', String(retryAfterSec));
  return new Response(JSON.stringify(payload), { status, headers });
}

function maskName(name: string): string {
  const n = name.trim();
  if (n.length <= 1) return '*';
  return n[0] + '*'.repeat(Math.min(5, n.length - 1));
}

function makeHash(obj: any): string {
  const canonical = JSON.stringify(obj);
  return crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 32);
}