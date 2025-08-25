import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { generateDebugId, logApiRequest, logApiSuccess, logApiError, withDebugHeaders } from '@/lib/api/logger';
import { z } from 'zod';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// Схема валидации входных данных
const RequestSchema = z.object({
  tgId: z.string().optional(),
  birth: z.object({
    date: z.string()
  }).optional(),
  date: z.string().optional() // дата для гороскопа, по умолчанию - сегодня
});

function resolveBaseUrl(req: Request): string {
  const url = new URL(req.url);
  const host = url.host;
  const protocol = url.protocol; // preserves https/http
  return `${protocol}//${host}`;
}

export async function POST(req: Request) {
  const debugId = generateDebugId();
  const startTime = Date.now();
  
  logApiRequest('/api/horoscope', 'POST', debugId);
  
  const key = process.env.OPENAI_API_KEY;
  const mockMode = process.env.MOCK_MODE === 'true';
  
  if (!key && !mockMode) {
    const response = NextResponse.json({ 
      text: 'Сегодня спокойный день. Обратите внимание на дела, связанные с вашим Солнцем и Луной.' 
    });
    logApiSuccess('/api/horoscope', debugId, Date.now() - startTime);
    return withDebugHeaders(response, debugId);
  }

  try {
    const body = await req.json();
    
    // Валидация входных данных
    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      const response = NextResponse.json({
        error: 'Неверные входные данные',
        details: validationResult.error.errors
      }, { status: 400 });
      logApiError('/api/horoscope', debugId, validationResult.error, Date.now() - startTime);
      return withDebugHeaders(response, debugId);
    }
    
    const { birth, tgId, date } = validationResult.data;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    let birthData = birth;
    
    // Если передан tgId, пытаемся загрузить профиль
    if (tgId && !birth) {
      try {
        const base = process.env.NEXTAUTH_URL || resolveBaseUrl(req);
        const profileResponse = await fetch(`${base}/api/profile?tgId=${tgId}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.profile?.birthDate) {
            birthData = { date: profileData.profile.birthDate };
          }
        }
      } catch (error) {
        console.error('Error loading profile for horoscope:', error);
      }
    }
    
    if (!birthData?.date) {
      const response = NextResponse.json({
        tldr: ['✨ День новых возможностей', '🌟 Доверьтесь интуиции', '💫 Время для начинаний'],
        sections: {
          love: ['Проявите внимание к близким', 'Откройтесь для новых знакомств'],
          work: ['Завершите важные дела', 'Предложите свои идеи'],
          health: ['Добавьте физической активности', 'Следите за режимом дня'],
          growth: ['Попробуйте что-то новое', 'Запишите свои мысли']
        },
        moon: { tip: 'Сегодня благоприятный день для планирования' },
        timeline: [
          { part: 'morning', tips: ['Начните день спокойно'] },
          { part: 'day', tips: ['Сосредоточьтесь на главном'] },
          { part: 'evening', tips: ['Отдохните и расслабьтесь'] }
        ],
        date: targetDate
      });
      logApiSuccess('/api/horoscope', debugId, Date.now() - startTime);
      return withDebugHeaders(response, debugId);
    }

    // Проверяем кэш
    const cacheKey = `horoscope:day:${tgId || birthData.date}:${targetDate}`;
    const cached = await kv.get(cacheKey).catch(() => null);
    
    if (cached) {
      const response = NextResponse.json(cached);
      logApiSuccess('/api/horoscope', debugId, Date.now() - startTime, true);
      return withDebugHeaders(response, debugId, true);
    }
    
    const zodiacSign = getZodiacSign(birthData.date);
    const openai = new OpenAI({ apiKey: key });
    
    const today = new Date(targetDate);
    const dayOfWeek = today.toLocaleDateString('ru-RU', { weekday: 'long' });
    
    const prompt = `Создайте структурированный гороскоп на ${dayOfWeek} для знака ${zodiacSign}.
    
Ответьте в формате JSON:
{
  "tldr": ["краткий тезис 1", "краткий тезис 2", "краткий тезис 3"],
  "sections": {
    "love": ["совет 1", "совет 2"],
    "work": ["совет 1", "совет 2"],
    "health": ["совет 1", "совет 2"],
    "growth": ["совет 1", "совет 2"]
  },
  "moon": { "tip": "краткий совет по луне" },
  "timeline": [
    { "part": "morning", "tips": ["совет на утро"] },
    { "part": "day", "tips": ["совет на день"] },
    { "part": "evening", "tips": ["совет на вечер"] }
  ]
}

Все советы должны быть позитивными, конкретными и на русском языке.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Вы - профессиональный астролог. Отвечайте только валидным JSON без дополнительного текста."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    });
    
    let horoscopeData;
    try {
      const content = completion.choices[0]?.message?.content || '{}';
      horoscopeData = JSON.parse(content);
      horoscopeData.date = targetDate;
      horoscopeData.zodiacSign = zodiacSign;
    } catch (e) {
      // Fallback структура
      horoscopeData = {
        tldr: [`Сегодня ${zodiacSign} ждёт удачный день`, 'Доверьтесь интуиции', 'Время для новых начинаний'],
        sections: {
          love: ['Проявите внимание к близким', 'Откройтесь для общения'],
          work: ['Сосредоточьтесь на главном', 'Завершите важные дела'],
          health: ['Добавьте активности', 'Следите за самочувствием'],
          growth: ['Изучите что-то новое', 'Найдите время для себя']
        },
        moon: { tip: 'Луна благоприятствует новым начинаниям' },
        timeline: [
          { part: 'morning', tips: ['Начните день с позитива'] },
          { part: 'day', tips: ['Будьте продуктивны'] },
          { part: 'evening', tips: ['Отдохните и расслабьтесь'] }
        ],
        date: targetDate,
        zodiacSign
      };
    }
    
    // Кэшируем на 24 часа
    await kv.set(cacheKey, horoscopeData, { ex: 86400 }).catch(() => {});
    
    const response = NextResponse.json(horoscopeData);
    logApiSuccess('/api/horoscope', debugId, Date.now() - startTime);
    return withDebugHeaders(response, debugId);
    
  } catch (error) {
    logApiError('/api/horoscope', debugId, error, Date.now() - startTime);
    
    // В случае ошибки используем мок-данные если включен MOCK_MODE
    if (process.env.MOCK_MODE === 'true') {
      const mockData = {
        tldr: ['✨ День полон возможностей', '🌟 Доверьтесь себе', '💫 Время действовать'],
        sections: {
          love: ['Будьте открыты для общения', 'Проявите заботу о близких'],
          work: ['Сосредоточьтесь на приоритетах', 'Завершите начатое'],
          health: ['Добавьте движения в день', 'Пейте больше воды'],
          growth: ['Изучите что-то новое', 'Практикуйте благодарность']
        },
        moon: { tip: 'Луна поддерживает ваши начинания сегодня' },
        timeline: [
          { part: 'morning', tips: ['Начните с планирования дня'] },
          { part: 'day', tips: ['Время для активных действий'] },
          { part: 'evening', tips: ['Расслабьтесь и отдохните'] }
        ],
        date: new Date().toISOString().split('T')[0]
      };
      const response = NextResponse.json(mockData);
      return withDebugHeaders(response, debugId);
    }
    
    const response = NextResponse.json({ 
      error: 'Не удалось загрузить гороскоп',
      debugId
    }, { status: 500 });
    return withDebugHeaders(response, debugId);
  }
}

function getZodiacSign(birthDate: string): string {
  const parts = birthDate.split('-').map(Number);
  const month = parts[1] || 1;
  const day = parts[2] || 1;
  const monthDay = month * 100 + day;
  
  if (monthDay >= 321 && monthDay <= 419) return 'Овен';
  if (monthDay >= 420 && monthDay <= 520) return 'Телец';
  if (monthDay >= 521 && monthDay <= 620) return 'Близнецы';
  if (monthDay >= 621 && monthDay <= 722) return 'Рак';
  if (monthDay >= 723 && monthDay <= 822) return 'Лев';
  if (monthDay >= 823 && monthDay <= 922) return 'Дева';
  if (monthDay >= 923 && monthDay <= 1022) return 'Весы';
  if (monthDay >= 1023 && monthDay <= 1121) return 'Скорпион';
  if (monthDay >= 1122 && monthDay <= 1221) return 'Стрелец';
  if (monthDay >= 1222 || monthDay <= 119) return 'Козерог';
  if (monthDay >= 120 && monthDay <= 218) return 'Водолей';
  return 'Рыбы';
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tgId = url.searchParams.get('tgId');
  
  return POST(new Request(req.url, {
    method: 'POST',
    body: JSON.stringify({ tgId }),
    headers: { 'Content-Type': 'application/json' },
  }));
}