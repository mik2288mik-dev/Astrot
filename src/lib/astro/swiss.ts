import path from 'node:path';
import * as swe from 'swisseph';

export type BirthInput = {
  date: string;      // 'YYYY-MM-DD'
  time: string;      // 'HH:mm'
  tzOffset: number;  // часы от UTC (Москва лето = 3)
  lat: number;
  lon: number;
  houseSystem?: 'P'|'W'; // Placidus / Whole Sign
};

const PLANETS = [
  { id: (swe as any).SE_SUN,       key: 'Sun' },
  { id: (swe as any).SE_MOON,      key: 'Moon' },
  { id: (swe as any).SE_MERCURY,   key: 'Mercury' },
  { id: (swe as any).SE_VENUS,     key: 'Venus' },
  { id: (swe as any).SE_MARS,      key: 'Mars' },
  { id: (swe as any).SE_JUPITER,   key: 'Jupiter' },
  { id: (swe as any).SE_SATURN,    key: 'Saturn' },
  { id: (swe as any).SE_URANUS,    key: 'Uranus' },
  { id: (swe as any).SE_NEPTUNE,   key: 'Neptune' },
  { id: (swe as any).SE_PLUTO,     key: 'Pluto' },
  { id: (swe as any).SE_TRUE_NODE, key: 'Node' }
];

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const signOf = (deg:number)=> SIGNS[Math.floor(((deg%360)+360)%360/30)];

function toJDUT(date: string, time: string, tz: number){
  const [Y,M,D] = date.split('-').map(Number);
  const [h,m] = time.split(':').map(Number);
  const utcHour = h - tz + (m/60);
  return Number((swe as any).swe_julday(Y,M,D,utcHour,(swe as any).SE_GREG_CAL));
}

function inArc(x:number, a:number, b:number){ if (a<=b) return x>=a && x<b; return x>=a || x<b; }
function houseOf(lon:number, cusps:number[]){
  const L = ((lon%360)+360)%360;
  for(let i=0;i<12;i++){
    const a = ((cusps[i]%360)+360)%360;
    const b = ((cusps[(i+1)%12]%360)+360)%360;
    if (inArc(L,a,b)) return i+1;
  }
  return 12;
}

export function computeChart(input: BirthInput){
  (swe as any).swe_set_ephe_path(path.resolve(process.cwd(),'ephe'));

  const jdUT = toJDUT(input.date, input.time, input.tzOffset);
  const FLAG = (swe as any).SEFLG_SWIEPH | (swe as any).SEFLG_SPEED;

  const calc = (swe as any).swe_calc_ut;
  const bodies = PLANETS.map(p=>{
    const r = calc(jdUT, p.id, FLAG);
    const lon = Number(r.longitude);
    return { key:p.key, lon, lat:Number(r.latitude), speed:Number(r.longitudeSpeed), sign:signOf(lon) };
  });

  const hs = (input.houseSystem ?? 'P').toUpperCase();
  const H  = (swe as any).swe_houses(jdUT, input.lat, input.lon, hs);
  const cusps = Array.from({length:12}, (_,i)=> Number(H.houseCusps[i+1]));
  const asc   = Number(H.ascmc[0]);
  const mc    = Number(H.ascmc[1]);

  const planets = bodies.map(b => ({ ...b, house: houseOf(b.lon, cusps) }));

  return {
    jdUT,
    planets,
    houses: { cusps, asc, mc },
    bigThree: {
      Sun: planets.find(p=>p.key==='Sun')?.sign ?? '',
      Moon: planets.find(p=>p.key==='Moon')?.sign ?? '',
      Ascendant: signOf(asc)
    }
  };
}