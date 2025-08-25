export const PLANET_LABELS: Record<string, string> = {
  Sun: 'Солнце', 
  Moon: 'Луна', 
  Mercury: 'Меркурий', 
  Venus: 'Венера',
  Mars: 'Марс', 
  Jupiter: 'Юпитер', 
  Saturn: 'Сатурн', 
  Uranus: 'Уран',
  Neptune: 'Нептун', 
  Pluto: 'Плутон', 
  ASC: 'Асцендент', 
  MC: 'Средина неба'
};

export const ASPECT_LABELS: Record<string, string> = {
  conj: 'соединение', 
  conjunction: 'соединение',
  opp: 'оппозиция', 
  opposition: 'оппозиция',
  sq: 'квадрат', 
  square: 'квадрат',
  tr: 'трин', 
  trine: 'трин',
  sext: 'секстиль', 
  sextile: 'секстиль'
};

export function labelPlanet(code?: string) {
  if (!code) return '—';
  return PLANET_LABELS[code] ?? code; // fallback — покажем код как есть
}

export function labelAspect(code?: string) {
  if (!code) return '—';
  return ASPECT_LABELS[code] ?? code;
}

// «человечный» заголовок для аспекта: Sun square Moon -> Солнце квадрат Луна
export function formatAspectTitle(a: { a?: string; b?: string; type?: string }) {
  const left = labelPlanet(a.a);
  const right = labelPlanet(a.b);
  const asp = labelAspect(a.type);
  return `${left} ${asp} ${right}`.replace(/\s+/g, ' ').trim();
}