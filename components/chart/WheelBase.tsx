import { angleToPoint, signNamesRu } from './utils';

export default function WheelBase({ cx, cy, r, showSigns = true }: { cx: number; cy: number; r: number; showSigns?: boolean }) {
  const rings = [r, r * 0.86];
  const ticks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 360; i += 30) {
    const p1 = angleToPoint(cx, cy, r, i);
    const p2 = angleToPoint(cx, cy, r * 0.82, i);
    ticks.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={rings[0]} fill="white" fillOpacity={0.6} stroke="rgba(17,24,39,0.12)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={rings[1]} fill="none" stroke="rgba(17,24,39,0.12)" strokeWidth={1} />

      {ticks.map((t, idx) => (
        <line key={idx} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(17,24,39,0.18)" strokeWidth={1.2} />
      ))}

      {showSigns && (
        <g>
          {signNamesRu.map((sn, i) => {
            const ang = i * 30 + 15; // по центру сектора
            const p = angleToPoint(cx, cy, r * 0.9, ang);
            return (
              <text key={sn} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#0F1020" opacity={0.9}>
                {sn}
              </text>
            );
          })}
        </g>
      )}

      {/* тонкий внутренний круг для ориентира */}
      <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke="rgba(17,24,39,0.12)" strokeDasharray="2 3" />
    </g>
  );
}