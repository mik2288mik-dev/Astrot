// Астрологические типы данных

export interface ChartInput {
  name: string
  date: string // ISO date string
  time?: string // HH:MM format
  unknownTime?: boolean
  city: string
  timezone: string
  lat: number
  lon: number
}

export interface PlanetPosition {
  name: string
  symbol: string
  longitude: number // 0-360 degrees
  latitude: number
  distance: number
  speed: number
  retrograde: boolean
  sign: string
  signDegree: number // degree within sign (0-30)
  house?: number
}

export interface HousePosition {
  number: number
  cusp: number // longitude in degrees
  sign: string
  signDegree: number
}

export interface Aspect {
  planet1: string
  planet2: string
  type: 'conjunction' | 'opposition' | 'square' | 'trine' | 'sextile'
  angle: number
  orb: number
  applying: boolean
  exact: boolean
}

export interface ChartComputed {
  input: ChartInput
  julian: number
  sidereal: number
  planets: PlanetPosition[]
  houses: HousePosition[]
  aspects: Aspect[]
  ascendant: number
  midheaven: number
  descendant: number
  ic: number
}

export interface Placement {
  planet: string
  sign: string
  house: number
  aspects: Aspect[]
}

// Знаки зодиака
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const

export const ZODIAC_SIGNS_RU = [
  'Овен', 'Телец', 'Близнецы', 'Рак',
  'Лев', 'Дева', 'Весы', 'Скорпион',
  'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
] as const

// Планеты
export const PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
] as const

export const PLANET_SYMBOLS = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
} as const

export const PLANETS_RU = {
  Sun: 'Солнце',
  Moon: 'Луна',
  Mercury: 'Меркурий',
  Venus: 'Венера',
  Mars: 'Марс',
  Jupiter: 'Юпитер',
  Saturn: 'Сатурн',
  Uranus: 'Уран',
  Neptune: 'Нептун',
  Pluto: 'Плутон',
} as const

// Аспекты
export const ASPECT_SYMBOLS = {
  conjunction: '☌',
  opposition: '☍',
  square: '□',
  trine: '△',
  sextile: '⚹',
} as const

export const ASPECT_ORBS = {
  conjunction: 8,
  opposition: 8,
  square: 8,
  trine: 8,
  sextile: 6,
} as const

export type ZodiacSign = typeof ZODIAC_SIGNS[number]
export type Planet = typeof PLANETS[number]
export type AspectType = keyof typeof ASPECT_SYMBOLS