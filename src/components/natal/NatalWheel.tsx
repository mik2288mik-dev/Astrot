'use client';
import React, { useCallback, useMemo } from 'react';

const UI = {
  ink:'#1F2937', sub:'#6B7280', line:'#EAEAF2',
  lilac:'#C1B2FF', lilacDark:'#8B7CFF', lavender:'#EEF0FF', haze:'#F7F7FB'
};

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
  art?: { src: string; rotate?: boolean; opacity?: number };
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

export default function NatalWheel({ data, size=320, showAspects=true, className, onSelect, art }: Props) {
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
        <defs>
          <clipPath id="clipWheel"><circle cx={cx} cy={cy} r={R_outer} /></clipPath>
          <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="aurora" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#C1B2FF" stopOpacity=".8"/>
            <stop offset="60%" stopColor="#F5A8E9" stopOpacity=".5"/>
            <stop offset="100%" stopColor="#F5A8E9" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor={UI.haze}/>
          </radialGradient>
          <filter id="ds" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dy="1" result="o"/>
            <feGaussianBlur in="o" stdDeviation="1.5" result="b"/>
            <feColorMatrix in="b" type="matrix"
              values="0 0 0 0 0.05  0 0 0 0 0.1  0 0 0 0 0.35  0 0 0 0.25 0" result="s"/>
            <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* арт-фон из макета, под всеми слоями */}
        {art?.src && (
          <image
            href={art.src}
            x={cx - R_outer} y={cy - R_outer}
            width={R_outer * 2} height={R_outer * 2}
            clipPath="url(#clipWheel)"
            opacity={art.opacity ?? 0.92}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            className={art.rotate ? 'animate-slow-spin' : ''}
            pointerEvents="none"
          />
        )}

        {/* тонкое свечение по краю */}
        <circle cx={cx} cy={cy} r={R_outer-1} fill="none" stroke="url(#aurora)" strokeWidth="3" filter="url(#outerGlow)" opacity=".65" pointerEvents="none"/>

        {/* Фон и кольца */}
        <circle cx={cx} cy={cy} r={R_outer} fill="url(#ringGrad)" stroke={UI.line} strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={R_z_in} fill={UI.haze} stroke={UI.line} strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={R_h_out} fill="#FFF" stroke={UI.line} strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={R_h_in} fill="#FFF" stroke={UI.line} strokeWidth="1"/>

        {/* Деления знаков каждые 30° */}
        {signs.map(s => {
          const p = pt(cx, cy, R_z_in, s.lonStart);
          return (
            <line 
              key={`sign-div-${s.i}`} 
              x1={cx} y1={cy} 
              x2={p.x} y2={p.y} 
              stroke={UI.line} 
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
              fill={UI.sub}
              fontWeight={500}
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
              stroke={UI.line} 
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
              strokeWidth={1.4} 
              opacity={0.4}
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
              style={{ cursor: 'pointer', opacity: 1 }}
              className="hover:scale-110 transition-transform"
              filter="url(#ds)"
              onPointerDown={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onPointerUp={(e) => { e.currentTarget.style.opacity = '1'; }}
              onPointerLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <circle 
                r={10} 
                fill="#FFF" 
                stroke={UI.lilac} 
                strokeWidth="1.4"
              />
              <text 
                x={0} y={0.5} 
                fontSize={12.5} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fill={UI.lilacDark}
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