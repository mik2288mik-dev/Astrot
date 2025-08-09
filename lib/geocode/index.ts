import type { GeocodeResult } from '@/types/natal';
import tzLookup from 'tz-lookup';

const OPEN_CAGE_BASE = 'https://api.opencagedata.com/geocode/v1/json';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

export type GeocodeProvider = 'opencage' | 'nominatim';

function headersForNominatim() {
  return {
    'User-Agent': 'Deepsoul/1.0 (contact: support@deepsoul.app)'
  } as HeadersInit;
}

export async function geocodePlace(place: string): Promise<GeocodeResult> {
  const provider = (process.env.GEOCODE_PROVIDER as GeocodeProvider) || (process.env.OPENCAGE_API_KEY ? 'opencage' : 'nominatim');
  if (provider === 'opencage') {
    const key = process.env.OPENCAGE_API_KEY;
    if (!key) throw new Error('GEOCODING_NOT_CONFIGURED');
    const url = `${OPEN_CAGE_BASE}?key=${encodeURIComponent(key)}&q=${encodeURIComponent(place)}&language=en&limit=1&no_annotations=0`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`GEOCODE_HTTP_${res.status}`);
    const data = await res.json();
    const best = data?.results?.[0];
    if (!best) throw new Error('GEOCODE_NO_RESULTS');
    const lat = Number(best.geometry?.lat);
    const lon = Number(best.geometry?.lng);
    const address = best.formatted as string | undefined;
    const tz = best.annotations?.timezone?.name as string | undefined;
    const timezone = tz || safeTzLookup(lat, lon);
    const warnings: string[] = [];
    if (!tz) warnings.push('timezone_inferred');
    return { latitude: lat, longitude: lon, resolvedAddress: address, timezone, timezoneSource: tz ? 'provider' : 'inferred', warnings };
  }

  // Nominatim
  const url = `${NOMINATIM_BASE}?format=jsonv2&q=${encodeURIComponent(place)}&limit=1&addressdetails=1`;
  const res = await fetch(url, { headers: { ...headersForNominatim(), Accept: 'application/json' } });
  if (!res.ok) throw new Error(`GEOCODE_HTTP_${res.status}`);
  const arr = (await res.json()) as Array<any>;
  const best = arr?.[0];
  if (!best) throw new Error('GEOCODE_NO_RESULTS');
  const lat = Number(best.lat);
  const lon = Number(best.lon);
  const address = best.display_name as string | undefined;
  // Nominatim does not return timezone
  const timezone = safeTzLookup(lat, lon);
  return { latitude: lat, longitude: lon, resolvedAddress: address, timezone, timezoneSource: 'inferred' };
}

export function safeTzLookup(lat: number, lon: number): string | undefined {
  try {
    return tzLookup(lat, lon);
  } catch {
    return undefined;
  }
}