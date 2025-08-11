export type PolarPoint = { x: number; y: number };

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// 0° Овна — вверх; рост долгот против часовой стрелки
export function angleToPoint(centerX: number, centerY: number, radius: number, angleDeg: number): PolarPoint {
  const rad = degToRad(angleDeg - 90);
  return {
    x: centerX + radius * Math.cos(rad),
    y: centerY + radius * Math.sin(rad)
  };
}

export type AspectCode = 'CONJ' | 'SEXT' | 'SQR' | 'TRN' | 'OPP';

export function normalizeAspectType(t: string): AspectCode | undefined {
  const v = t.toLowerCase();
  if (v.startsWith('conj')) return 'CONJ';
  if (v.startsWith('sext')) return 'SEXT';
  if (v.startsWith('squ')) return 'SQR';
  if (v.startsWith('tri')) return 'TRN';
  if (v.startsWith('opp')) return 'OPP';
  return undefined;
}

export const aspectColor: Record<AspectCode, string> = {
  CONJ: '#6B6B6B',
  SEXT: '#5BA8A0',
  SQR: '#E66A80',
  TRN: '#6AA8E6',
  OPP: '#E69A6A'
};

export function aspectStrokeWidth(orb: number): number {
  const clamped = Math.max(0, Math.min(1, 1 - orb / 6));
  return 1.5 + clamped * 1.0; // 1.5–2.5
}

export function aspectOpacity(orb: number): number {
  const clamped = Math.max(0, Math.min(1, 1 - orb / 6));
  return 0.35 + clamped * 0.55; // 0.35–0.9
}

export function clamp(min: number, v: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function formatDegree(lon: number): string {
  const norm = ((lon % 360) + 360) % 360;
  const deg = Math.floor(norm % 30);
  const min = Math.round(((norm % 1) * 60));
  return `${deg}°${String(min).padStart(2, '0')}`;
}

export const signNamesRu = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'];

export function signIndexFromLon(lon: number): number {
  const norm = ((lon % 360) + 360) % 360;
  return Math.floor(norm / 30);
}

export function signNameRu(lon: number): string {
  return signNamesRu[signIndexFromLon(lon)];
}