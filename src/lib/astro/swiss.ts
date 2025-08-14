import path from 'node:path';
// Lazy load native module to avoid requiring it at build time
let swe: any;
function getSwe() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return swe ?? (swe = require('swisseph'));
}

export type BirthData = {
  date: string;      // 'YYYY-MM-DD'
  time: string;      // 'HH:mm' (локальное время места рождения)
  tzOffset: number;  // смещение от UTC в часах, напр. +3 => 3, -5 => -5
  lat: number;       // широта, напр. 55.7558
  lon: number;       // долгота, напр. 37.6173 (восток +, запад -)
  houseSystem?: string | undefined; // 'P' (Placidus) по умолчанию
};

const PLANETS = [
  { idKey: 'SE_SUN',       key: 'Sun' },
  { idKey: 'SE_MOON',      key: 'Moon' },
  { idKey: 'SE_MERCURY',   key: 'Mercury' },
  { idKey: 'SE_VENUS',     key: 'Venus' },
  { idKey: 'SE_MARS',      key: 'Mars' },
  { idKey: 'SE_JUPITER',   key: 'Jupiter' },
  { idKey: 'SE_SATURN',    key: 'Saturn' },
  { idKey: 'SE_URANUS',    key: 'Uranus' },
  { idKey: 'SE_NEPTUNE',   key: 'Neptune' },
  { idKey: 'SE_PLUTO',     key: 'Pluto' },
  { idKey: 'SE_TRUE_NODE', key: 'Node' }
];

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

function getSignName(eclipticLongitude: number) {
  const idx = Math.floor(((eclipticLongitude % 360) + 360) % 360 / 30);
  return SIGNS[(idx + 12) % 12] ?? 'Aries';
}

export function initSwissEphemeris() {
  const ephePath = path.resolve(process.cwd(), 'ephe');
  getSwe().swe_set_ephe_path(ephePath);
}

function toUT(date: string, time: string, tzOffset: number) {
  const dateParts = date.split('-');
  const y = Number(dateParts[0] ?? 1970);
  const m = Number(dateParts[1] ?? 1);
  const d = Number(dateParts[2] ?? 1);
  const timeParts = time.split(':');
  const hh = Number(timeParts[0] ?? 0);
  const mm = Number(timeParts[1] ?? 0);
  const local = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const utMillis = local.getTime() - tzOffset * 3600 * 1000;
  const ut = new Date(utMillis);

  const Y = ut.getUTCFullYear();
  const M = ut.getUTCMonth() + 1;
  const D = ut.getUTCDate();
  const H = ut.getUTCHours() + ut.getUTCMinutes() / 60 + ut.getUTCSeconds() / 3600;

  const s = getSwe();
  const jdUT = s.swe_julday(Y, M, D, H, s.SE_GREG_CAL);
  return { jdUT, ut: { Y, M, D, H } };
}

export type PlanetPosition = {
  key: string;
  lon: number;
  lat: number;
  dist: number;
  speedLon: number;
  sign: string;
  house?: number;
};

export type Houses = {
  cusps: number[];
  asc: number;
  mc: number;
};

export type NatalChart = {
  jdUT: number;
  planets: PlanetPosition[];
  houses: Houses;
  bigThree: { Sun: string; Moon: string; Ascendant: string };
};

export function computeNatalChart(b: BirthData): NatalChart {
  initSwissEphemeris();

  const { jdUT } = toUT(b.date, b.time, b.tzOffset);
  const s = getSwe();
  const flag = s.SEFLG_SWIEPH | s.SEFLG_SPEED;

  const planets: PlanetPosition[] = PLANETS.map(p => {
    const id = (s as Record<string, number>)[p.idKey] ?? 0;
    const calc = s.swe_calc_ut(jdUT, id, flag) as any;
    const lon = Number(calc?.longitude ?? 0);
    return {
      key: p.key,
      lon,
      lat: Number(calc?.latitude ?? 0),
      dist: Number(calc?.distance ?? 0),
      speedLon: Number(calc?.longitudeSpeed ?? 0),
      sign: getSignName(lon)
    };
  });

  const hs = (b.houseSystem ?? 'P').toUpperCase();
  const houseRes = s.swe_houses(jdUT, b.lat, b.lon, hs) as any;

  const cusps = Array.from({ length: 12 }, (_, i) => Number(houseRes?.houseCusps?.[i + 1] ?? 0));
  const asc = Number(houseRes?.ascmc?.[0] ?? 0);
  const mc  = Number(houseRes?.ascmc?.[1] ?? 0);

  const planetWithHouses = planets.map(pl => ({
    ...pl,
    house: houseOf(pl.lon, cusps)
  }));

  const bigThree = {
    Sun: planetWithHouses.find(p => p.key === 'Sun')!.sign,
    Moon: planetWithHouses.find(p => p.key === 'Moon')!.sign,
    Ascendant: getSignName(asc)
  };

  return {
    jdUT,
    planets: planetWithHouses,
    houses: { cusps, asc, mc },
    bigThree
  };
}

function houseOf(lon: number, cusps: number[]) {
  const L = (lon + 360) % 360;
  for (let i = 0; i < 12; i++) {
    const c1 = cusps[i] ?? 0;
    const c2 = cusps[(i + 1) % 12] ?? 0;
    if (betweenOnCircle(L, c1, c2)) return i + 1;
  }
  return 12;
}

function betweenOnCircle(L: number, start: number, end: number) {
  const s = (start + 360) % 360, e = (end + 360) % 360;
  if (s <= e) return L >= s && L < e;
  return L >= s || L < e;
}