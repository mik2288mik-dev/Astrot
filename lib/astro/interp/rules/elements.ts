// Анализ элементов и крестов
// Темперамент и подход к жизни

import type { ChartData } from '../../types';

export function analyzeElements(chartData: ChartData) {
  const items: string[] = [];
  const highlights: Array<{ tag: 'strength' | 'risk' | 'advice'; text: string }> = [];

  const { elements, qualities } = chartData;
  
  // Анализ доминирующих элементов
  const dominantElement = findDominantElement(elements);
  const elementAnalysis = getElementAnalysis(dominantElement, elements);
  
  items.push(`🔥 Доминирующий элемент: ${elementAnalysis.name}`);
  items.push(elementAnalysis.description);
  
  if (elementAnalysis.strength) {
    highlights.push({ tag: 'strength', text: elementAnalysis.strength });
  }
  
  if (elementAnalysis.advice) {
    highlights.push({ tag: 'advice', text: elementAnalysis.advice });
  }

  // Анализ недостающих элементов
  const missingElement = findMissingElement(elements);
  if (missingElement) {
    const missingAnalysis = getMissingElementAdvice(missingElement);
    items.push(`⚠️ Слабый элемент: ${missingAnalysis.name}`);
    items.push(missingAnalysis.advice);
    highlights.push({ tag: 'advice', text: missingAnalysis.highlight });
  }

  // Анализ крестов (качеств)
  const dominantQuality = findDominantQuality(qualities);
  const qualityAnalysis = getQualityAnalysis(dominantQuality, qualities);
  
  items.push(`⚡ Доминирующий крест: ${qualityAnalysis.name}`);
  items.push(qualityAnalysis.description);
  
  if (qualityAnalysis.strength) {
    highlights.push({ tag: 'strength', text: qualityAnalysis.strength });
  }

  // Анализ баланса элементов
  const balance = analyzeElementBalance(elements);
  if (balance) {
    items.push(`⚖️ ${balance.description}`);
    if (balance.highlight) {
      highlights.push({ tag: balance.highlight.tag, text: balance.highlight.text });
    }
  }

  return {
    items,
    highlights,
    tip: 'Элементы показывают ваш темперамент, а кресты - подход к действию. Развивайте слабые стороны для гармонии.'
  };
}

function findDominantElement(elements: ChartData['elements']) {
  const entries = Object.entries(elements);
  entries.sort(([,a], [,b]) => b - a);
  return entries[0][0];
}

function findMissingElement(elements: ChartData['elements']) {
  const entries = Object.entries(elements);
  const minElement = entries.find(([,count]) => count === 0);
  return minElement ? minElement[0] : null;
}

function findDominantQuality(qualities: ChartData['qualities']) {
  const entries = Object.entries(qualities);
  entries.sort(([,a], [,b]) => b - a);
  return entries[0][0];
}

function getElementAnalysis(element: string, elements: ChartData['elements']) {
  const elementData: Record<string, {
    name: string;
    description: string;
    strength: string;
    advice?: string;
  }> = {
    fire: {
      name: 'Огонь',
      description: 'Вы энергичны, инициативны и вдохновляете других. Любите действовать быстро и принимать решения.',
      strength: 'Ваш энтузиазм и лидерские качества помогают запускать новые проекты.',
      advice: elements.fire > 4 ? 'Иногда притормаживайте - не все готовы к вашему темпу.' : undefined
    },
    earth: {
      name: 'Земля',
      description: 'Вы практичны, надежны и умеете воплощать идеи в реальность. Цените стабильность и качество.',
      strength: 'Ваша способность к долгосрочному планированию и реализации - основа успеха.',
      advice: elements.earth > 4 ? 'Не бойтесь иногда рисковать и пробовать новое.' : undefined
    },
    air: {
      name: 'Воздух', 
      description: 'Вы мыслите концептуально, любите общение и обмен идеями. Легко адаптируетесь к новым ситуациям.',
      strength: 'Ваша способность видеть связи и генерировать идеи делает вас ценным партнером.',
      advice: elements.air > 4 ? 'Старайтесь доводить идеи до практической реализации.' : undefined
    },
    water: {
      name: 'Вода',
      description: 'Вы интуитивны, эмоционально глубоки и чувствительны к настроениям других. Цените искренность.',
      strength: 'Ваша эмпатия и интуиция помогают понимать людей и ситуации на глубоком уровне.',
      advice: elements.water > 4 ? 'Учитесь защищать свои границы от чужих эмоций.' : undefined
    }
  };

  return elementData[element] || {
    name: 'Смешанный',
    description: 'У вас сбалансированное сочетание разных элементов.',
    strength: 'Ваша многогранность позволяет адаптироваться к разным ситуациям.'
  };
}

function getMissingElementAdvice(element: string) {
  const advice: Record<string, { name: string; advice: string; highlight: string }> = {
    fire: {
      name: 'Огонь',
      advice: 'Вам может не хватать инициативности и спонтанности.',
      highlight: 'Развивайте решительность - ставьте цели и действуйте, не дожидаясь идеальных условий.'
    },
    earth: {
      name: 'Земля',
      advice: 'Вам может не хватать практичности и терпения.',
      highlight: 'Учитесь планировать и доводить дела до конца - это основа стабильности.'
    },
    air: {
      name: 'Воздух',
      advice: 'Вам может не хватать объективности и коммуникативных навыков.',
      highlight: 'Развивайте логическое мышление и учитесь выражать свои мысли ясно.'
    },
    water: {
      name: 'Вода',
      advice: 'Вам может не хватать эмоциональной глубины и интуиции.',
      highlight: 'Прислушивайтесь к своим чувствам и развивайте эмпатию к другим.'
    }
  };

  return advice[element] || {
    name: 'Элемент',
    advice: 'Развивайте разные стороны своей личности.',
    highlight: 'Баланс всех элементов создает гармоничную личность.'
  };
}

function getQualityAnalysis(quality: string, qualities: ChartData['qualities']) {
  const qualityData: Record<string, {
    name: string;
    description: string;
    strength: string;
  }> = {
    cardinal: {
      name: 'Кардинальный (Инициация)',
      description: 'Вы хорошо начинаете новые дела и проекты. Любите быть первопроходцем.',
      strength: 'Ваша способность к началу новых циклов делает вас естественным лидером перемен.'
    },
    fixed: {
      name: 'Фиксированный (Стабилизация)',
      description: 'Вы умеете развивать и укреплять то, что уже начато. Обладаете выносливостью.',
      strength: 'Ваша способность к концентрации и упорству помогает доводить дела до совершенства.'
    },
    mutable: {
      name: 'Мутабельный (Адаптация)',
      description: 'Вы легко приспосабливаетесь к изменениям и можете работать в разных направлениях.',
      strength: 'Ваша гибкость и многозадачность позволяют находить решения в сложных ситуациях.'
    }
  };

  return qualityData[quality] || {
    name: 'Смешанный',
    description: 'У вас сбалансированный подход к действиям.',
    strength: 'Ваша универсальность помогает в разных жизненных ситуациях.'
  };
}

function analyzeElementBalance(elements: ChartData['elements']) {
  const total = Object.values(elements).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) return null;

  // Проверяем на крайний дисбаланс
  const maxElement = Math.max(...Object.values(elements));
  const minElement = Math.min(...Object.values(elements));
  
  if (maxElement >= total * 0.6) {
    return {
      description: 'У вас ярко выраженный доминирующий элемент - это дает силу, но может создавать односторонность.',
      highlight: {
        tag: 'advice' as const,
        text: 'Сознательно развивайте качества других элементов для большей гармонии.'
      }
    };
  }
  
  if (maxElement - minElement <= 1) {
    return {
      description: 'У вас очень сбалансированное распределение элементов - это редкость.',
      highlight: {
        tag: 'strength' as const,
        text: 'Ваша многогранность позволяет понимать разных людей и адаптироваться к любым ситуациям.'
      }
    };
  }

  // Анализ конкретных комбинаций
  const { fire, earth, air, water } = elements;
  
  if (fire > 0 && earth > 0 && air === 0 && water === 0) {
    return {
      description: 'У вас практичный энтузиазм - вы умеете воплощать идеи в жизнь.',
      highlight: {
        tag: 'strength' as const,
        text: 'Сочетание огня и земли дает вам силу для реализации амбициозных проектов.'
      }
    };
  }

  if (air > 0 && water > 0 && fire === 0 && earth === 0) {
    return {
      description: 'У вас интуитивный интеллект - вы понимаете людей и идеи на глубоком уровне.',
      highlight: {
        tag: 'strength' as const,
        text: 'Сочетание воздуха и воды делает вас отличным консультантом и творческим человеком.'
      }
    };
  }

  return null;
}