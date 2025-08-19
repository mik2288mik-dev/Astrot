// Анализ Big-3: Солнце, Луна, Асцендент
// Основа личности без мистификации

import type { ChartData } from '../../types';

export function analyzeBigThree(chartData: ChartData) {
  const items: string[] = [];
  const highlights: Array<{ tag: 'strength' | 'risk' | 'advice'; text: string }> = [];

  const sun = chartData.planets.find(p => p.name === 'Sun');
  const moon = chartData.planets.find(p => p.name === 'Moon');
  const sunSign = chartData.sunSign;
  const moonSign = chartData.moonSign;
  const risingSign = chartData.risingSign;

  // Анализ Солнца (основная личность)
  const sunAnalysis = getSunAnalysis(sunSign, sun?.house);
  items.push(`☉ Солнце в ${sunSign}: ${sunAnalysis.trait}`);
  if (sunAnalysis.strength) {
    highlights.push({ tag: 'strength', text: sunAnalysis.strength });
  }

  // Анализ Луны (эмоциональная природа)
  const moonAnalysis = getMoonAnalysis(moonSign, moon?.house);
  items.push(`☽ Луна в ${moonSign}: ${moonAnalysis.trait}`);
  if (moonAnalysis.advice) {
    highlights.push({ tag: 'advice', text: moonAnalysis.advice });
  }

  // Анализ Асцендента (внешнее проявление)
  const risingAnalysis = getRisingAnalysis(risingSign);
  items.push(`↗ Асцендент в ${risingSign}: ${risingAnalysis.trait}`);

  // Синергия между знаками
  const synergy = analyzeSynergy(sunSign, moonSign, risingSign);
  if (synergy) {
    items.push(`🔄 ${synergy.description}`);
    if (synergy.highlight) {
      highlights.push({ tag: synergy.highlight.tag, text: synergy.highlight.text });
    }
  }

  return {
    items,
    highlights,
    tip: 'Солнце - ваша суть, Луна - внутренний мир, Асцендент - как вас видят. Все три важны для понимания себя.'
  };
}

function getSunAnalysis(sign: string, house?: number) {
  const sunTraits: Record<string, { trait: string; strength?: string }> = {
    'Aries': {
      trait: 'Вы прирожденный лидер с огромной энергией. Любите быть первыми и не боитесь рисковать.',
      strength: 'Ваша решительность и энтузиазм вдохновляют окружающих.'
    },
    'Taurus': {
      trait: 'Вы цените стабильность и красоту. Обладаете практичным умом и умеете наслаждаться жизнью.',
      strength: 'Ваша надежность и терпение - основа для долгосрочного успеха.'
    },
    'Gemini': {
      trait: 'Вы любознательны и общительны. Быстро схватываете новую информацию и легко адаптируетесь.',
      strength: 'Ваша гибкость мышления помогает находить нестандартные решения.'
    },
    'Cancer': {
      trait: 'Вы чувствительны и заботливы. Семья и близкие отношения для вас очень важны.',
      strength: 'Ваша интуиция и эмпатия создают глубокие связи с людьми.'
    },
    'Leo': {
      trait: 'Вы яркая личность с творческим потенциалом. Любите быть в центре внимания и вдохновлять других.',
      strength: 'Ваша харизма и щедрость притягивают людей и открывают возможности.'
    },
    'Virgo': {
      trait: 'Вы внимательны к деталям и стремитесь к совершенству. Практичны и готовы помогать другим.',
      strength: 'Ваша аналитичность и организованность делают вас незаменимыми в любой команде.'
    },
    'Libra': {
      trait: 'Вы стремитесь к гармонии и справедливости. Обладаете хорошим вкусом и дипломатическими способностями.',
      strength: 'Ваше умение находить баланс помогает разрешать конфликты и создавать красоту.'
    },
    'Scorpio': {
      trait: 'Вы интенсивны и проницательны. Не боитесь глубины и способны к кардинальным изменениям.',
      strength: 'Ваша способность к трансформации позволяет преодолевать любые кризисы.'
    },
    'Sagittarius': {
      trait: 'Вы оптимистичны и свободолюбивы. Стремитесь к знаниям, путешествиям и новым горизонтам.',
      strength: 'Ваш энтузиазм и широкий взгляд на мир открывают множество возможностей.'
    },
    'Capricorn': {
      trait: 'Вы амбициозны и дисциплинированы. Умеете ставить долгосрочные цели и достигать их.',
      strength: 'Ваша целеустремленность и ответственность - ключи к серьезным достижениям.'
    },
    'Aquarius': {
      trait: 'Вы независимы и оригинальны. Думаете нестандартно и заботитесь о будущем человечества.',
      strength: 'Ваша инновационность и гуманность помогают создавать прогрессивные решения.'
    },
    'Pisces': {
      trait: 'Вы чувствительны и интуитивны. Обладаете богатым воображением и состраданием к другим.',
      strength: 'Ваша креативность и эмпатия позволяют создавать что-то действительно значимое.'
    }
  };

  const analysis = sunTraits[sign] || { trait: 'У вас уникальная личность с особыми качествами.' };
  
  // Добавляем влияние дома если известно
  if (house && house >= 1 && house <= 12) {
    const houseInfluences = [
      'что делает вас естественным лидером',
      'что проявляется через ваше отношение к ресурсам',
      'что выражается в общении и обучении',
      'что связано с домом и семьей',
      'что раскрывается через творчество',
      'что проявляется в работе и заботе о здоровье',
      'что выражается в отношениях с партнерами',
      'что связано с глубокими трансформациями',
      'что проявляется через стремление к знаниям',
      'что выражается в карьере и общественном признании',
      'что проявляется в дружбе и социальных идеалах',
      'что связано с духовным развитием'
    ];
    
    analysis.trait += `, ${houseInfluences[house - 1]}`;
  }

  return analysis;
}

function getMoonAnalysis(sign: string, house?: number) {
  const moonTraits: Record<string, { trait: string; advice?: string }> = {
    'Aries': {
      trait: 'Эмоционально вы импульсивны и прямолинейны. Нуждаетесь в действии и новых впечатлениях.',
      advice: 'Найдите здоровые способы выплеска энергии - спорт, активные хобби.'
    },
    'Taurus': {
      trait: 'Эмоционально вам нужны стабильность и комфорт. Цените простые радости жизни.',
      advice: 'Создайте уютную атмосферу дома - это ваша эмоциональная подзарядка.'
    },
    'Gemini': {
      trait: 'Эмоционально вы нуждаетесь в разнообразии и общении. Настроение может быстро меняться.',
      advice: 'Ведите дневник или найдите собеседника - вам важно выражать мысли и чувства.'
    },
    'Cancer': {
      trait: 'Эмоционально вы очень чувствительны и интуитивны. Семья и дом - ваша опора.',
      advice: 'Доверяйте своей интуиции и не стесняйтесь проявлять заботу о близких.'
    },
    'Leo': {
      trait: 'Эмоционально вам нужны признание и возможность творческого самовыражения.',
      advice: 'Найдите способы проявить свою уникальность - это питает вашу душу.'
    },
    'Virgo': {
      trait: 'Эмоционально вы нуждаетесь в порядке и возможности быть полезными.',
      advice: 'Помощь другим и создание систем дают вам внутреннее удовлетворение.'
    },
    'Libra': {
      trait: 'Эмоционально вам нужны гармония и красота. Конфликты сильно выбивают из равновесия.',
      advice: 'Окружите себя красотой и поддерживающими отношениями.'
    },
    'Scorpio': {
      trait: 'Эмоционально вы интенсивны и глубоки. Нуждаетесь в искренности и трансформации.',
      advice: 'Не бойтесь своих глубоких чувств - они ваша сила и источник мудрости.'
    },
    'Sagittarius': {
      trait: 'Эмоционально вам нужны свобода и новые горизонты. Оптимизм - ваша защита.',
      advice: 'Путешествуйте, изучайте новое - это поддерживает ваш эмоциональный баланс.'
    },
    'Capricorn': {
      trait: 'Эмоционально вы сдержанны, но нуждаетесь в уважении и достижениях.',
      advice: 'Позволяйте себе гордиться своими успехами и не бойтесь показывать уязвимость.'
    },
    'Aquarius': {
      trait: 'Эмоционально вам нужны свобода и единомышленники. Цените дружбу выше романтики.',
      advice: 'Найдите свое сообщество людей со схожими идеалами и ценностями.'
    },
    'Pisces': {
      trait: 'Эмоционально вы очень чувствительны и интуитивны. Нуждаетесь в творчестве и духовности.',
      advice: 'Развивайте творческие способности и найдите время для уединения и рефлексии.'
    }
  };

  return moonTraits[sign] || { trait: 'У вас особый эмоциональный стиль.' };
}

function getRisingAnalysis(sign: string) {
  const risingTraits: Record<string, { trait: string }> = {
    'Aries': { trait: 'Окружающие видят вас как энергичного и решительного человека' },
    'Taurus': { trait: 'Вы производите впечатление надежного и спокойного человека' },
    'Gemini': { trait: 'Люди воспринимают вас как общительного и любознательного' },
    'Cancer': { trait: 'Вы кажетесь заботливым и эмоционально отзывчивым' },
    'Leo': { trait: 'Окружающие видят в вас яркую и харизматичную личность' },
    'Virgo': { trait: 'Вы производите впечатление организованного и внимательного к деталям' },
    'Libra': { trait: 'Люди воспринимают вас как дипломатичного и обаятельного' },
    'Scorpio': { trait: 'Вы кажетесь загадочным и интенсивным' },
    'Sagittarius': { trait: 'Окружающие видят вас как оптимистичного и открытого миру' },
    'Capricorn': { trait: 'Вы производите впечатление серьезного и ответственного человека' },
    'Aquarius': { trait: 'Люди воспринимают вас как независимого и оригинального' },
    'Pisces': { trait: 'Вы кажетесь мечтательным и сочувствующим' }
  };

  return risingTraits[sign] || { trait: 'У вас уникальная манера самопрезентации' };
}

function analyzeSynergy(sun: string, moon: string, rising: string) {
  // Анализируем совместимость элементов
  const elements = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagittarius': 'fire',
    'Taurus': 'earth', 'Virgo': 'earth', 'Capricorn': 'earth',
    'Gemini': 'air', 'Libra': 'air', 'Aquarius': 'air',
    'Cancer': 'water', 'Scorpio': 'water', 'Pisces': 'water'
  };

  const sunElement = elements[sun as keyof typeof elements];
  const moonElement = elements[moon as keyof typeof elements];
  const risingElement = elements[rising as keyof typeof elements];

  // Если все три в одном элементе
  if (sunElement === moonElement && moonElement === risingElement) {
    const elementDescriptions = {
      fire: 'Вы очень энергичный и вдохновляющий человек, но важно не выгорать.',
      earth: 'Вы исключительно практичны и надежны, но не забывайте мечтать.',
      air: 'Вы живете идеями и общением, но важно не терять связь с реальностью.',
      water: 'Вы очень чувствительны и интуитивны, но нужны границы для защиты.'
    };

    return {
      description: elementDescriptions[sunElement as keyof typeof elementDescriptions],
      highlight: {
        tag: 'advice' as const,
        text: `Все ваши основные энергии в элементе ${getElementName(sunElement)} - это дает силу, но важно развивать качества других элементов.`
      }
    };
  }

  // Если есть конфликт между Солнцем и Луной
  const conflictingPairs = [
    ['fire', 'water'], ['earth', 'air']
  ];

  const hasConflict = conflictingPairs.some(([elem1, elem2]) => 
    (sunElement === elem1 && moonElement === elem2) || 
    (sunElement === elem2 && moonElement === elem1)
  );

  if (hasConflict) {
    return {
      description: 'Ваши внешние цели и внутренние потребности иногда противоречат друг другу - это нормально.',
      highlight: {
        tag: 'advice' as const,
        text: 'Научитесь балансировать разные стороны своей натуры - в этом ваша уникальность.'
      }
    };
  }

  return null;
}

function getElementName(element: string): string {
  const names = {
    fire: 'Огня',
    earth: 'Земли', 
    air: 'Воздуха',
    water: 'Воды'
  };
  return names[element as keyof typeof names] || element;
}