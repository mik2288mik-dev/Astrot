import { angleToPoint, formatDegree, signNameRu } from './utils';

export default function HousesLayer({ cx, cy, r, houses }: { cx: number; cy: number; r: number; houses: { cusps: number[]; asc: number; mc: number } | null }) {
  if (!houses) return null;
  const lines = houses.cusps.map((deg, i) => {
    const p1 = angleToPoint(cx, cy, r, deg);
    const p2 = angleToPoint(cx, cy, r * 0.6, deg);
    return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(17,24,39,0.25)" strokeWidth={1} />;
  });

  const ascP = angleToPoint(cx, cy, r, houses.asc);
  const mcP = angleToPoint(cx, cy, r, houses.mc);

  const smallBadge = (label: string, p: { x: number; y: number }, lon: number) => (
    <g>
      <circle cx={p.x} cy={p.y} r={12} fill="#FFFFFF" opacity={0.9} />
      <text x={p.x} y={p.y - 8} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fill="#0F1020">{label}</text>
      <text x={p.x} y={p.y + 4} textAnchor="middle" dominantBaseline="central" fontSize={10} fill="#6B7280">
        {formatDegree(lon)} {signNameRu(lon)}
      </text>
    </g>
  );

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(17,24,39,0.25)" />
      {lines}
      {smallBadge('ASC', ascP, houses.asc)}
      {smallBadge('MC', mcP, houses.mc)}
    </g>
  );
}