export type Domain = 'astro'|'numerology'|'tarot';

const RX = {
  astro: /(натал|натальная|гороскоп|знак|асценден|десценден|дом[а-я]*\b|аспект|синастр|совместим|транзит|соляр|лунар|ретроград|эфемерид)/i,
  numerology: /(нумеролог|число судьбы|число души|матриц|пифагор|жизненн(?:ое|ый) число)/i,
  tarot: /(таро|аркан|расклад|колод[аы]|спред)/i,
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
  if (prev)  return { action: 'soft-redirect', domain: prev }; // уже выбрана тема — не блокируем диалог
  if (lastWasGuard) return { action: 'soft-redirect', domain: 'astro' }; // чтобы не зацикливать
  return {
    action: 'ask-domain',
    options: [
      { label:'Натальная карта', prompt:'Разбери мою натальную карту' },
      { label:'Совместимость',   prompt:'Синастрия: совместимость по датам' },
      { label:'Нумерология',     prompt:'Посчитай число судьбы' },
      { label:'Таро',            prompt:'Сделай расклад на неделю' },
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