import type { FullHoroscope, TransitHit } from './types';
import type { NatalChart, TransitResult } from './transit';

type Rules = {
  houseMeanings: Record<string, string[]>;
  templates: Array<{
    tr: string;
    type: string;
    to: string;
    why: string;
    adv: string;
    section: string; // Изменил на string для совместимости с JSON
  }>;
  typeNames: Record<string, string>;
  moonSignColors: Record<string, string>;
};

// Распределение домов по секциям
const houseSections: Record<number, ('love' | 'work' | 'health' | 'growth')[]> = {
  1: ['growth'],
  2: ['work'],
  3: ['growth'],
  4: ['health'],
  5: ['love'],
  6: ['work', 'health'],
  7: ['love'],
  8: ['growth'],
  9: ['growth'],
  10: ['work'],
  11: ['growth'],
  12: ['health']
};

function findTemplate(hit: TransitHit, templates: Rules['templates']) {
  // Ищем точное совпадение
  let template = templates.find(t => 
    t.tr === hit.trPlanet && 
    t.type === hit.type && 
    t.to === hit.toBody
  );
  
  // Если не найдено, ищем по планете и аспекту (для любого тела)
  if (!template) {
    template = templates.find(t => 
      t.tr === hit.trPlanet && 
      t.type === hit.type
    );
  }
  
  // Если и это не найдено, ищем общий шаблон по аспекту
  if (!template) {
    template = templates.find(t => t.type === hit.type);
  }
  
  return template;
}

function generateTLDR(hits: TransitHit[], rules: Rules) {
  // Определяем настроение по доминирующим аспектам
  const aspectCounts = hits.slice(0, 10).reduce((acc, hit) => {
    acc[hit.type] = (acc[hit.type] || 0) + hit.score;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantAspect = Object.entries(aspectCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  const mood = ['trine', 'sextile'].includes(dominantAspect || '') ? 'ровный' : 'напряжённый';
  
  // Энергия по Марсу/Солнцу
  const energyHits = hits.filter(h => ['Mars', 'Sun'].includes(h.trPlanet));
  const energy = energyHits.length > 0 && energyHits[0]?.score > 0.7 ? 'высокая' : 'умеренная';
  
  // Фокус по Меркурию/Сатурну
  const focusHits = hits.filter(h => ['Mercury', 'Saturn'].includes(h.trPlanet));
  const focus = focusHits.length > 0 ? 'на деталях' : 'на общей картине';
  
  return { mood, energy, focus };
}

function generateTimeline(hits: TransitHit[], moon: TransitResult['moon']) {
  const phaseTips = {
    'Новолуние': ['Планируйте новые проекты', 'Медитируйте и отдыхайте', 'Ставьте намерения'],
    'Растущая Луна': ['Активно работайте', 'Развивайте отношения', 'Накапливайте ресурсы'],
    'Полнолуние': ['Завершайте дела', 'Принимайте решения', 'Празднуйте достижения'],
    'Убывающая Луна': ['Отпускайте лишнее', 'Очищайтесь', 'Анализируйте прошлое']
  };
  
  const baseTips = phaseTips[moon.phase as keyof typeof phaseTips] || phaseTips['Новолуние'];
  
  // Утро - топ хит
  const morningHit = hits[0];
  const morningScore = morningHit ? Math.min(90, morningHit.score * 100) : 70;
  
  // День - средний хит
  const dayHit = hits[1] || hits[0];
  const dayScore = dayHit ? Math.min(95, dayHit.score * 100) : 75;
  
  // Вечер - более спокойный
  const eveningScore = 65;
  
  return [
    {
      part: 'morning' as const,
      score: Math.round(morningScore),
      tips: [baseTips[0] || 'Начинайте день с позитивом', 'Следите за энергией']
    },
    {
      part: 'day' as const,
      score: Math.round(dayScore),
      tips: [baseTips[1] || 'Активно действуйте', 'Используйте возможности']
    },
    {
      part: 'evening' as const,
      score: Math.round(eveningScore),
      tips: [baseTips[2] || 'Подводите итоги', 'Отдыхайте и восстанавливайтесь']
    }
  ];
}

export function buildHoroscope(
  natal: NatalChart, 
  transitResult: TransitResult, 
  rules: Rules
): FullHoroscope {
  const { hits, moon } = transitResult;
  const topHits = hits.slice(0, 3);
  
  // Ключевые транзиты
  const keyTransits = topHits.map(hit => {
    const template = findTemplate(hit, rules.templates);
    const typeName = rules.typeNames[hit.type] || hit.type;
    const houseNum = hit.house || 1;
    const houseMeanings = rules.houseMeanings[houseNum.toString()] || ['жизнь'];
    
    return {
      title: `${hit.trPlanet} ${typeName} ${hit.toBody} в ${houseNum} доме`,
      why: template?.why || `${hit.trPlanet} формирует ${typeName} с ${hit.toBody}`,
      advice: (template?.adv || 'Используйте эту энергию мудро') + 
              `. Фокус на: ${houseMeanings.join(' и ')}.`
    };
  });
  
  // Распределяем хиты по секциям
  const sections = {
    love: [] as string[],
    work: [] as string[],
    health: [] as string[],
    growth: [] as string[]
  };
  
  hits.slice(0, 12).forEach(hit => {
    const template = findTemplate(hit, rules.templates);
    const houseNum = hit.house || 1;
    const houseSectionsList = houseSections[houseNum] || ['growth'];
    
    let targetSection = (template?.section as ('love' | 'work' | 'health' | 'growth')) || houseSectionsList[0] || 'growth';
    
    // Дополнительная логика по домам
    if ([5, 7].includes(houseNum)) targetSection = 'love';
    else if ([2, 6, 10].includes(houseNum)) targetSection = 'work';
    else if ([4, 6, 12].includes(houseNum)) targetSection = 'health';
    
    const advice = template?.adv || `Влияние ${hit.trPlanet} через ${rules.typeNames[hit.type] || hit.type}`;
    
    if (sections[targetSection].length < 5) {
      sections[targetSection].push(advice);
    }
  });
  
  // Заполняем пустые секции общими советами
  if (sections.love.length === 0) sections.love.push('Время для гармонии в отношениях');
  if (sections.work.length === 0) sections.work.push('Сосредоточьтесь на текущих задачах');
  if (sections.health.length === 0) sections.health.push('Поддерживайте баланс и режим');
  if (sections.growth.length === 0) sections.growth.push('Развивайте свои способности');
  
  // Общий счет дня
  const totalScore = hits.slice(0, 5).reduce((sum, hit) => sum + hit.score, 0);
  const normalizedScore = Math.min(100, Math.max(0, Math.round(totalScore * 20)));
  
  // TL;DR
  const tldrData = generateTLDR(hits, rules);
  const today = new Date();
  const luckyNumber = (today.getDate() % 9) + 1;
  const luckyColor = rules.moonSignColors[moon.sign] || '#4ECDC4';
  
  // Timeline
  const timeline = generateTimeline(hits, moon);
  
  return {
    dateISO: today.toISOString().split('T')[0] || '',
    score: normalizedScore,
    tldr: {
      ...tldrData,
      lucky: { color: luckyColor, number: luckyNumber }
    },
    keyTransits,
    sections,
    moon,
    timeline,
    debug: { hits: hits.slice(0, 10) }
  };
}