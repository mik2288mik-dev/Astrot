export type Domain = 'astro'|'numerology'|'tarot';

const W = {
  astro: /(натал|натальная|гороскоп|знак|дом|аспект|транзит|синастр|соляр|лунар|вершина|асцендент|десцендент|mc|ic|ретроград|эфемерид)/i,
  numerology: /(нумеролог|нумерологич|числ(?:о|а|а судьбы|о судьбы|о души)|матриц|пифагор|жизненн(?:ое|ый) число|день рождения цифры)/i,
  tarot: /(таро|расклад|аркан|карта таро|колода|спред)/i,
};

export function detectDomain(q: string): Domain | null {
  if (W.astro.test(q)) return 'astro';
  if (W.numerology.test(q)) return 'numerology';
  if (W.tarot.test(q)) return 'tarot';
  return null;
}

export function isAllowed(q: string) { 
  const d = detectDomain(q); 
  return { allowed: !!d, domain: d }; 
}