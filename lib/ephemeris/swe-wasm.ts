import type { EphemerisAdapter, ComputeInput, ComputeOutput, PlanetPosition, Houses } from './adapter';
import { computeJulianDayUT, signFromLongitude } from './adapter';

export class SweWasmAdapter implements EphemerisAdapter {
  async compute(input: ComputeInput): Promise<ComputeOutput> {
    const jdUt = computeJulianDayUT(input);

    // Fallback does not compute real planets; provide placeholders
    const planets: PlanetPosition[] = [
      { name: 'Sun', lon: (jdUt * 0.985647) % 360, lat: 0 },
      { name: 'Moon', lon: (jdUt * 13.1764) % 360, lat: 0 }
    ];

    const houses: Houses | null = null;

    const sunSign = signFromLongitude(planets[0].lon);
    const summaryText = `Approximate fallback (no Swiss Ephemeris). Sun in ${sunSign}.`;

    return {
      jdUt,
      tz: input.tz || 'UTC',
      planets,
      houses,
      aspects: [],
      summaryText,
      sunSign
    };
  }
}