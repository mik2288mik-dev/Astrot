export type LanguageCode = 'ru' | 'en';

export type NatalInput = {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm (24h)
  timeUnknown?: boolean;
  place?: string; // free-form
  latitude?: number; // optional manual
  longitude?: number; // optional manual
  timezone?: string; // IANA
  language?: LanguageCode;
  // Optional idempotency key derived from input client-side
  idempotencyKey?: string;
};

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  resolvedAddress?: string;
  timezone?: string;
  timezoneSource?: 'provider' | 'inferred' | 'fallback';
  warnings?: string[];
};

export type NormalizedPlanetPosition = {
  name: string; // e.g. "Sun"
  longitude: number; // ecliptic longitude in degrees (0-360)
  sign?: string; // e.g. "Gemini"
  house?: number; // 1-12 if available
};

export type Aspect = {
  a: string;
  b: string;
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | string;
  orb?: number;
};

export type InterpretationBlocks = {
  personality?: string[];
  strengths?: string[];
  compatibility?: string[];
  transits?: string[];
};

export type NatalChartData = {
  metadata: {
    name: string;
    birthDateISO: string; // ISO string of the used datetime
    timezone: string; // IANA
    timeUnknown: boolean;
    source: 'external' | 'mock';
    warnings?: string[];
    idempotencyKey?: string;
  };
  summary: {
    sun?: string;
    moon?: string;
    ascendant?: string;
  };
  planets?: NormalizedPlanetPosition[];
  houses?: { number: number; cuspLongitude: number }[];
  aspects?: Aspect[];
  interpretations?: InterpretationBlocks;
};

export type NatalError = {
  code: number; // HTTP-like code
  message: string;
  details?: Record<string, unknown>;
  language?: LanguageCode;
};

export type NatalApiResponse =
  | { ok: true; data: NatalChartData }
  | { ok: false; error: NatalError };