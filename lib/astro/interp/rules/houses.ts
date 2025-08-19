// Анализ домов - сферы жизни в фокусе
// Где накапливаются планеты

import type { ChartData } from '../../types';

export function analyzeHouses(chartData: ChartData) {
  const items: string[] = [];
  const highlights: Array<{ tag: 'strength' | 'risk' | 'advice'; text: string }> = [];

  // Считаем планеты в каждом доме
  const housePlanetCounts = countPlanetsInHouses(chartData.planets);
  
  // Находим дома с накоплением планет (2+ планеты)
  const emphasizedHouses = Object.entries(housePlanetCounts)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3); // Берем топ-3

  if (emphasizedHouses.length === 0) {
    // Если нет накоплений, анализируем важные одиночные планеты
    const importantPlacements = analyzeImportantPlacements(chartData.planets);
    items.push(...importantPlacements.items);
    highlights.push(...importantPlacements.highlights);
    
    return {
      items,
      highlights,
      tip: 'Ваши планеты равномерно распределены - у вас разносторонние интересы.'
    };
  }

  // Анализируем каждый подчеркнутый дом
  emphasizedHouses.forEach(([houseStr, count]) => {
    const house = parseInt(houseStr);
    const analysis = getHouseAnalysis(house, count, chartData.planets);
    
    items.push(`${getHouseIcon(house)} ${analysis.title}`);
    items.push(analysis.description);
    
    if (analysis.strength) {
      highlights.push({ tag: 'strength', text: analysis.strength });
    }
    
    if (analysis.advice) {
      highlights.push({ tag: 'advice', text: analysis.advice });
    }
  });

  // Анализ паттернов распределения планет
  const distributionPattern = analyzeDistribution(housePlanetCounts);
  if (distributionPattern) {
    items.push(`📊 ${distributionPattern.description}`);
    if (distributionPattern.highlight) {
      highlights.push({ tag: distributionPattern.highlight.tag, text: distributionPattern.highlight.text });
    }
  }

  return {
    items,
    highlights,
    tip: 'Дома с несколькими планетами показывают ваши основные жизненные темы и области развития.'
  };
}

function countPlanetsInHouses(planets: ChartData['planets']) {
  const counts: Record<number, number> = {};
  
  // Инициализируем все дома
  for (let i = 1; i <= 12; i++) {
    counts[i] = 0;
  }
  
  // Считаем планеты в каждом доме
  planets.forEach(planet => {
    if (planet.house && planet.house >= 1 && planet.house <= 12) {
      counts[planet.house]++;
    }
  });
  
  return counts;
}

function analyzeImportantPlacements(planets: ChartData['planets']) {
  const items: string[] = [];
  const highlights: Array<{ tag: 'strength' | 'risk' | 'advice'; text: string }> = [];

  // Анализируем важные планеты в важных домах
  const importantPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
  const importantHouses = [1, 4, 7, 10]; // Угловые дома

  importantPlanets.forEach(planetName => {
    const planet = planets.find(p => p.name === planetName);
    if (planet?.house && importantHouses.includes(planet.house)) {
      const analysis = getImportantPlacement(planetName, planet.house);
      items.push(`${getHouseIcon(planet.house)} ${analysis.description}`);
      if (analysis.highlight) {
        highlights.push({ tag: analysis.highlight.tag, text: analysis.highlight.text });
      }
    }
  });

  return { items, highlights };
}

function getImportantPlacement(planet: string, house: number) {
  const placements: Record<string, Record<number, { description: string; highlight?: { tag: 'strength' | 'advice'; text: string } }>> = {
    Sun: {
      1: { 
        description: 'Солнце в 1 доме: Вы яркая, харизматичная личность с сильной индивидуальностью.',
        highlight: { tag: 'strength', text: 'Ваша естественная харизма открывает многие двери.' }
      },
      4: { 
        description: 'Солнце в 4 доме: Семья и дом играют центральную роль в вашей жизни.',
        highlight: { tag: 'advice', text: 'Создавайте крепкую домашнюю базу - это источник вашей силы.' }
      },
      7: { 
        description: 'Солнце в 7 доме: Отношения и партнерство - ключевая тема вашей жизни.',
        highlight: { tag: 'advice', text: 'Учитесь балансировать свои потребности с потребностями партнера.' }
      },
      10: { 
        description: 'Солнце в 10 доме: Карьера и общественное признание очень важны для вас.',
        highlight: { tag: 'strength', text: 'У вас есть потенциал для значимых достижений в карьере.' }
      }
    },
    Moon: {
      1: { 
        description: 'Луна в 1 доме: Ваши эмоции и интуиция очень заметны окружающим.',
        highlight: { tag: 'advice', text: 'Учитесь управлять эмоциональными реакциями в публичных ситуациях.' }
      },
      4: { 
        description: 'Луна в 4 доме: Дом и семья - ваша эмоциональная опора.',
        highlight: { tag: 'strength', text: 'Ваша способность создавать уют помогает другим чувствовать себя в безопасности.' }
      },
      7: { 
        description: 'Луна в 7 доме: Вы эмоционально нуждаетесь в близких отношениях.',
        highlight: { tag: 'advice', text: 'Выбирайте партнеров, которые понимают и поддерживают вашу эмоциональность.' }
      },
      10: { 
        description: 'Луна в 10 доме: Ваша карьера связана с заботой о других или публичной деятельностью.',
        highlight: { tag: 'strength', text: 'Ваша эмпатия делает вас эффективным в работе с людьми.' }
      }
    }
  };

  return placements[planet]?.[house] || { description: `${planet} в ${house} доме влияет на эту сферу жизни.` };
}

function getHouseAnalysis(house: number, planetCount: number, planets: ChartData['planets']) {
  const houseMeanings: Record<number, {
    title: string;
    description: string;
    strength?: string;
    advice?: string;
  }> = {
    1: {
      title: `${planetCount} планет в 1 доме - Сильная личность`,
      description: 'Вы очень индивидуальны и харизматичны. Личность, внешность и самопрезентация играют важную роль.',
      strength: 'Ваша яркая индивидуальность привлекает внимание и открывает возможности.',
      advice: planetCount > 3 ? 'Не забывайте учитывать интересы других людей.' : undefined
    },
    2: {
      title: `${planetCount} планет во 2 доме - Фокус на ресурсах`,
      description: 'Деньги, ценности и материальная безопасность очень важны для вас.',
      strength: 'У вас есть природный талант к накоплению и управлению ресурсами.',
      advice: 'Помните, что не все в жизни измеряется деньгами.'
    },
    3: {
      title: `${planetCount} планет в 3 доме - Активное общение`,
      description: 'Общение, обучение и связи с близким окружением играют большую роль в вашей жизни.',
      strength: 'Ваши коммуникативные навыки помогают налаживать полезные связи.',
      advice: 'Иногда лучше меньше говорить и больше слушать.'
    },
    4: {
      title: `${planetCount} планет в 4 доме - Важность дома и семьи`,
      description: 'Семья, дом и корни - основа вашей жизни. Вы цените традиции и стабильность.',
      strength: 'Ваша способность создавать уютную атмосферу ценится близкими.',
      advice: 'Не бойтесь выходить из зоны комфорта для роста.'
    },
    5: {
      title: `${planetCount} планет в 5 доме - Творчество и радость`,
      description: 'Творчество, дети, романтика и развлечения - ваши основные темы.',
      strength: 'Ваша креативность и умение радоваться жизни вдохновляют других.',
      advice: 'Балансируйте удовольствия с ответственностью.'
    },
    6: {
      title: `${planetCount} планет в 6 доме - Служение и здоровье`,
      description: 'Работа, здоровье и помощь другим занимают центральное место в вашей жизни.',
      strength: 'Ваша готовность служить другим делает мир лучше.',
      advice: 'Не забывайте заботиться о собственных потребностях.'
    },
    7: {
      title: `${planetCount} планет в 7 доме - Отношения прежде всего`,
      description: 'Партнерство, брак и близкие отношения - ваша главная жизненная тема.',
      strength: 'Вы умеете создавать гармоничные отношения и находить компромиссы.',
      advice: 'Развивайте независимость, чтобы быть интересным партнером.'
    },
    8: {
      title: `${planetCount} планет в 8 доме - Глубокие трансформации`,
      description: 'Вас привлекают глубокие темы: психология, трансформация, общие ресурсы.',
      strength: 'Ваша способность к глубокому пониманию помогает в кризисных ситуациях.',
      advice: 'Используйте свою интенсивность конструктивно.'
    },
    9: {
      title: `${planetCount} планет в 9 доме - Стремление к знаниям`,
      description: 'Философия, высшее образование, путешествия и духовные поиски важны для вас.',
      strength: 'Ваш широкий кругозор и мудрость помогают видеть большую картину.',
      advice: 'Не теряйтесь в теориях - применяйте знания на практике.'
    },
    10: {
      title: `${planetCount} планет в 10 доме - Карьерные амбиции`,
      description: 'Карьера, статус и общественное признание - ваши приоритеты.',
      strength: 'У вас есть потенциал для значимых профессиональных достижений.',
      advice: 'Помните о балансе между карьерой и личной жизнью.'
    },
    11: {
      title: `${planetCount} планет в 11 доме - Социальные идеалы`,
      description: 'Дружба, социальные группы и будущие цели играют важную роль.',
      strength: 'Ваша способность объединять людей вокруг общих идей ценна для общества.',
      advice: 'Выбирайте друзей, которые поддерживают ваш рост.'
    },
    12: {
      title: `${planetCount} планет в 12 доме - Духовные поиски`,
      description: 'Подсознание, духовность и служение человечеству - ваши глубокие темы.',
      strength: 'Ваша интуиция и сочувствие помогают понимать скрытые мотивы людей.',
      advice: 'Найдите здоровые способы выражения своей чувствительности.'
    }
  };

  return houseMeanings[house] || {
    title: `${planetCount} планет в ${house} доме`,
    description: 'Эта сфера жизни требует особого внимания.'
  };
}

function analyzeDistribution(houseCounts: Record<number, number>) {
  const totalPlanets = Object.values(houseCounts).reduce((sum, count) => sum + count, 0);
  
  if (totalPlanets === 0) return null;

  // Анализ концентрации планет
  const occupiedHouses = Object.values(houseCounts).filter(count => count > 0).length;
  
  if (occupiedHouses <= 4) {
    return {
      description: 'У вас очень сфокусированная карта - вы концентрируетесь на нескольких ключевых областях.',
      highlight: {
        tag: 'strength' as const,
        text: 'Ваша способность к глубокой концентрации позволяет достигать мастерства в выбранных областях.'
      }
    };
  }
  
  if (occupiedHouses >= 10) {
    return {
      description: 'Ваши интересы очень разнообразны - вы активны во многих сферах жизни.',
      highlight: {
        tag: 'advice' as const,
        text: 'Старайтесь не распыляться - выберите 2-3 приоритетные области для глубокого развития.'
      }
    };
  }

  // Анализ полусфер
  const upperHouses = [7, 8, 9, 10, 11, 12].reduce((sum, house) => sum + houseCounts[house], 0);
  const lowerHouses = [1, 2, 3, 4, 5, 6].reduce((sum, house) => sum + houseCounts[house], 0);
  
  if (upperHouses > lowerHouses * 2) {
    return {
      description: 'Большинство планет в верхней полусфере - вы ориентированы на внешний мир и общественную деятельность.',
      highlight: {
        tag: 'advice' as const,
        text: 'Не забывайте о личных потребностях и внутреннем развитии.'
      }
    };
  }
  
  if (lowerHouses > upperHouses * 2) {
    return {
      description: 'Большинство планет в нижней полусфере - вы сосредоточены на личном развитии и близких отношениях.',
      highlight: {
        tag: 'advice' as const,
        text: 'Развивайте социальные навыки и не бойтесь заявлять о себе публично.'
      }
    };
  }

  return null;
}

function getHouseIcon(house: number): string {
  const icons = ['🌟', '💰', '🗣️', '🏠', '🎨', '⚕️', '💕', '🔄', '🎓', '🏆', '👥', '🧘'];
  return icons[house - 1] || '⭐';
}