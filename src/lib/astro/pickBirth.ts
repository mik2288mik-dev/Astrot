export type BirthLike = { 
  date?: string; 
  time?: string; 
  city?: string; 
  place?: string;
};

export function pickBirthFromChart(chart: any): BirthLike {
  const a = chart?.inputData ?? {};
  const b = chart?.birth ?? {};
  const input = chart?.input ?? {};
  
  return {
    date: a.date ?? b.date ?? input.date ?? chart?.date ?? undefined,
    time: a.time ?? b.time ?? input.time ?? chart?.time ?? undefined,
    city: a.city ?? b.city ?? input.place?.displayName ?? chart?.city ?? chart?.place ?? undefined,
    place: a.place ?? b.place ?? input.place?.displayName ?? chart?.place ?? undefined,
  };
}