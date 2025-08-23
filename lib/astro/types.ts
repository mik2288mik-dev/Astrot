// Астрологические типы данных для натальной карты

export type BirthData = {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
  hour: number;  // 0-23
  minute: number; // 0-59
  second?: number; // 0-59 (опционально)
  lat: number; // широта
  lon: number; // долгота
  tz?: string; // IANA timezone
  place?: string; // название места (для UI)
};

export type PlanetPos = {
  name: string;
  symbol: string; // символ планеты ☉ ☽ ☿ ♀ ♂ ♃ ♄
  lon: number; // эклиптическая долгота 0..360
  lat: number; // эклиптическая широта
  dist?: number; // расстояние в AU
  speed?: number; // скорость в градусах/день
  sign: string; // знак зодиака
  signDegree: number; // градус в знаке 0..30
  house?: number; // номер дома 1..12
  isRetrograde?: boolean; // ретроградность
};

export type HouseCusp = {
  number: number; // номер дома 1..12
  degree: number; // градус куспида
  sign: string; // знак зодиака
  signDegree: number; // градус в знаке
};

export type Aspect = {
  planet1: string; // имя первой планеты
  planet2: string; // имя второй планеты
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx';
  angle: number; // точный угол аспекта (0, 60, 90, 120, 180, 150)
  orb: number; // орб (отклонение от точного аспекта)
  applying: boolean; // сходящийся или расходящийся
  strength: 'tight' | 'moderate' | 'wide'; // сила аспекта по орбу
};

export type ChartData = {
  // Исходные данные рождения
  birthData: BirthData;
  
  // Вычисленные позиции
  planets: PlanetPos[];
  houses: {
    asc: number; // асцендент
    mc: number; // МС (зенит)
    cusps: HouseCusp[]; // куспиды домов
    system: string; // система домов
  };
  aspects: Aspect[];
  
  // Дополнительные данные
  julianDay: number;
  siderealTime: number;
  
  // Краткие характеристики
  sunSign: string;
  moonSign: string;
  risingSign: string;
  
  // Доминирующие элементы/кресты
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  qualities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
};

// Константы для астрологических расчётов
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const PLANET_SYMBOLS = {
  'Sun': '☉',
  'Moon': '☽', 
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Uranus': '♅',
  'Neptune': '♆',
  'Pluto': '♇'
} as const;

export const SIGN_SYMBOLS = {
  'Aries': '♈',
  'Taurus': '♉',
  'Gemini': '♊',
  'Cancer': '♋',
  'Leo': '♌',
  'Virgo': '♍',
  'Libra': '♎',
  'Scorpio': '♏',
  'Sagittarius': '♐',
  'Capricorn': '♑',
  'Aquarius': '♒',
  'Pisces': '♓'
} as const;

export const ASPECT_SYMBOLS = {
  'conjunction': '☌',
  'sextile': '⚹',
  'square': '□',
  'trine': '△',
  'opposition': '☍',
  'quincunx': '⚻'
} as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];
export type PlanetName = keyof typeof PLANET_SYMBOLS;
export type AspectType = keyof typeof ASPECT_SYMBOLS;

// Типы для интерпретаций
export type Interpretation = {
  sections: Array<{
    id: string;
    title: string;
    items: string[];
    tip?: string;
  }>;
  highlights: Array<{
    tag: 'strength' | 'risk' | 'advice';
    text: string;
  }>;
};