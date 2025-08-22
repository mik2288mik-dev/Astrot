/**
 * 💫 Система персонализированных ежедневных советов
 * Основана на транзитах планет и натальной карте
 */

import { DateTime } from 'luxon';

export interface DailyTip {
  id: string;
  date: string;
  emoji: string;
  title: string;
  message: string;
  category: 'love' | 'career' | 'health' | 'money' | 'spiritual' | 'general';
  energy: 'high' | 'medium' | 'low' | 'mixed';
  luckyNumber: number;
  luckyColor: string;
  affirmation: string;
  action: string;
  warning?: string;
}

export interface PersonalizedTips {
  mainTip: DailyTip;
  additionalTips: DailyTip[];
  moonPhase: {
    emoji: string;
    name: string;
    advice: string;
  };
  planetOfTheDay: {
    planet: string;
    emoji: string;
    energy: string;
  };
}

// Фазы луны для советов
const MOON_PHASES = [
  { emoji: '🌑', name: 'Новолуние', advice: 'Время новых начинаний! Загадай желание и начни новый проект.' },
  { emoji: '🌒', name: 'Растущий месяц', advice: 'Энергия растет! Действуй активно и привлекай желаемое.' },
  { emoji: '🌓', name: 'Первая четверть', advice: 'Время принимать решения и преодолевать препятствия.' },
  { emoji: '🌔', name: 'Растущая луна', advice: 'Усиливай усилия! Ты близок к цели.' },
  { emoji: '🌕', name: 'Полнолуние', advice: 'Пик энергии! Время завершений и благодарности.' },
  { emoji: '🌖', name: 'Убывающая луна', advice: 'Отпускай лишнее, освобождай пространство для нового.' },
  { emoji: '🌗', name: 'Последняя четверть', advice: 'Время отдыха и переосмысления.' },
  { emoji: '🌘', name: 'Убывающий месяц', advice: 'Завершай дела и готовься к новому циклу.' }
];

// Планеты дня недели
const WEEKDAY_PLANETS = [
  { day: 0, planet: 'Солнце', emoji: '☀️', energy: 'Сияй и будь в центре внимания!' },
  { day: 1, planet: 'Луна', emoji: '🌙', energy: 'Слушай интуицию и заботься о близких.' },
  { day: 2, planet: 'Марс', emoji: '🔥', energy: 'Действуй решительно и смело!' },
  { day: 3, planet: 'Меркурий', emoji: '💫', energy: 'Общайся, учись, заключай сделки.' },
  { day: 4, planet: 'Юпитер', emoji: '🍀', energy: 'Расширяй горизонты и верь в удачу!' },
  { day: 5, planet: 'Венера', emoji: '💕', energy: 'Люби, твори красоту, наслаждайся.' },
  { day: 6, planet: 'Сатурн', emoji: '⏰', energy: 'Планируй, структурируй, завершай дела.' }
];

// Цвета удачи
const LUCKY_COLORS = [
  { color: 'Красный', hex: '#EF4444', meaning: 'энергия и страсть' },
  { color: 'Оранжевый', hex: '#F97316', meaning: 'творчество и радость' },
  { color: 'Желтый', hex: '#F59E0B', meaning: 'оптимизм и успех' },
  { color: 'Зеленый', hex: '#10B981', meaning: 'рост и гармония' },
  { color: 'Голубой', hex: '#06B6D4', meaning: 'спокойствие и ясность' },
  { color: 'Синий', hex: '#3B82F6', meaning: 'мудрость и интуиция' },
  { color: 'Фиолетовый', hex: '#8B5CF6', meaning: 'духовность и магия' },
  { color: 'Розовый', hex: '#EC4899', meaning: 'любовь и нежность' }
];

// Аффирмации по категориям
const AFFIRMATIONS = {
  love: [
    'Я достоин(а) любви и привлекаю ее в свою жизнь',
    'Мое сердце открыто для любви и радости',
    'Я излучаю любовь и получаю ее в ответ',
    'Я создаю гармоничные отношения'
  ],
  career: [
    'Я успешен(на) во всех своих начинаниях',
    'Мои таланты ценят и хорошо оплачивают',
    'Я привлекаю возможности для роста',
    'Успех приходит ко мне легко и естественно'
  ],
  health: [
    'Мое тело здорово и полно энергии',
    'Я выбираю здоровье и витальность',
    'Каждая клеточка моего тела излучает здоровье',
    'Я благодарен(на) своему телу за его силу'
  ],
  money: [
    'Деньги приходят ко мне легко и из разных источников',
    'Я достоин(а) финансового изобилия',
    'Я магнит для денег и процветания',
    'Вселенная щедра ко мне'
  ],
  spiritual: [
    'Я доверяю процессу жизни',
    'Я в гармонии с Вселенной',
    'Моя интуиция ведет меня верным путем',
    'Я часть чего-то большего и прекрасного'
  ],
  general: [
    'Сегодня будет прекрасный день',
    'Я готов(а) к чудесам и возможностям',
    'Все происходит для моего высшего блага',
    'Я благодарен(на) за этот новый день'
  ]
};

/**
 * Генерирует персонализированные советы на день
 */
export function generateDailyTips(
  birthDate: Date,
  sunSign: string,
  moonSign: string,
  currentDate: Date = new Date()
): PersonalizedTips {
  const dayOfWeek = currentDate.getDay();
  const moonPhaseIndex = getMoonPhaseIndex(currentDate);
  const moonPhase = MOON_PHASES[moonPhaseIndex];
  const planetOfDay = WEEKDAY_PLANETS[dayOfWeek];
  
  // Генерируем главный совет дня
  const mainTip = generateMainTip(sunSign, moonSign, currentDate, birthDate);
  
  // Генерируем дополнительные советы
  const additionalTips = generateAdditionalTips(sunSign, moonSign, currentDate);
  
  return {
    mainTip,
    additionalTips,
    moonPhase: {
      emoji: moonPhase.emoji,
      name: moonPhase.name,
      advice: moonPhase.advice
    },
    planetOfTheDay: {
      planet: planetOfDay.planet,
      emoji: planetOfDay.emoji,
      energy: planetOfDay.energy
    }
  };
}

/**
 * Генерирует главный совет дня
 */
function generateMainTip(
  sunSign: string,
  moonSign: string,
  currentDate: Date,
  birthDate: Date
): DailyTip {
  const categories: Array<DailyTip['category']> = ['love', 'career', 'health', 'money', 'spiritual', 'general'];
  const category = categories[currentDate.getDay() % categories.length];
  
  const tips = getTipsForSign(sunSign, category);
  const tip = tips[Math.floor(currentDate.getDate() % tips.length)];
  
  const luckyNumber = ((currentDate.getDate() + birthDate.getDate()) % 9) + 1;
  const luckyColor = LUCKY_COLORS[currentDate.getDay()];
  const affirmation = AFFIRMATIONS[category][Math.floor(currentDate.getDate() % AFFIRMATIONS[category].length)];
  
  return {
    id: `main-${currentDate.toISOString()}`,
    date: currentDate.toISOString(),
    emoji: tip.emoji,
    title: tip.title,
    message: tip.message,
    category,
    energy: getEnergyLevel(currentDate),
    luckyNumber,
    luckyColor: luckyColor.color,
    affirmation,
    action: tip.action,
    warning: tip.warning
  };
}

/**
 * Генерирует дополнительные советы
 */
function generateAdditionalTips(
  sunSign: string,
  moonSign: string,
  currentDate: Date
): DailyTip[] {
  const tips: DailyTip[] = [];
  
  // Совет по лунному знаку
  if (moonSign !== sunSign) {
    const moonTip = getTipsForSign(moonSign, 'spiritual')[0];
    tips.push({
      id: `moon-${currentDate.toISOString()}`,
      date: currentDate.toISOString(),
      emoji: '🌙',
      title: 'Лунный совет',
      message: `Твоя Луна в ${moonSign} подсказывает: ${moonTip.message}`,
      category: 'spiritual',
      energy: 'medium',
      luckyNumber: 7,
      luckyColor: 'Серебряный',
      affirmation: 'Я доверяю своей интуиции',
      action: moonTip.action
    });
  }
  
  // Совет по дню недели
  const dayTip = getDayOfWeekTip(currentDate.getDay());
  tips.push(dayTip);
  
  return tips;
}

/**
 * Получает советы для знака зодиака
 */
function getTipsForSign(sign: string, category: DailyTip['category']): Array<{
  emoji: string;
  title: string;
  message: string;
  action: string;
  warning?: string;
}> {
  // Здесь должна быть большая база советов для каждого знака
  // Пока возвращаем универсальные советы
  const universalTips = {
    love: [
      {
        emoji: '💕',
        title: 'День для любви',
        message: 'Открой сердце новым возможностям. Любовь ближе, чем ты думаешь!',
        action: 'Сделай комплимент близкому человеку',
        warning: 'Избегай ревности и подозрений'
      }
    ],
    career: [
      {
        emoji: '🚀',
        title: 'Карьерный прорыв',
        message: 'Твои усилия скоро принесут плоды. Продолжай двигаться к цели!',
        action: 'Завершите важный проект или начни новый',
        warning: 'Не берите слишком много обязательств'
      }
    ],
    health: [
      {
        emoji: '🌱',
        title: 'Забота о себе',
        message: 'Твое тело - твой храм. Подари ему внимание и заботу сегодня.',
        action: 'Сделай зарядку или прогуляйся на свежем воздухе',
        warning: 'Не переусердствуй с нагрузками'
      }
    ],
    money: [
      {
        emoji: '💰',
        title: 'Финансовая удача',
        message: 'Вселенная готова одарить тебя изобилием. Будь открыт(а) для получения!',
        action: 'Составь финансовый план или отложи деньги',
        warning: 'Избегай импульсивных покупок'
      }
    ],
    spiritual: [
      {
        emoji: '🔮',
        title: 'Духовное прозрение',
        message: 'Ответы, которые ты ищешь, находятся внутри тебя. Прислушайся к интуиции.',
        action: 'Помедитируй или запиши свои мысли',
        warning: 'Не игнорируй внутренний голос'
      }
    ],
    general: [
      {
        emoji: '⭐',
        title: 'Удачный день',
        message: 'Сегодня звезды на твоей стороне! Используй эту энергию мудро.',
        action: 'Начни что-то новое или завершите старое',
        warning: 'Не упусти возможности'
      }
    ]
  };
  
  return universalTips[category] || universalTips.general;
}

/**
 * Получает совет по дню недели
 */
function getDayOfWeekTip(dayOfWeek: number): DailyTip {
  const planet = WEEKDAY_PLANETS[dayOfWeek];
  const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  
  return {
    id: `weekday-${dayOfWeek}`,
    date: new Date().toISOString(),
    emoji: planet.emoji,
    title: `Энергия ${dayNames[dayOfWeek]}`,
    message: `Сегодня правит ${planet.planet}. ${planet.energy}`,
    category: 'general',
    energy: dayOfWeek === 2 || dayOfWeek === 4 ? 'high' : dayOfWeek === 0 || dayOfWeek === 6 ? 'low' : 'medium',
    luckyNumber: dayOfWeek + 1,
    luckyColor: LUCKY_COLORS[dayOfWeek].color,
    affirmation: `Я в гармонии с энергией ${planet.planet}`,
    action: getActionForPlanet(planet.planet)
  };
}

/**
 * Получает действие для планеты
 */
function getActionForPlanet(planet: string): string {
  const actions: Record<string, string> = {
    'Солнце': 'Будь лидером и покажи себя',
    'Луна': 'Позаботься о доме и семье',
    'Марс': 'Займись спортом или начни новое дело',
    'Меркурий': 'Учись чему-то новому или общайся',
    'Юпитер': 'Расширь горизонты и рискни',
    'Венера': 'Создай красоту или встреться с любимыми',
    'Сатурн': 'Наведи порядок и заверши дела'
  };
  return actions[planet] || 'Следуй своей интуиции';
}

/**
 * Определяет уровень энергии дня
 */
function getEnergyLevel(date: Date): DailyTip['energy'] {
  const moonPhase = getMoonPhaseIndex(date);
  if (moonPhase === 0 || moonPhase === 4) return 'high';
  if (moonPhase === 2 || moonPhase === 6) return 'mixed';
  return 'medium';
}

/**
 * Вычисляет индекс фазы луны
 */
function getMoonPhaseIndex(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Упрощенный расчет фазы луны
  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;
  
  if (month < 3) {
    const yearAdj = year - 1;
    const monthAdj = month + 12;
    c = 365.25 * yearAdj;
    e = 30.6 * monthAdj;
  } else {
    c = 365.25 * year;
    e = 30.6 * month;
  }
  
  jd = c + e + day - 694039.09;
  jd = jd / 29.5305882;
  b = Math.floor(jd);
  jd = jd - b;
  b = Math.round(jd * 8);
  
  if (b >= 8) b = 0;
  
  return b;
}