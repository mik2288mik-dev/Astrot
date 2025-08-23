// Интерпретационный каркас для натальной карты
// Человечные объяснения без мистификации

import type { ChartData } from '../types';
import { analyzeBigThree } from './rules/big-three';
import { analyzeElements } from './rules/elements';
import { analyzeHouses } from './rules/houses';
import { analyzeAspects } from './rules/aspects';

export type Interpretation = {
  sections: Array<{
    id: string;
    title: string;
    items: string[];
    tip?: string;
  }>;
  highlights: Array<{
    tag: 'strength' | 'risk' | 'advice';
    text: string;
  }>;
};

/**
 * Главная функция анализа натальной карты
 * Возвращает структурированную интерпретацию
 */
export async function interpretNatalChart(chartData: ChartData): Promise<Interpretation> {
  const sections: Interpretation['sections'] = [];
  const highlights: Interpretation['highlights'] = [];

  try {
    // 1. Анализ Big-3 (Солнце/Луна/ASC)
    const bigThreeAnalysis = analyzeBigThree(chartData);
    sections.push({
      id: 'big-three',
      title: 'Основа личности',
      items: bigThreeAnalysis.items,
      tip: bigThreeAnalysis.tip
    });
    highlights.push(...bigThreeAnalysis.highlights);

    // 2. Анализ элементов и крестов
    const elementsAnalysis = analyzeElements(chartData);
    sections.push({
      id: 'elements',
      title: 'Темперамент и подход к жизни',
      items: elementsAnalysis.items,
      tip: elementsAnalysis.tip
    });
    highlights.push(...elementsAnalysis.highlights);

    // 3. Анализ домов (где накапливаются планеты)
    const housesAnalysis = analyzeHouses(chartData);
    if (housesAnalysis.items.length > 0) {
      sections.push({
        id: 'houses',
        title: 'Сферы жизни в фокусе',
        items: housesAnalysis.items,
        tip: housesAnalysis.tip
      });
      highlights.push(...housesAnalysis.highlights);
    }

    // 4. Анализ ключевых аспектов
    const aspectsAnalysis = analyzeAspects(chartData);
    if (aspectsAnalysis.items.length > 0) {
      sections.push({
        id: 'aspects',
        title: 'Внутренние динамики',
        items: aspectsAnalysis.items,
        tip: aspectsAnalysis.tip
      });
      highlights.push(...aspectsAnalysis.highlights);
    }

    return {
      sections,
      highlights
    };

  } catch (error) {
    console.error('Ошибка при интерпретации карты:', error);
    
    // Возвращаем базовую интерпретацию при ошибке
    return {
      sections: [{
        id: 'basic',
        title: 'Базовая информация',
        items: [
          `Солнце в ${chartData.sunSign} - основные черты характера`,
          `Луна в ${chartData.moonSign} - эмоциональный стиль`,
          `Асцендент в ${chartData.risingSign} - как вас видят окружающие`
        ],
        tip: 'Это основа вашей личности. Изучите каждый элемент подробнее.'
      }],
      highlights: [{
        tag: 'advice',
        text: 'Начните с изучения своих Солнца, Луны и Асцендента - это ключ к пониманию себя.'
      }]
    };
  }
}

/**
 * Получить краткую интерпретацию для конкретного элемента карты
 */
export function getQuickInsight(
  type: 'planet' | 'house' | 'aspect',
  data: any
): { title: string; description: string; advice?: string } {
  switch (type) {
    case 'planet':
      return getPlanetInsight(data);
    case 'house':
      return getHouseInsight(data);
    case 'aspect':
      return getAspectInsight(data);
    default:
      return {
        title: 'Неизвестный элемент',
        description: 'Информация недоступна'
      };
  }
}

// Вспомогательные функции для быстрых инсайтов
function getPlanetInsight(planet: any): { title: string; description: string; advice?: string } {
  const insights = {
    'Sun': {
      title: 'Ваша сущность',
      description: 'Солнце показывает ваши основные качества, цели и то, как вы хотите проявляться в мире.',
      advice: 'Развивайте эти качества - они ваша сила.'
    },
    'Moon': {
      title: 'Ваши эмоции',
      description: 'Луна отражает ваш внутренний мир, потребности и то, что дает вам эмоциональную безопасность.',
      advice: 'Слушайте свои потребности - они важны для вашего благополучия.'
    },
    'Mercury': {
      title: 'Ваше мышление',
      description: 'Меркурий показывает, как вы думаете, общаетесь и обрабатываете информацию.',
      advice: 'Используйте свой стиль мышления как преимущество.'
    },
    'Venus': {
      title: 'Ваши отношения',
      description: 'Венера отвечает за то, как вы любите, что цените и как строите отношения.',
      advice: 'Будьте собой в отношениях - это привлекает правильных людей.'
    },
    'Mars': {
      title: 'Ваша энергия',
      description: 'Марс показывает, как вы действуете, что вас мотивирует и как вы достигаете целей.',
      advice: 'Направляйте энергию конструктивно - это ключ к успеху.'
    }
  };

  const insight = insights[planet.name as keyof typeof insights];
  return insight || {
    title: `${planet.name} в ${planet.sign}`,
    description: `Планета ${planet.name} в знаке ${planet.sign} влияет на определенные аспекты вашей личности.`,
    advice: 'Изучите влияние этой планеты на вашу жизнь.'
  };
}

function getHouseInsight(house: any): { title: string; description: string; advice?: string } {
  const meanings = [
    'Личность и самовыражение', 'Ресурсы и ценности', 'Общение и обучение',
    'Дом и семья', 'Творчество и дети', 'Здоровье и работа',
    'Партнерство и отношения', 'Трансформация и кризисы', 'Философия и путешествия',
    'Карьера и статус', 'Друзья и цели', 'Подсознание и духовность'
  ];

  const houseNumber = house.houseNumber || house.number || 1;
  const meaning = meanings[houseNumber - 1] || 'Сфера жизни';

  return {
    title: `${houseNumber} дом: ${meaning}`,
    description: `Этот дом отвечает за ${meaning.toLowerCase()}. Планеты в этом доме показывают, как эта сфера проявляется в вашей жизни.`,
    advice: 'Обратите внимание на планеты в этом доме - они покажут ваши возможности в этой сфере.'
  };
}

function getAspectInsight(aspect: any): { title: string; description: string; advice?: string } {
  const aspectNames = {
    'conjunction': 'Соединение',
    'sextile': 'Секстиль', 
    'square': 'Квадрат',
    'trine': 'Трин',
    'opposition': 'Оппозиция'
  };

  const aspectDescriptions = {
    'conjunction': 'Энергии планет сливаются воедино, усиливая друг друга.',
    'sextile': 'Гармоничное взаимодействие, создающее возможности.',
    'square': 'Напряжение, которое мотивирует к действию и росту.',
    'trine': 'Естественная гармония и легкость проявления качеств.',
    'opposition': 'Противоположности, которые нужно балансировать.'
  };

  const name = aspectNames[aspect.type as keyof typeof aspectNames] || aspect.type;
  const description = aspectDescriptions[aspect.type as keyof typeof aspectDescriptions] || 'Взаимодействие планет';

  return {
    title: `${aspect.planet1} ${name} ${aspect.planet2}`,
    description: description,
    advice: aspect.type === 'square' || aspect.type === 'opposition' 
      ? 'Используйте это напряжение для роста и развития.'
      : 'Развивайте эти естественные способности.'
  };
}