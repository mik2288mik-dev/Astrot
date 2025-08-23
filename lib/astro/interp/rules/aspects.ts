// Анализ аспектов - внутренние динамики
// Ключевые взаимодействия планет

import type { ChartData, Aspect } from '../../types';

export function analyzeAspects(chartData: ChartData) {
  const items: string[] = [];
  const highlights: Array<{ tag: 'strength' | 'risk' | 'advice'; text: string }> = [];

  if (chartData.aspects.length === 0) {
    return { items, highlights, tip: '' };
  }

  // Фильтруем только значимые аспекты
  const significantAspects = chartData.aspects.filter(aspect => 
    aspect.strength === 'tight' || 
    (aspect.strength === 'moderate' && ['conjunction', 'opposition', 'square', 'trine'].includes(aspect.type))
  );

  if (significantAspects.length === 0) {
    return { items, highlights, tip: 'У вас мягкие аспекты - меньше внутренних конфликтов, но и меньше драйва.' };
  }

  // Анализируем паттерны аспектов
  const aspectPatterns = analyzeAspectPatterns(significantAspects);
  if (aspectPatterns.length > 0) {
    items.push(...aspectPatterns);
  }

  // Анализируем ключевые аспекты с важными планетами
  const keyAspects = analyzeKeyAspects(significantAspects);
  keyAspects.forEach(analysis => {
    items.push(`${getAspectIcon(analysis.aspect.type)} ${analysis.description}`);
    if (analysis.strength) {
      highlights.push({ tag: 'strength', text: analysis.strength });
    }
    if (analysis.advice) {
      highlights.push({ tag: 'advice', text: analysis.advice });
    }
    if (analysis.risk) {
      highlights.push({ tag: 'risk', text: analysis.risk });
    }
  });

  // Общий анализ баланса аспектов
  const balance = analyzeAspectBalance(significantAspects);
  if (balance) {
    items.push(`⚖️ ${balance.description}`);
    if (balance.highlight) {
      highlights.push({ tag: balance.highlight.tag, text: balance.highlight.text });
    }
  }

  return {
    items,
    highlights,
    tip: 'Аспекты показывают внутренние динамики. Напряженные учат и мотивируют, гармоничные дают таланты.'
  };
}

function analyzeAspectPatterns(aspects: Aspect[]) {
  const patterns: string[] = [];

  // Анализируем T-квадраты (три планеты в квадратах и оппозиции)
  const tSquares = findTSquares(aspects);
  tSquares.forEach(tSquare => {
    patterns.push(`🎯 T-квадрат: ${tSquare.description} - источник сильной мотивации, но требует баланса.`);
  });

  // Анализируем Большие трины (три планеты в тринах)
  const grandTrines = findGrandTrines(aspects);
  grandTrines.forEach(trine => {
    patterns.push(`🔺 Большой трин: ${trine.description} - природный талант, но нужна активация.`);
  });

  // Анализируем стеллиумы через аспекты
  const stelliums = findAspectStelliums(aspects);
  stelliums.forEach(stellium => {
    patterns.push(`⭐ Стеллиум в аспектах: ${stellium.description} - концентрированная энергия.`);
  });

  return patterns;
}

function analyzeKeyAspects(aspects: Aspect[]) {
  const analyses: Array<{
    aspect: Aspect;
    description: string;
    strength?: string;
    advice?: string;
    risk?: string;
  }> = [];

  // Приоритизируем аспекты с важными планетами
  const importantPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
  
  aspects.forEach(aspect => {
    const isImportant = importantPlanets.includes(aspect.planet1) || 
                       importantPlanets.includes(aspect.planet2);
    
    if (isImportant || aspect.strength === 'tight') {
      const analysis = getAspectAnalysis(aspect);
      if (analysis) {
        analyses.push(analysis);
      }
    }
  });

  // Сортируем по важности и берем топ-5
  return analyses
    .sort((a, b) => getAspectImportance(b.aspect) - getAspectImportance(a.aspect))
    .slice(0, 5);
}

function getAspectAnalysis(aspect: Aspect) {
  const { planet1, planet2, type, strength } = aspect;
  
  // Специальные анализы для конкретных комбинаций
  const key = `${planet1}-${planet2}-${type}`;
  const reverseKey = `${planet2}-${planet1}-${type}`;
  
  const specificAnalyses = getSpecificAspectAnalyses();
  let analysis = (specificAnalyses as any)[key] || (specificAnalyses as any)[reverseKey];
  
  if (!analysis) {
    // Общий анализ по типу аспекта и планетам
    analysis = getGeneralAspectAnalysis(planet1, planet2, type);
  }

  if (!analysis) return null;

  return {
    aspect,
    description: `${planet1} ${getAspectName(type)} ${planet2}: ${analysis.description}`,
    strength: analysis.strength,
    advice: analysis.advice,
    risk: analysis.risk
  };
}

function getSpecificAspectAnalyses() {
  return {
    'Sun-Moon-conjunction': {
      description: 'Ваши сознательные цели и эмоциональные потребности работают в унисон.',
      strength: 'Внутренняя целостность и ясность в том, чего вы хотите.'
    },
    'Sun-Moon-opposition': {
      description: 'Внутренний конфликт между тем, что вы хотите, и тем, что вам нужно.',
      advice: 'Учитесь балансировать рациональные цели с эмоциональными потребностями.'
    },
    'Sun-Moon-square': {
      description: 'Напряжение между вашей личностью и эмоциональной природой.',
      advice: 'Это напряжение может стать источником роста, если вы его осознаете.',
      risk: 'Внутренние противоречия могут создавать стресс.'
    },
    'Sun-Mercury-conjunction': {
      description: 'Ваше мышление тесно связано с личностью и целями.',
      strength: 'Ясность мысли и способность выражать свою суть словами.'
    },
    'Venus-Mars-conjunction': {
      description: 'Гармоничное сочетание любви и страсти в отношениях.',
      strength: 'Привлекательность и способность к страстным, но гармоничным отношениям.'
    },
    'Venus-Mars-square': {
      description: 'Напряжение между потребностью в гармонии и желанием действовать.',
      advice: 'Учитесь выражать страсть в конструктивной форме.',
      risk: 'Импульсивность в отношениях может создавать проблемы.'
    },
    'Mercury-Mars-conjunction': {
      description: 'Быстрое, энергичное мышление и прямая манера общения.',
      strength: 'Способность быстро принимать решения и убеждать других.',
      risk: 'Иногда говорите слишком резко или поспешно.'
    },
    'Sun-Saturn-square': {
      description: 'Внутреннее напряжение между самовыражением и самоограничением.',
      advice: 'Используйте дисциплину Сатурна для достижения солнечных целей.',
      risk: 'Склонность к самокритике и ограничению своих возможностей.'
    },
    'Moon-Saturn-square': {
      description: 'Эмоциональные ограничения и склонность к меланхолии.',
      advice: 'Работайте над принятием своих эмоций и развитием эмоциональной зрелости.',
      risk: 'Подавление эмоций может привести к депрессии.'
    }
  };
}

function getGeneralAspectAnalysis(planet1: string, planet2: string, type: string) {
  const planetMeanings: Record<string, string> = {
    'Sun': 'личность и цели',
    'Moon': 'эмоции и потребности',
    'Mercury': 'мышление и общение',
    'Venus': 'любовь и ценности',
    'Mars': 'энергия и действия',
    'Jupiter': 'рост и возможности',
    'Saturn': 'дисциплина и ограничения'
  };

  const meaning1 = planetMeanings[planet1] || planet1;
  const meaning2 = planetMeanings[planet2] || planet2;

  switch (type) {
    case 'conjunction':
      return {
        description: `Энергии ${meaning1} и ${meaning2} работают вместе, усиливая друг друга.`,
        strength: 'Концентрированная энергия в этой области дает силу.'
      };
    case 'trine':
      return {
        description: `Гармоничное взаимодействие между ${meaning1} и ${meaning2}.`,
        strength: 'Естественный талант в этой области.',
        advice: 'Развивайте этот дар - он дается легко, но требует применения.'
      };
    case 'sextile':
      return {
        description: `Возможности для развития через взаимодействие ${meaning1} и ${meaning2}.`,
        advice: 'Активно используйте эти возможности - они не придут сами.'
      };
    case 'square':
      return {
        description: `Напряжение между ${meaning1} и ${meaning2} создает мотивацию к росту.`,
        advice: 'Используйте это напряжение конструктивно для развития.',
        risk: 'Внутренний конфликт может создавать стресс, если его игнорировать.'
      };
    case 'opposition':
      return {
        description: `Необходимость балансировать ${meaning1} и ${meaning2}.`,
        advice: 'Найдите золотую середину между этими энергиями.',
        risk: 'Крайности в любую сторону создают дисбаланс.'
      };
    default:
      return null;
  }
}

function analyzeAspectBalance(aspects: Aspect[]) {
  const aspectCounts = {
    conjunction: 0,
    trine: 0,
    sextile: 0,
    square: 0,
    opposition: 0
  };

  aspects.forEach(aspect => {
    if (aspect.type in aspectCounts) {
      aspectCounts[aspect.type as keyof typeof aspectCounts]++;
    }
  });

  const harmonious = aspectCounts.conjunction + aspectCounts.trine + aspectCounts.sextile;
  const challenging = aspectCounts.square + aspectCounts.opposition;
  
  if (challenging === 0) {
    return {
      description: 'У вас преимущественно гармоничные аспекты - жизнь течет легко.',
      highlight: {
        tag: 'advice' as const,
        text: 'Ищите вызовы для роста - слишком легкая жизнь может привести к стагнации.'
      }
    };
  }
  
  if (harmonious === 0) {
    return {
      description: 'У вас много напряженных аспектов - жизнь полна вызовов.',
      highlight: {
        tag: 'strength' as const,
        text: 'Ваша способность преодолевать трудности делает вас сильнее и мудрее.'
      }
    };
  }
  
  if (challenging > harmonious * 2) {
    return {
      description: 'Преобладают напряженные аспекты - вы боец по натуре.',
      highlight: {
        tag: 'advice' as const,
        text: 'Найдите время для отдыха и гармонии - постоянная борьба истощает.'
      }
    };
  }
  
  if (harmonious > challenging * 2) {
    return {
      description: 'Преобладают гармоничные аспекты - у вас много природных талантов.',
      highlight: {
        tag: 'advice' as const,
        text: 'Активно развивайте свои таланты - они не реализуются сами по себе.'
      }
    };
  }

  return {
    description: 'У вас сбалансированное сочетание гармоничных и напряженных аспектов.',
    highlight: {
      tag: 'strength' as const,
      text: 'Этот баланс дает вам и таланты, и мотивацию для их развития.'
    }
  };
}

// Вспомогательные функции
function findTSquares(aspects: Aspect[]): Array<{ description: string }> {
  // Упрощенная логика поиска T-квадратов
  const squares = aspects.filter(a => a.type === 'square');
  const oppositions = aspects.filter(a => a.type === 'opposition');
  
  // Для простоты возвращаем пустой массив
  // В реальной реализации здесь была бы сложная логика поиска паттернов
  return [];
}

function findGrandTrines(aspects: Aspect[]): Array<{ description: string }> {
  // Упрощенная логика поиска Больших тринов
  return [];
}

function findAspectStelliums(aspects: Aspect[]): Array<{ description: string }> {
  // Упрощенная логика поиска стеллиумов
  return [];
}

function getAspectImportance(aspect: Aspect): number {
  const importantPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
  const planetScore = (importantPlanets.includes(aspect.planet1) ? 2 : 1) + 
                     (importantPlanets.includes(aspect.planet2) ? 2 : 1);
  
  const strengthScore = aspect.strength === 'tight' ? 3 : aspect.strength === 'moderate' ? 2 : 1;
  const typeScore = ['conjunction', 'opposition', 'square'].includes(aspect.type) ? 2 : 1;
  
  return planetScore * strengthScore * typeScore;
}

function getAspectName(type: string): string {
  const names: Record<string, string> = {
    conjunction: 'соединение',
    sextile: 'секстиль',
    square: 'квадрат', 
    trine: 'трин',
    opposition: 'оппозиция',
    quincunx: 'квинкунс'
  };
  return names[type] || type;
}

function getAspectIcon(type: string): string {
  const icons: Record<string, string> = {
    conjunction: '☌',
    sextile: '⚹',
    square: '□',
    trine: '△',
    opposition: '☍',
    quincunx: '⚻'
  };
  return icons[type] || '◯';
}