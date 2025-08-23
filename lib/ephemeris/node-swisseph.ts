import type { EphemerisAdapter, ComputeInput, ComputeOutput, PlanetPosition, Houses, Aspect } from './adapter';
import { computeJulianDayUT, signFromLongitude } from './adapter';

const PLANETS: { id: number; name: string }[] = [
  { id: 0, name: 'Sun' },
  { id: 1, name: 'Moon' },
  { id: 2, name: 'Mercury' },
  { id: 3, name: 'Venus' },
  { id: 4, name: 'Mars' },
  { id: 5, name: 'Jupiter' },
  { id: 6, name: 'Saturn' }
];

export class NodeSwissephAdapter implements EphemerisAdapter {
  async compute(input: ComputeInput): Promise<ComputeOutput> {
    let swe: any;
    try {
      const modName: string = 'swisseph';
      swe = await import(modName as any);
    } catch (e) {
      throw new Error('swisseph module not available. Install `swisseph` and ensure build tools are present, or set USE_SWE_WASM=true');
    }

    const ephePath = process.env.EPHE_PATH || './ephe';
    try { (swe as any).swe_set_ephe_path?.(ephePath); } catch {}

    const jdUt = computeJulianDayUT(input);

    const planets: PlanetPosition[] = [];
    for (const p of PLANETS) {
      const res: any = (swe as any).swe_calc_ut(jdUt, p.id, (swe as any).SEFLG_SWIEPH);
      const lon = res.longitude ?? res[0] ?? 0;
      const lat = res.latitude ?? res[1] ?? 0;
      const dist = res.distance ?? res[2];
      planets.push({ name: p.name, lon, lat, dist });
    }

    let houses: Houses | null = null;
    try {
      const hs = (input.houseSystem || 'P').charCodeAt(0);
      const geo = { lat: input.lat, lon: input.lon };
      const hRes: any = (swe as any).swe_houses(jdUt, geo.lat, geo.lon, hs);
      const rawCusps: unknown[] = Array.from(hRes.house ?? hRes[0] ?? []);
      const cusps: number[] = rawCusps.slice(1, 13).map((v) => Number(v) || 0);
      const asc = (Number(hRes.ascendant) || Number(hRes[1]) || cusps[0] || 0);
      const mc = (Number(hRes.mc) || Number(hRes[2]) || cusps[9] || 0);
      houses = { asc, mc, cusps };
    } catch {}

    const aspects = computeAspects(planets);
    const sun = planets.find((p) => p.name === 'Sun');
    const sunSign = signFromLongitude(sun?.lon ?? 0);

    const summaryText = `Sun in ${sunSign}. Planets: ${planets.map((p) => `${p.name} ${p.lon.toFixed(1)}°`).join(', ')}.`;

    return {
      jdUt,
      tz: input.tz || 'UTC',
      planets,
      houses,
      aspects,
      summaryText,
      sunSign
    };
  }
}

function computeAspects(planets: PlanetPosition[]): Aspect[] {
  const majors: { exact: number; type: Aspect['type']; orb: number }[] = [
    { exact: 0, type: 'conjunction', orb: 8 },
    { exact: 60, type: 'sextile', orb: 4 },
    { exact: 90, type: 'square', orb: 6 },
    { exact: 120, type: 'trine', orb: 6 },
    { exact: 180, type: 'opposition', orb: 8 }
  ];
  const res: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i];
      const b = planets[j];
      const d = Math.abs(((a.lon - b.lon + 540) % 360) - 180);
      for (const asp of majors) {
        const diff = Math.abs(d - asp.exact);
        if (diff <= asp.orb) {
          res.push({ a: a.name, b: b.name, type: asp.type, orb: diff, exact: asp.exact });
          break;
        }
      }
    }
  }
  return res;
}