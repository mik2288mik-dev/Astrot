'use client';
import React, { useCallback, useMemo } from 'react';

type PlanetId =
  | 'Sun'|'Moon'|'Mercury'|'Venus'|'Mars'|'Jupiter'|'Saturn'
  | 'Uranus'|'Neptune'|'Pluto'|'Node'|'ASC'|'MC';

export type PlanetPos = { id: PlanetId | string; lon: number; speed?: number };
export type HouseCusp = { index: number; lon: number };
export type Aspect = {
  a: string; b: string;
  type: 'conjunction'|'opposition'|'trine'|'square'|'sextile';
  orb?: number;
};
export type ChartData = { planets: PlanetPos[]; houses?: HouseCusp[]; aspects?: Aspect[] };

export type SelectEntity =
  | { kind: 'planet'; id: string; lon: number }
  | { kind: 'house'; id: string; lon: number }
  | { kind: 'sign';  id: string; lon: number };

type Props = {
  data: ChartData;
  size?: number;
  showAspects?: boolean;
  className?: string;
  onSelect?: (e: SelectEntity) => void;
};

const PLANET_GLYPH: Record<string, string> = {
  Sun:'☉', Moon:'☾', Mercury:'☿', Venus:'♀', Mars:'♂',
  Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Pluto:'♇',
  Node:'☊', ASC:'↑', MC:'⊥'
};
const ASPECT_COLOR = {
  conjunction:'#6B7280', opposition:'#EF4444', square:'#F59E0B', trine:'#22C55E', sextile:'#3B82F6'
} as const;

const d2r = (d:number)=> d*Math.PI/180;
const pt = (cx:number,cy:number,r:number,lon:number)=>{
  const a = d2r(90 - lon); return { x: cx + r*Math.cos(a), y: cy - r*Math.sin(a) };
};

export default function NatalWheel({ data, size=320, showAspects=true, className, onSelect }: Props) {
  // Мемоизация геометрических параметров
  const geometry = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const R_outer = size * 0.48;
    const R_z_in = R_outer - 28;
    const R_h_out = R_z_in - 6;
    const R_h_in = R_h_out - 26;
    const R_pl = R_h_in - 10;
    
    return { cx, cy, R_outer, R_z_in, R_h_out, R_h_in, R_pl };
  }, [size]);

  // Мемоизация знаков зодиака
  const signs = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      i,
      name: ['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi'][i],
      lonStart: i * 30,
      lonMid: i * 30 + 15
    }))
  , []);

  // Оптимизированные обработчики событий
  const handleSignClick = useCallback((name: string, lon: number) => {
    onSelect?.({ kind: 'sign', id: name, lon });
  }, [onSelect]);

  const handleHouseClick = useCallback((index: number, lon: number) => {
    onSelect?.({ kind: 'house', id: String(index), lon });
  }, [onSelect]);

  const handlePlanetClick = useCallback((id: string, lon: number) => {
    onSelect?.({ kind: 'planet', id, lon });
  }, [onSelect]);

  const { cx, cy, R_outer, R_z_in, R_h_out, R_h_in, R_pl } = geometry;

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        width={size} 
        height={size} 
        role="img" 
        aria-label="Natal wheel"
        style={{ willChange: 'transform' }}
      >
        {/* Фон и кольца */}
        <circle cx={cx} cy={cy} r={R_outer} fill="#FFF" stroke="#EAEAF2" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={R_z_in}  fill="#F7F7FB" stroke="#EAEAF2" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={R_h_out} fill="#FFF" stroke="#EAEAF2" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={R_h_in}  fill="#F9FAFB" stroke="#EAEAF2" strokeWidth="1"/>

        {/* Деления знаков каждые 30° */}
        {signs.map(s => {
          const p = pt(cx, cy, R_z_in, s.lonStart);
          return (
            <line 
              key={`sign-div-${s.i}`} 
              x1={cx} y1={cy} 
              x2={p.x} y2={p.y} 
              stroke="#E5E7EB" 
              strokeWidth="1"
            />
          );
        })}

        {/* Подписи знаков (кликабельные) */}
        {signs.map(s => {
          const m = pt(cx, cy, (R_outer + R_z_in) / 2, s.lonMid);
          return (
            <text 
              key={`sign-label-${s.i}`} 
              x={m.x} y={m.y} 
              fontSize={12} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fill="#6B7280"
              onClick={() => handleSignClick(s.name, s.lonMid)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              className="hover:fill-purple-600 transition-colors"
            >
              {s.name}
            </text>
          );
        })}

        {/* Дома - лучи по houses[i].lon */}
        {data.houses?.length === 12 && data.houses.map(h => {
          const a = pt(cx, cy, R_h_out, h.lon);
          return (
            <line 
              key={`house-${h.index}`} 
              x1={cx} y1={cy} 
              x2={a.x} y2={a.y} 
              stroke="#D1D5DB" 
              strokeWidth={1.2}
              onClick={() => handleHouseClick(h.index, h.lon)}
              style={{ cursor: 'pointer' }}
              className="hover:stroke-purple-500 transition-colors"
            />
          );
        })}

        {/* Аспекты - линии между планетами */}
        {showAspects && data.aspects?.map((as, i) => {
          const A = data.planets.find(p => p.id === as.a);
          const B = data.planets.find(p => p.id === as.b);
          if (!A || !B) return null;
          
          const p1 = pt(cx, cy, R_pl, A.lon);
          const p2 = pt(cx, cy, R_pl, B.lon);
          
          return (
            <line 
              key={`aspect-${i}`} 
              x1={p1.x} y1={p1.y} 
              x2={p2.x} y2={p2.y} 
              stroke={ASPECT_COLOR[as.type] || '#6B7280'} 
              strokeWidth={1.2} 
              opacity={0.35}
              style={{ pointerEvents: 'none' }}
            />
          );
        })}

        {/* Планеты - точки с глифами */}
        {data.planets.map(pl => {
          const p = pt(cx, cy, R_pl, pl.lon);
          const glyph = PLANET_GLYPH[pl.id] ?? '•';
          
          return (
            <g 
              key={pl.id} 
              transform={`translate(${p.x},${p.y})`} 
              onClick={() => handlePlanetClick(pl.id, pl.lon)}
              style={{ cursor: 'pointer' }}
              className="hover:scale-110 transition-transform"
            >
              <circle 
                r={9} 
                fill="#FFF" 
                stroke="#C7D2FE" 
                strokeWidth="1.2"
                className="hover:fill-purple-50 hover:stroke-purple-400 transition-colors"
              />
              <text 
                x={0} y={0.5} 
                fontSize={12} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fill="#4F46E5"
                style={{ pointerEvents: 'none' }}
              >
                {glyph}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}