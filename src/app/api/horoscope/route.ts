import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import { OpenAI } from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HoroscopeSchema = z.object({
  tgId: z.number().optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() // дата для которой нужен гороскоп, по умолчанию сегодня
});

const HoroscopeResponseSchema = z.object({
  general: z.string(),
  love: z.string(),
  career: z.string(),
  health: z.string(),
  lucky_numbers: z.array(z.number()),
  lucky_color: z.string(),
  advice: z.string(),
  energy_level: z.number().min(1).max(10)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tgId = searchParams.get('tgId');
    const requestedDate = searchParams.get('date');
    const date = requestedDate ?? new Date().toISOString().split('T')[0];
    
    let birthDate: string;
    let profileData: { birthDate: string; name?: string } | null = null;
    
    if (tgId) {
      // Загружаем профиль для получения даты рождения
      const profile = await kv.get(`profile:${tgId}`);
      
      if (!profile) {
        return NextResponse.json({ 
          success: false, 
          error: 'Profile not found' 
        }, { status: 404 });
      }
      
      profileData = profile as { birthDate: string; name?: string };
      birthDate = profileData.birthDate;
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'tgId is required' 
      }, { status: 400 });
    }
    
    // Определяем знак зодиака по дате рождения
    const zodiacSign = getZodiacSign(birthDate);
    
    // Проверяем кэш для гороскопа на эту дату
    const cacheKey = `horoscope:${zodiacSign}:${date}`;
    let horoscope = await kv.get(cacheKey);
    
    if (!horoscope) {
      // Генерируем новый гороскоп
      horoscope = await generateHoroscope(zodiacSign, date as string, profileData || undefined);
      
      // Кэшируем на 24 часа
      await kv.set(cacheKey, horoscope, { ex: 24 * 60 * 60 });
    }
    
    return NextResponse.json({
      success: true,
      horoscope: {
        ...(horoscope as object),
        zodiac_sign: zodiacSign,
        date: date
      }
    });
    
  } catch (error) {
    console.error('Error in horoscope API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate horoscope' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = HoroscopeSchema.parse(await request.json());
    const date = input.date ?? new Date().toISOString().split('T')[0];
    
    let birthDate: string;
    let profileData: { birthDate: string; name?: string } | null = null;
    
    if (input.tgId) {
      const profile = await kv.get(`profile:${input.tgId}`);
      if (!profile) {
        return NextResponse.json({ 
          success: false, 
          error: 'Profile not found' 
        }, { status: 404 });
      }
      profileData = profile as { birthDate: string; name?: string };
      birthDate = profileData.birthDate;
    } else if (input.birthDate) {
      birthDate = input.birthDate;
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Either tgId or birthDate is required' 
      }, { status: 400 });
    }
    
    const zodiacSign = getZodiacSign(birthDate);
    const horoscope = await generateHoroscope(zodiacSign, date as string, profileData || undefined);
    
    return NextResponse.json({
      success: true,
      horoscope: {
        ...(horoscope as object),
        zodiac_sign: zodiacSign,
        date: date
      }
    });
    
  } catch (error) {
    console.error('Error in horoscope API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate horoscope' },
      { status: 500 }
    );
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

async function generateHoroscope(zodiacSign: string, date: string, profile?: { name?: string }) {
  const today = new Date(date);
  const dayOfWeek = today.toLocaleDateString('ru-RU', { weekday: 'long' });
  
  let horoscope;
  
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `Создайте гороскоп на ${dayOfWeek}, ${today.toLocaleDateString('ru-RU')} для знака ${zodiacSign}.
      
${profile ? `Дополнительная информация: имя ${profile.name}` : ''}

Используйте дружелюбный, позитивный тон. Избегайте негативных предсказаний.
Ответ должен быть в формате JSON со следующими полями:
- general: общий прогноз на день (2-3 предложения)
- love: прогноз в любви и отношениях
- career: прогноз в карьере и работе
- health: рекомендации по здоровью
- lucky_numbers: массив из 3 счастливых чисел от 1 до 99
- lucky_color: один счастливый цвет на день
- advice: главный совет дня
- energy_level: уровень энергии от 1 до 10`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Вы - профессиональный астролог, создающий позитивные и практичные гороскопы на русском языке."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 1500
      });
      
      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }
      
      horoscope = HoroscopeResponseSchema.parse(JSON.parse(content));
      
    } catch (openaiError) {
      console.error('OpenAI error:', openaiError);
      horoscope = getDefaultHoroscope(zodiacSign);
    }
  } else {
    horoscope = getDefaultHoroscope(zodiacSign);
  }
  
  return horoscope;
}

function getDefaultHoroscope(zodiacSign: string) {
  const colors = ['Синий', 'Зеленый', 'Красный', 'Желтый', 'Фиолетовый', 'Розовый', 'Оранжевый'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const luckyNumbers = [
    Math.floor(Math.random() * 99) + 1,
    Math.floor(Math.random() * 99) + 1,
    Math.floor(Math.random() * 99) + 1
  ];
  
  return {
    general: `Сегодня для ${zodiacSign} благоприятный день для новых начинаний. Звезды располагают к позитивным изменениям и интересным встречам.`,
    love: 'В отношениях возможны приятные сюрпризы. Время проявить внимание к близким людям.',
    career: 'Рабочие дела идут своим чередом. Хороший день для планирования и организации.',
    health: 'Обратите внимание на режим дня и правильное питание. Небольшая физическая активность будет полезна.',
    lucky_numbers: luckyNumbers,
    lucky_color: randomColor,
    advice: 'Доверьтесь своей интуиции и не бойтесь проявлять инициативу.',
    energy_level: Math.floor(Math.random() * 4) + 6 // от 6 до 9
  };
}