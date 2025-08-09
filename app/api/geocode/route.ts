import { NextRequest } from 'next/server';
import tzLookup from 'tz-lookup';

export const runtime = 'nodejs';

const OPEN_CAGE_BASE = 'https://api.opencagedata.com/geocode/v1/json';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

type Result = {
  latitude: number;
  longitude: number;
  resolvedAddress?: string;
  timezone?: string;
  timezoneSource?: 'provider' | 'inferred';
};

function headersForNominatim(): HeadersInit {
  return { 'User-Agent': 'Deepsoul/1.0 (contact: support@deepsoul.app)', Accept: 'application/json' };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const limit = Math.max(1, Math.min(5, Number(searchParams.get('limit') || 5)));
  if (!q) return Response.json({ error: 'missing_query' }, { status: 400 });

  const provider: 'opencage' | 'nominatim' = (process.env.GEOCODE_PROVIDER as any) || (process.env.OPENCAGE_API_KEY ? 'opencage' : 'nominatim');

  try {
    if (provider === 'opencage') {
      const key = process.env.OPENCAGE_API_KEY;
      if (!key) throw new Error('GEOCODING_NOT_CONFIGURED');
      const url = `${OPEN_CAGE_BASE}?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&language=en&limit=${limit}&no_annotations=0`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) return Response.json({ error: `GEOCODE_HTTP_${res.status}` }, { status: 502 });
      const data = await res.json();
      const results: Result[] = (data?.results || []).slice(0, limit).map((r: any) => {
        const lat = Number(r.geometry?.lat);
        const lon = Number(r.geometry?.lng);
        const address = r.formatted as string | undefined;
        const tz = r.annotations?.timezone?.name as string | undefined;
        return {
          latitude: lat,
          longitude: lon,
          resolvedAddress: address,
          timezone: tz || safeTzLookup(lat, lon),
          timezoneSource: tz ? 'provider' : 'inferred'
        };
      });
      return Response.json({ results });
    }

    // Nominatim fallback
    const url = `${NOMINATIM_BASE}?format=jsonv2&q=${encodeURIComponent(q)}&limit=${limit}&addressdetails=1`;
    const res = await fetch(url, { headers: headersForNominatim() });
    if (!res.ok) return Response.json({ error: `GEOCODE_HTTP_${res.status}` }, { status: 502 });
    const arr = (await res.json()) as Array<any>;
    const results: Result[] = (arr || []).slice(0, limit).map((r) => {
      const lat = Number(r.lat);
      const lon = Number(r.lon);
      const address = r.display_name as string | undefined;
      return {
        latitude: lat,
        longitude: lon,
        resolvedAddress: address,
        timezone: safeTzLookup(lat, lon),
        timezoneSource: 'inferred'
      };
    });
    return Response.json({ results });
  } catch (e: any) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

function safeTzLookup(lat: number, lon: number): string | undefined {
  try {
    return tzLookup(lat, lon);
  } catch {
    return undefined;
  }
}