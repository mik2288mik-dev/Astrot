import { DateTime } from 'luxon';
import type { NatalChartData, InterpretationBlocks, NormalizedPlanetPosition } from '@/types/natal';

export type AstroApiParams = {
  name: string;
  birthDateISO: string; // ISO with IANA zone applied
  latitude: number;
  longitude: number;
  timezone: string; // IANA
  language: 'ru' | 'en';
};

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url: string, options: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = 12000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...rest, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchNatalFromAstroApi(params: AstroApiParams): Promise<NatalChartData> {
  const base = process.env.ASTRO_API_BASE_URL;
  const key = process.env.ASTRO_API_KEY;
  if (!base || !key) {
    return buildMockNatal(params);
  }

  const url = `${base.replace(/\/$/, '')}/natal-chart`;
  const payload = {
    name: params.name,
    datetime: params.birthDateISO,
    lat: params.latitude,
    lon: params.longitude,
    tz: params.timezone,
    lang: params.language
  };

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key
        },
        body: JSON.stringify(payload),
        timeoutMs: 12000
      });
      if (res.status === 429) {
        // Respect rate limit
        const retryAfter = Number(res.headers.get('Retry-After') || '1');
        await sleep(Math.min(5000, retryAfter * 1000));
        continue;
      }
      if (!res.ok) {
        throw new Error(`ASTRO_HTTP_${res.status}`);
      }
      const raw = await res.json();
      return normalizeAstroResponse(raw, params);
    } catch (e) {
      lastError = e;
      await sleep(400 * Math.pow(2, attempt));
    }
  }

  // Fallback to mock on persistent failure
  return buildMockNatal(params, /*withWarning*/ true, lastError);
}

function normalizeAstroResponse(raw: any, params: AstroApiParams): NatalChartData {
  const dt = DateTime.fromISO(params.birthDateISO).setZone(params.timezone);
  const data: NatalChartData = {
    metadata: {
      name: params.name,
      birthDateISO: dt.toISO(),
      timezone: params.timezone,
      timeUnknown: false,
      source: 'external'
    },
    summary: {
      sun: raw?.summary?.sun || raw?.summary?.Sun || undefined,
      moon: raw?.summary?.moon || raw?.summary?.Moon || undefined,
      ascendant: raw?.summary?.asc || raw?.summary?.Ascendant || raw?.asc || undefined
    },
    planets: Array.isArray(raw?.planets)
      ? (raw.planets as any[]).map((p) => ({
          name: String(p.name || p.planet || ''),
          longitude: Number(p.longitude ?? p.lon ?? 0),
          sign: p.sign || undefined,
          house: p.house ? Number(p.house) : undefined
        }))
      : undefined,
    houses: Array.isArray(raw?.houses)
      ? (raw.houses as any[]).map((h, idx) => ({ number: Number(h.number ?? idx + 1), cuspLongitude: Number(h.cuspLongitude ?? h.cusp ?? 0) }))
      : undefined,
    aspects: Array.isArray(raw?.aspects)
      ? (raw.aspects as any[]).map((a) => ({ a: String(a.a || a.from), b: String(a.b || a.to), type: String(a.type || a.aspect || ''), orb: a.orb ? Number(a.orb) : undefined }))
      : undefined,
    interpretations: normalizeInterpretations(raw?.interpretations, params.language)
  };
  return data;
}

function normalizeInterpretations(src: any, lang: 'ru' | 'en'): InterpretationBlocks | undefined {
  if (!src || typeof src !== 'object') return undefined;
  const toArr = (v: any): string[] | undefined => {
    if (!v) return undefined;
    if (Array.isArray(v)) return v.map((s) => String(s));
    if (typeof v === 'string') return v.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
    return undefined;
  };
  return {
    personality: toArr(src.personality || src.traits),
    strengths: toArr(src.strengths || src.advantages),
    compatibility: toArr(src.compatibility || src.relationships),
    transits: toArr(src.transits)
  };
}

function buildMockNatal(params: AstroApiParams, withWarning = false, error?: unknown): NatalChartData {
  const dt = DateTime.fromISO(params.birthDateISO, { zone: params.timezone });
  const sunSign = approximateSunSign(dt);
  const textRu = {
    personality: [
      `Ваш Солнце в знаке ${sunSign.ru}. Это придаёт вам характерные качества этого знака.`,
      'Это черновик — внешний астрологический API недоступен.'
    ],
    strengths: ['Вы обладаете внутренней устойчивостью и стремлением к самопознанию.'],
    compatibility: ['Вы тянетесь к людям, с которыми разделяете ценности и цели.']
  };
  const textEn = {
    personality: [
      `Your Sun is in ${sunSign.en}. This gives you characteristic qualities of this sign.`,
      'This is a draft — external astrology API is unavailable.'
    ],
    strengths: ['You possess inner resilience and a drive for self-discovery.'],
    compatibility: ['You are drawn to people who share your values and goals.']
  };
  const interpretations = params.language === 'ru' ? textRu : textEn;

  const planets: NormalizedPlanetPosition[] = [
    { name: 'Sun', longitude: sunSign.midDegree },
    { name: 'Moon', longitude: (sunSign.midDegree + 90) % 360 },
    { name: 'Ascendant', longitude: (sunSign.midDegree + 30) % 360 }
  ];

  const metadataWarnings: string[] = [];
  if (withWarning) metadataWarnings.push('external_api_unavailable');

  return {
    metadata: {
      name: params.name,
      birthDateISO: dt.toISO(),
      timezone: params.timezone,
      timeUnknown: false,
      source: 'mock',
      warnings: metadataWarnings
    },
    summary: { sun: sunSign[params.language], moon: undefined, ascendant: undefined },
    planets,
    houses: undefined,
    aspects: undefined,
    interpretations
  };
}

function approximateSunSign(dt: DateTime): { ru: string; en: string; midDegree: number } {
  // Approximate Western tropical zodiac date ranges; mid-degree per sign
  const month = dt.month;
  const day = dt.day;
  const ranges = [
    { sign: { ru: 'Овен', en: 'Aries' }, start: [3, 21], end: [4, 19], base: 0 },
    { sign: { ru: 'Телец', en: 'Taurus' }, start: [4, 20], end: [5, 20], base: 30 },
    { sign: { ru: 'Близнецы', en: 'Gemini' }, start: [5, 21], end: [6, 20], base: 60 },
    { sign: { ru: 'Рак', en: 'Cancer' }, start: [6, 21], end: [7, 22], base: 90 },
    { sign: { ru: 'Лев', en: 'Leo' }, start: [7, 23], end: [8, 22], base: 120 },
    { sign: { ru: 'Дева', en: 'Virgo' }, start: [8, 23], end: [9, 22], base: 150 },
    { sign: { ru: 'Весы', en: 'Libra' }, start: [9, 23], end: [10, 22], base: 180 },
    { sign: { ru: 'Скорпион', en: 'Scorpio' }, start: [10, 23], end: [11, 21], base: 210 },
    { sign: { ru: 'Стрелец', en: 'Sagittarius' }, start: [11, 22], end: [12, 21], base: 240 },
    { sign: { ru: 'Козерог', en: 'Capricorn' }, start: [12, 22], end: [1, 19], base: 270 },
    { sign: { ru: 'Водолей', en: 'Aquarius' }, start: [1, 20], end: [2, 18], base: 300 },
    { sign: { ru: 'Рыбы', en: 'Pisces' }, start: [2, 19], end: [3, 20], base: 330 }
  ];
  for (const r of ranges) {
    const inRange =
      (month === r.start[0] && day >= r.start[1]) ||
      (month === r.end[0] && day <= r.end[1]) ||
      (month > r.start[0] && month < r.end[0]) ||
      (r.start[0] > r.end[0] && (month > r.start[0] || month < r.end[0]));
    if (inRange) return { ...r.sign, midDegree: r.base + 15 };
  }
  return { ru: 'Неизвестно', en: 'Unknown', midDegree: 0 };
}