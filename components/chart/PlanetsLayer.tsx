import { angleToPoint } from './utils';

export type Planet = { name: string; lon: number; retro?: boolean };

export default function PlanetsLayer({
  cx,
  cy,
  r,
  planets,
  selected,
  onSelect
}: {
  cx: number;
  cy: number;
  r: number;
  planets: Planet[];
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  return (
    <g>
      {planets.map((p) => {
        const pt = angleToPoint(cx, cy, r, p.lon);
        const isSel = selected === p.name;
        return (
          <g key={p.name} onClick={() => onSelect(isSel ? null : p.name)} style={{ cursor: 'pointer' }}>
            <circle cx={pt.x} cy={pt.y} r={10} fill={isSel ? '#A16BFE' : '#0F1020'} filter={isSel ? 'url(#glow)' : undefined} />
            <text x={pt.x} y={pt.y + 18} textAnchor="middle" fontSize={10} fill="#0F1020" opacity={0.9}>{p.name}</text>
            {/* hit-area */}
            <circle cx={pt.x} cy={pt.y} r={20} fill="transparent" />
          </g>
        );
      })}
    </g>
  );
}