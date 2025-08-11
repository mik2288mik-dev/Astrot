import { AspectCode, angleToPoint, aspectColor, aspectOpacity, aspectStrokeWidth, normalizeAspectType } from './utils';

export default function AspectsLayer({
  cx,
  cy,
  r,
  aspects,
  planetPositions,
  highlight
}: {
  cx: number;
  cy: number;
  r: number;
  aspects: { a: string; b: string; type: string; orb: number }[];
  planetPositions: Map<string, { x: number; y: number; lon: number }>;
  highlight: string | null;
}) {
  const lines = aspects.map((a, idx) => {
    const t = normalizeAspectType(a.type);
    if (!t) return null;
    const A = planetPositions.get(a.a);
    const B = planetPositions.get(a.b);
    if (!A || !B) return null;
    const isHot = highlight && (a.a === highlight || a.b === highlight);
    const baseOpacity = aspectOpacity(a.orb);
    return (
      <line
        key={idx}
        x1={A.x}
        y1={A.y}
        x2={B.x}
        y2={B.y}
        stroke={aspectColor[t as AspectCode]}
        strokeWidth={isHot ? aspectStrokeWidth(a.orb) + 0.8 : aspectStrokeWidth(a.orb)}
        opacity={isHot ? Math.min(1, baseOpacity + 0.2) : baseOpacity}
      />
    );
  });

  return <g>{lines}</g>;
}