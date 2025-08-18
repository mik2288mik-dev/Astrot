import type { BirthData } from '../birth/types';

// Используем единую модель BirthData
export type NatalInput = BirthData;

export type NatalResult = {
  big3: {
    sun: { sign: string; degree: number };
    moon: { sign: string; degree: number };
    asc: { sign: string | null; degree: number | null; approx?: boolean };
  };
  elements: { fire: number; earth: number; air: number; water: number };
};

export async function calcNatal(input: NatalInput): Promise<NatalResult> {
  const res = await fetch('/api/chart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  
  if (!res.ok) {
    throw new Error('calc failed');
  }
  
  return res.json();
}