import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';

const RequestSchema = z.object({
  tgId: z.string().optional(),
  birth: z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
    hour: z.number().optional(),
    minute: z.number().optional(),
    lat: z.number().optional(),
    lon: z.number().optional(),
    tz: z.string().optional(),
    place: z.string().optional(),
  }).optional(),
  date: z.string().optional(), // формат YYYY-MM-DD, по умолчанию сегодня
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tgId, birth, date } = RequestSchema.parse(body);
    
    // Определяем дату для советов
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Создаем ключ для кэширования
    const cacheKey = `friendly:${tgId || 'anon'}:${targetDate}`;
    
    // Проверяем кэш
    const cached = await kv.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        ...cached,
        cached: true,
      });
    }
    
    // Генерируем дружелюбные советы
    const tips = await generateFriendlyTips(birth, targetDate);
    
    const response = {
      success: true,
      tips,
      date: targetDate,
    };
    
    // Кэшируем на 24 часа
    await kv.setex(cacheKey, 24 * 60 * 60, response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Friendly tips API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Не удалось получить советы' 
      },
      { status: 500 }
    );
  }
}

interface BirthData {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  lat?: number;
  lon?: number;
  tz?: string;
  place?: string;
}

async function generateFriendlyTips(birth?: BirthData, date?: string): Promise<Array<{
  id: string;
  text: string;
  emoji?: string;
  category?: string;
}>> {
  // Базовые дружелюбные советы без астрожаргона
  const baseTips = [
    {
      id: 'energy',
      text: 'Сегодня отличный день, чтобы заняться тем, что дает вам энергию',
      emoji: '⚡',
      category: 'energy'
    },
    {
      id: 'communication',
      text: 'Время для открытых разговоров — люди готовы вас слушать',
      emoji: '💬',
      category: 'social'
    },
    {
      id: 'creativity',
      text: 'Ваши творческие идеи особенно ценны прямо сейчас',
      emoji: '🎨',
      category: 'creativity'
    },
    {
      id: 'intuition',
      text: 'Доверьтесь своим ощущениям — они подскажут правильный путь',
      emoji: '🔮',
      category: 'intuition'
    },
    {
      id: 'relationships',
      text: 'Хороший момент для укрепления отношений с близкими',
      emoji: '💝',
      category: 'relationships'
    },
    {
      id: 'learning',
      text: 'Новые знания легко усваиваются — время учиться!',
      emoji: '📚',
      category: 'growth'
    },
    {
      id: 'self_care',
      text: 'Не забывайте заботиться о себе — это основа всех успехов',
      emoji: '🌸',
      category: 'wellness'
    },
    {
      id: 'opportunities',
      text: 'Интересные возможности могут появиться в самых неожиданных местах',
      emoji: '🚪',
      category: 'opportunities'
    },
    {
      id: 'balance',
      text: 'Найдите баланс между работой и отдыхом — это ключ к гармонии',
      emoji: '⚖️',
      category: 'balance'
    },
    {
      id: 'gratitude',
      text: 'Подумайте о том, за что вы благодарны — это привлечет еще больше хорошего',
      emoji: '🙏',
      category: 'mindfulness'
    }
  ];

  // Сезонные советы
  const seasonalTips = getSeasonalTips(date);
  
  // Объединяем базовые и сезонные советы
  const allTips = [...baseTips, ...seasonalTips];
  
  // Выбираем случайные 3-5 советов
  const selectedCount = Math.floor(Math.random() * 3) + 3; // 3-5 советов
  const shuffled = allTips.sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, selectedCount);
}

function getSeasonalTips(date?: string): Array<{
  id: string;
  text: string;
  emoji?: string;
  category?: string;
}> {
  const now = date ? new Date(date) : new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  const tips = [];
  
  // Новогодние советы
  if (month === 12 && day >= 25 || month === 1 && day <= 7) {
    tips.push({
      id: 'new_year',
      text: 'Время новых начинаний и свежих идей — поставьте цель на год!',
      emoji: '🎆',
      category: 'seasonal'
    });
  }
  
  // Весенние советы
  if (month >= 3 && month <= 5) {
    tips.push({
      id: 'spring',
      text: 'Весна пробуждает новую жизнь — самое время для перемен',
      emoji: '🌱',
      category: 'seasonal'
    });
  }
  
  // Летние советы
  if (month >= 6 && month <= 8) {
    tips.push({
      id: 'summer',
      text: 'Летняя энергия поддержит ваши самые смелые планы',
      emoji: '☀️',
      category: 'seasonal'
    });
  }
  
  // Осенние советы
  if (month >= 9 && month <= 11) {
    tips.push({
      id: 'autumn',
      text: 'Осень — время собирать плоды своих усилий и планировать будущее',
      emoji: '🍂',
      category: 'seasonal'
    });
  }
  
  return tips;
}

export async function GET(req: NextRequest) {
  // Для GET запросов берем tgId из параметров URL
  const url = new URL(req.url);
  const tgId = url.searchParams.get('tgId');
  const date = url.searchParams.get('date');
  
  return POST(new NextRequest(req.url, {
    method: 'POST',
    body: JSON.stringify({ tgId, date }),
    headers: req.headers,
  }));
}