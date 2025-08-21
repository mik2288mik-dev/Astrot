import type { FullHoroscope } from '@/lib/horoscope/types';
import copyData from '@/content/copy.json';

interface Profile {
  preferredName?: string;
  language?: string;
}

interface FriendlyHoroscope {
  dateISO: string;
  greeting: string;
  tldr: string[];
  keyTransits: Array<{
    title: string;
    description: string;
    advice: string;
  }>;
  sections: {
    love: string[];
    work: string[];
    health: string[];
    growth: string[];
  };
  moon: {
    tip: string;
  };
  timeline: Array<{
    part: 'morning' | 'day' | 'evening';
    icon: string;
    tips: string[];
  }>;
}

// Проверка на запрещённые слова
function sanitizeText(text: string): string {
  let result = text;
  
  // Заменяем запрещённые слова
  copyData.style.forbidden.forEach(word => {
    const regex = new RegExp(word, 'gi');
    result = result.replace(regex, '');
  });
  
  // Убираем двойные пробелы
  result = result.replace(/\s+/g, ' ').trim();
  
  // Ограничиваем длину
  if (result.length > 100) {
    result = result.substring(0, 97) + '...';
  }
  
  return result;
}

// Форматирование TL;DR
function formatTldr(tldr: any): string[] {
  if (Array.isArray(tldr)) {
    return tldr.slice(0, 3).map(item => sanitizeText(String(item)));
  }
  
  if (typeof tldr === 'object' && tldr) {
    const items = [];
    if (tldr.mood) items.push(`✨ ${sanitizeText(tldr.mood)}`);
    if (tldr.energy) items.push(`⚡ ${sanitizeText(tldr.energy)}`);
    if (tldr.focus) items.push(`🎯 ${sanitizeText(tldr.focus)}`);
    return items;
  }
  
  return ['✨ День новых возможностей', '⚡ Высокая энергия', '🎯 Фокус на главном'];
}

// Форматирование секций
function formatSection(section: string[] | undefined, type: keyof typeof copyData.sections): string[] {
  if (!section || !Array.isArray(section)) {
    // Дефолтные значения для каждой секции
    const defaults = {
      love: ['Проявите внимание к близким', 'Время для романтики'],
      work: ['Завершите важные дела', 'Предложите новые идеи'],
      health: ['Добавьте активности в день', 'Следите за самочувствием'],
      growth: ['Изучите что-то новое', 'Запишите свои мысли']
    };
    return defaults[type] || [];
  }
  
  return section
    .slice(0, 3)
    .map(item => {
      let text = sanitizeText(String(item));
      
      // Добавляем префикс если его нет
      const prefix = copyData.sections[type].prefix;
      if (!text.includes(prefix) && !text.match(/^[^\w\s]/)) {
        text = `${prefix} ${text}`;
      }
      
      // Делаем первую букву заглавной
      text = text.charAt(0).toUpperCase() + text.slice(1);
      
      return text;
    });
}

// Форматирование timeline
function formatTimeline(timeline: any[]): FriendlyHoroscope['timeline'] {
  const timelineConfig = copyData.timeline;
  const defaultTimeline = [
    {
      part: 'morning' as const,
      icon: timelineConfig.morning.prefix,
      tips: ['Начните день спокойно', 'Составьте план дня']
    },
    {
      part: 'day' as const,
      icon: timelineConfig.day.prefix,
      tips: ['Время для продуктивной работы', 'Сосредоточьтесь на главном']
    },
    {
      part: 'evening' as const,
      icon: timelineConfig.evening.prefix,
      tips: ['Отдохните и расслабьтесь', 'Проведите время с близкими']
    }
  ];
  
  if (!timeline || !Array.isArray(timeline)) {
    return defaultTimeline;
  }
  
  return timeline.map(item => {
    const part = (item.part || 'day') as 'morning' | 'day' | 'evening';
    const config = timelineConfig[part];
    
    return {
      part: part,
      icon: config?.prefix || '⏰',
      tips: item.tips 
        ? item.tips.map((tip: any) => sanitizeText(String(tip)))
        : [config?.templates[0] || 'Используйте это время эффективно']
    };
  });
}

// Главная функция композиции
export function composeFriendly(
  horoscope: Partial<FullHoroscope> | any,
  profile?: Profile
): FriendlyHoroscope {
  const name = profile?.preferredName || 'друг';
  const dateISO = horoscope?.dateISO || new Date().toISOString().split('T')[0];
  
  // Форматируем дату для приветствия
  const date = new Date(dateISO);
  const greeting = `Привет, ${name}! Твой гороскоп на ${date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long' 
  })}`;
  
  // Обрабатываем TL;DR
  const tldr = formatTldr(horoscope?.tldr);
  
  // Обрабатываем ключевые транзиты
  const keyTransits = horoscope?.keyTransits && Array.isArray(horoscope.keyTransits)
    ? horoscope.keyTransits.slice(0, 3).map((transit: any) => ({
        title: sanitizeText(transit.title || 'Важное событие дня'),
        description: sanitizeText(transit.why || transit.description || 'Благоприятное время'),
        advice: sanitizeText(transit.advice || 'Используйте эту возможность')
      }))
    : [
        {
          title: 'Время новых начинаний',
          description: 'Энергия дня поддерживает ваши инициативы',
          advice: 'Начните то, что давно планировали'
        },
        {
          title: 'Хороший день для общения',
          description: 'Коммуникации проходят легко и продуктивно',
          advice: 'Проведите важные переговоры'
        },
        {
          title: 'Творческий подъём',
          description: 'Вдохновение и креативность на высоте',
          advice: 'Займитесь любимым делом'
        }
      ];
  
  // Обрабатываем секции
  const sections = {
    love: formatSection(horoscope?.sections?.love, 'love'),
    work: formatSection(horoscope?.sections?.work, 'work'),
    health: formatSection(horoscope?.sections?.health, 'health'),
    growth: formatSection(horoscope?.sections?.growth, 'growth')
  };
  
  // Обрабатываем совет по луне
  const moonTip = horoscope?.moon?.tip 
    ? sanitizeText(horoscope.moon.tip)
    : 'Луна благоприятствует новым начинаниям и планированию';
  
  // Обрабатываем timeline
  const timeline = formatTimeline(horoscope?.timeline);
  
  return {
    dateISO,
    greeting,
    tldr,
    keyTransits,
    sections,
    moon: { tip: moonTip },
    timeline
  };
}