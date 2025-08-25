import { ChartComputed, PLANETS_RU } from '@/lib/astro/types'
import { PLANET_IN_SIGN, PLANET_IN_HOUSE, ASPECTS } from '@/content/interpretations'

export type InterpretationMode = 'easy' | 'friendly' | 'deep'
export type InterpretationTopic = 'love' | 'money' | 'career' | 'health'

export interface InterpretationSection {
  title: string
  content: string
  priority: number
}

export function resolveInterpretation(
  chart: ChartComputed,
  mode: InterpretationMode = 'friendly',
  topic?: InterpretationTopic
): InterpretationSection[] {
  const sections: InterpretationSection[] = []
  
  // Big-3: Солнце, Луна, Асцендент
  const sun = chart.planets.find(p => p.name === 'Sun')
  const moon = chart.planets.find(p => p.name === 'Moon')
  
  if (sun) {
    const interpretation = PLANET_IN_SIGN.Sun?.[sun.sign]?.[mode]
    if (interpretation) {
      sections.push({
        title: `Солнце в ${sun.sign}`,
        content: interpretation,
        priority: 1,
      })
    }
    
    // Солнце в доме
    if (sun.house) {
      const houseInterp = PLANET_IN_HOUSE.Sun?.[sun.house]?.[mode]
      if (houseInterp) {
        sections.push({
          title: `Солнце в ${sun.house} доме`,
          content: houseInterp,
          priority: 2,
        })
      }
    }
  }
  
  if (moon) {
    const interpretation = PLANET_IN_SIGN.Moon?.[moon.sign]?.[mode]
    if (interpretation) {
      sections.push({
        title: `Луна в ${moon.sign}`,
        content: interpretation,
        priority: 1,
      })
    }
  }
  
  // Асцендент
  const ascSign = getSignFromDegree(chart.ascendant)
  sections.push({
    title: `Асцендент в ${ascSign}`,
    content: getAscendantInterpretation(ascSign, mode),
    priority: 1,
  })
  
  // Другие планеты в знаках
  const otherPlanets = chart.planets.filter(p => p.name !== 'Sun' && p.name !== 'Moon')
  
  for (const planet of otherPlanets) {
    const planetInterps = PLANET_IN_SIGN[planet.name as keyof typeof PLANET_IN_SIGN]
    if (planetInterps && planetInterps[planet.sign]) {
      const interp = planetInterps[planet.sign][mode]
      if (interp) {
        sections.push({
          title: `${PLANETS_RU[planet.name as keyof typeof PLANETS_RU]} в ${planet.sign}`,
          content: interp,
          priority: 3,
        })
      }
    }
  }
  
  // Аспекты
  const majorAspects = chart.aspects.filter(a => a.orb < 5)
  
  for (const aspect of majorAspects) {
    const aspectKey = `${aspect.planet1}-${aspect.planet2}`
    const reverseKey = `${aspect.planet2}-${aspect.planet1}`
    
    const aspectInterps = ASPECTS[aspect.type]
    if (aspectInterps) {
      const interp = aspectInterps[aspectKey]?.[mode] || aspectInterps[reverseKey]?.[mode]
      if (interp) {
        sections.push({
          title: `${PLANETS_RU[aspect.planet1 as keyof typeof PLANETS_RU]} ${getAspectName(aspect.type)} ${PLANETS_RU[aspect.planet2 as keyof typeof PLANETS_RU]}`,
          content: interp,
          priority: 4,
        })
      }
    }
  }
  
  // Фильтрация по теме (если указана)
  if (topic) {
    return filterByTopic(sections, topic, chart)
  }
  
  // Сортировка по приоритету
  return sections.sort((a, b) => a.priority - b.priority)
}

function getSignFromDegree(degree: number): string {
  const signs = [
    'Овен', 'Телец', 'Близнецы', 'Рак',
    'Лев', 'Дева', 'Весы', 'Скорпион',
    'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ]
  const signIndex = Math.floor(degree / 30)
  return signs[signIndex]
}

function getAscendantInterpretation(sign: string, mode: InterpretationMode): string {
  const interpretations = {
    'Овен': {
      easy: 'Производишь впечатление активного и решительного человека.',
      friendly: 'Асцендент в Овне дает тебе энергичную и прямолинейную манеру. Люди видят в тебе лидера.',
      deep: 'Асцендент в Овне формирует вашу личность через призму инициативы и первопроходчества. Вы входите в жизнь как воин.',
    },
    'Телец': {
      easy: 'Производишь впечатление надежного и спокойного человека.',
      friendly: 'Асцендент в Тельце дает тебе основательность и приятную внешность. Люди чувствуют твою надежность.',
      deep: 'Асцендент в Тельце формирует устойчивую и практичную личность. Вы входите в мир через чувственное восприятие.',
    },
    'Близнецы': {
      easy: 'Производишь впечатление общительного и подвижного человека.',
      friendly: 'Асцендент в Близнецах делает тебя коммуникабельным и адаптивным. Люди видят твою живость ума.',
      deep: 'Асцендент в Близнецах формирует многогранную личность. Вы воспринимаете мир через информацию и связи.',
    },
    'Рак': {
      easy: 'Производишь впечатление заботливого и чувствительного человека.',
      friendly: 'Асцендент в Раке дает тебе мягкость и эмоциональность. Люди чувствуют твою заботу.',
      deep: 'Асцендент в Раке формирует эмоционально восприимчивую личность. Вы входите в мир через чувства и интуицию.',
    },
    'Лев': {
      easy: 'Производишь впечатление яркого и уверенного человека.',
      friendly: 'Асцендент во Льве дает тебе харизму и достоинство. Люди замечают твою особенность.',
      deep: 'Асцендент во Льве формирует царственную личность. Вы входите в мир как творец и лидер.',
    },
    'Дева': {
      easy: 'Производишь впечатление аккуратного и внимательного человека.',
      friendly: 'Асцендент в Деве дает тебе скромность и практичность. Люди ценят твою полезность.',
      deep: 'Асцендент в Деве формирует аналитическую личность. Вы воспринимаете мир через призму совершенствования.',
    },
    'Весы': {
      easy: 'Производишь впечатление приятного и дипломатичного человека.',
      friendly: 'Асцендент в Весах дает тебе обаяние и тактичность. Люди видят в тебе партнера.',
      deep: 'Асцендент в Весах формирует гармоничную личность. Вы входите в мир через отношения и баланс.',
    },
    'Скорпион': {
      easy: 'Производишь впечатление загадочного и сильного человека.',
      friendly: 'Асцендент в Скорпионе дает тебе магнетизм и глубину. Люди чувствуют твою силу.',
      deep: 'Асцендент в Скорпионе формирует трансформирующую личность. Вы входите в мир через кризисы и возрождение.',
    },
    'Стрелец': {
      easy: 'Производишь впечатление оптимистичного и открытого человека.',
      friendly: 'Асцендент в Стрельце дает тебе энтузиазм и широту взглядов. Люди видят твой оптимизм.',
      deep: 'Асцендент в Стрельце формирует философскую личность. Вы воспринимаете мир как путешествие к истине.',
    },
    'Козерог': {
      easy: 'Производишь впечатление серьезного и ответственного человека.',
      friendly: 'Асцендент в Козероге дает тебе зрелость и амбициозность. Люди уважают твою компетентность.',
      deep: 'Асцендент в Козероге формирует целеустремленную личность. Вы входите в мир через достижения и мастерство.',
    },
    'Водолей': {
      easy: 'Производишь впечатление необычного и независимого человека.',
      friendly: 'Асцендент в Водолее дает тебе оригинальность и дружелюбие. Люди видят твою уникальность.',
      deep: 'Асцендент в Водолее формирует революционную личность. Вы воспринимаете мир через призму будущего.',
    },
    'Рыбы': {
      easy: 'Производишь впечатление мягкого и творческого человека.',
      friendly: 'Асцендент в Рыбах дает тебе чувствительность и артистизм. Люди чувствуют твою эмпатию.',
      deep: 'Асцендент в Рыбах формирует мистическую личность. Вы входите в мир через сострадание и воображение.',
    },
  }
  
  return interpretations[sign]?.[mode] || 'Интерпретация в разработке'
}

function getAspectName(type: string): string {
  const names = {
    conjunction: 'соединение',
    opposition: 'оппозиция',
    square: 'квадрат',
    trine: 'трин',
    sextile: 'секстиль',
  }
  return names[type as keyof typeof names] || type
}

function filterByTopic(
  sections: InterpretationSection[],
  topic: InterpretationTopic,
  chart: ChartComputed
): InterpretationSection[] {
  // Фильтрация по теме
  switch (topic) {
    case 'love':
      // Для любви важны Венера, Луна, 5 и 7 дома
      return sections.filter(s =>
        s.title.includes('Венера') ||
        s.title.includes('Луна') ||
        s.title.includes('5 дом') ||
        s.title.includes('7 дом')
      )
    
    case 'money':
      // Для денег важны 2, 8 дома, Венера, Юпитер
      return sections.filter(s =>
        s.title.includes('2 дом') ||
        s.title.includes('8 дом') ||
        s.title.includes('Венера') ||
        s.title.includes('Юпитер')
      )
    
    case 'career':
      // Для карьеры важны 10 дом, Солнце, Сатурн, MC
      return sections.filter(s =>
        s.title.includes('10 дом') ||
        s.title.includes('Солнце') ||
        s.title.includes('Сатурн') ||
        s.title.includes('MC')
      )
    
    case 'health':
      // Для здоровья важны 6 дом, Солнце, Луна
      return sections.filter(s =>
        s.title.includes('6 дом') ||
        s.title.includes('Солнце') ||
        s.title.includes('Луна')
      )
    
    default:
      return sections
  }
}