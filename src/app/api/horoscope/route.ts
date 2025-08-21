import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ 
      text: 'Сегодня спокойный день. Обратите внимание на дела, связанные с вашим Солнцем и Луной.' 
    });
  }

  try {
    const { birth, tgId } = await req.json();
    
    let birthData = birth;
    
    // Если передан tgId, пытаемся загрузить профиль
    if (tgId && !birth) {
      try {
        const profileResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/profile?tgId=${tgId}`);
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
      return NextResponse.json({ 
        text: 'Прекрасный день для новых начинаний! Доверьтесь своей интуиции.' 
      });
    }

    const zodiacSign = getZodiacSign(birthData.date);
    const openai = new OpenAI({ apiKey: key });
    
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('ru-RU', { weekday: 'long' });
    
    const prompt = `Создайте краткий позитивный гороскоп на ${dayOfWeek} для знака ${zodiacSign}.
Ответ должен быть одним абзацем на русском языке, 2-3 предложения, дружелюбным тоном.
Избегайте негативных предсказаний.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Вы - профессиональный астролог, создающий позитивные гороскопы на русском языке."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });
    
    const text = completion.choices[0]?.message?.content || 
      `Сегодня для ${zodiacSign} благоприятный день! Звезды располагают к позитивным изменениям и новым возможностям.`;
    
    return NextResponse.json({ text });
    
  } catch (error) {
    console.error('Error generating horoscope:', error);
    return NextResponse.json({ 
      text: 'Сегодня особенный день! Прислушайтесь к своему внутреннему голосу и действуйте с уверенностью.' 
    });
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