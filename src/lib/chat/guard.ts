export type Domain = 'astro'|'numerology'|'tarot';

const RX = {
  astro: /(натал|натальная|гороскоп|знак|асценден|десценден|дом[а-я]*\b|аспект|синастр|совместим|транзит|соляр|лунар|ретроград|эфемерид|планет|венер|марс|юпитер|сатурн|уран|нептун|плутон|солнц|лун[аы]|меркур)/i,
  numerology: /(нумеролог|число судьбы|число души|матриц|пифагор|жизненн(?:ое|ый) число|квадрат пифагор|личн\w* число|судьб\w* число)/i,
  tarot: /(таро|аркан|расклад|колод[аы]|спред|карт[аы].*гадан|младш|старш|жезл|кубк|меч|пентакл)/i,
};

export function classify(text: string): Domain | null {
  if (RX.astro.test(text)) return 'astro';
  if (RX.numerology.test(text)) return 'numerology';
  if (RX.tarot.test(text)) return 'tarot';
  return null;
}

export type GuardDecision =
  | { action:'allow'; domain: Domain }                        // пропустить
  | { action:'soft-redirect'; domain: Domain }                // ответить по домену, но тактично вернуть в тему
  | { action:'ask-domain'; options: {label:string;prompt:string}[] }; // показать варианты (1 раз)

export function decide(prev: Domain | null, text: string, lastWasGuard: boolean): GuardDecision {
  const cls = classify(text);
  if (cls) return { action: 'allow', domain: cls };
  
  // Если есть предыдущий домен, используем мягкое перенаправление
  if (prev) return { action: 'soft-redirect', domain: prev };
  
  // Если последний ответ был от стража, не зацикливаемся - переходим к астрологии
  if (lastWasGuard) return { action: 'soft-redirect', domain: 'astro' };
  
  // Показываем варианты только один раз
  return {
    action: 'ask-domain',
    options: [
      { label:'✨ Натальная карта', prompt:'Расскажи о моей натальной карте' },
      { label:'💕 Совместимость', prompt:'Проверь нашу совместимость по датам рождения' },
      { label:'🔢 Нумерология', prompt:'Посчитай мое число судьбы' },
      { label:'🃏 Таро', prompt:'Сделай расклад таро на ситуацию' },
    ],
  };
}

// Оставляем для обратной совместимости
export function detectDomain(q: string): Domain | null {
  return classify(q);
}

export function isAllowed(q: string) { 
  const d = classify(q); 
  return { allowed: !!d, domain: d }; 
}