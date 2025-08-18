export type NatalInput = {
  name?: string;
  date: string;           // 'YYYY-MM-DD'
  time: string;           // 'HH:mm' (если unknownTime=true — '12:00')
  unknownTime?: boolean;
  place: { lat: number; lon: number; displayName: string; tz?: string };
};

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