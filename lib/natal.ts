import type { ComputeInput, ComputeOutput, EphemerisAdapter } from './ephemeris/adapter';
import { getEphemerisAdapter } from './ephemeris/adapter';

/**
 * Compute a natal chart using Swiss Ephemeris when available.
 * The underlying Node adapter respects process.env.EPHE_PATH for ephemeris data,
 * and process.env.USE_SWE_WASM can force the WASM fallback.
 */
export async function computeNatalChart(input: ComputeInput): Promise<ComputeOutput> {
  const adapter: EphemerisAdapter = await getEphemerisAdapter();
  return adapter.compute(input);
}

export type { ComputeInput, ComputeOutput } from './ephemeris/adapter';
