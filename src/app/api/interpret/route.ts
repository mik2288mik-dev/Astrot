import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import { OpenAI } from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const InterpretSchema = z.object({
  tgId: z.number().optional(),
  chart: z.object({
    planets: z.array(z.object({
      key: z.string(),
      lon: z.number(),
      sign: z.string(),
      house: z.number()
    })),
    houses: z.object({
      asc: z.number(),
      mc: z.number()
    }),
    bigThree: z.object({
      Sun: z.string(),
      Moon: z.string(),
      Ascendant: z.string()
    })
  }).optional()
});

const InterpretationResponseSchema = z.object({
  summary: z.string(),
  personality: z.string(),
  work_money: z.string(),
  love_social: z.string(),
  health_energy: z.string(),
  today_focus: z.string(),
  disclaimers: z.array(z.string())
});

export async function POST(request: NextRequest) {
  try {
    const input = InterpretSchema.parse(await request.json());
    
    let chartData;
    let profileData;
    
    // Получаем данные карты
    if (input.tgId) {
      // Загружаем профиль для персонализации
      profileData = await kv.get(`profile:${input.tgId}`);
      
      if (!profileData) {
        return NextResponse.json({ 
          success: false, 
          error: 'Profile not found' 
        }, { status: 404 });
      }
    }
    
    if (input.chart) {
      chartData = input.chart;
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Chart data is required' 
      }, { status: 400 });
    }
    
    // Формируем промпт для OpenAI
    const prompt = createAstrologyPrompt(chartData, profileData);
    
    let interpretation;
    
    if (process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Вы - профессиональный астролог с дружелюбным подходом. Создайте интерпретацию натальной карты на русском языке. 
              Используйте практичный, позитивный тон без излишнего жаргона. 
              Ответ должен быть в формате JSON со следующими полями:
              - summary: краткое общее описание личности (2-3 предложения)
              - personality: описание характера и особенностей личности
              - work_money: рекомендации по карьере и финансам
              - love_social: советы по отношениям и социальной жизни
              - health_energy: рекомендации по здоровью и энергии
              - today_focus: на что обратить внимание сегодня
              - disclaimers: массив из 2-3 дисклеймеров о том, что астрология - это инструмент самопознания`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 2000
        });
        
        const content = completion.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No response from OpenAI');
        }
        
        interpretation = InterpretationResponseSchema.parse(JSON.parse(content));
        
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
        // Fallback to default interpretation
        interpretation = getDefaultInterpretation(chartData);
      }
    } else {
      // Fallback when no OpenAI key
      interpretation = getDefaultInterpretation(chartData);
    }
    
    return NextResponse.json({
      success: true,
      interpretation
    });
    
  } catch (error) {
    console.error('Error in interpretation API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}

function createAstrologyPrompt(chart: { bigThree: { Sun: string; Moon: string; Ascendant: string }; planets: Array<{ key: string; sign: string; house: number }> }, profile?: { name?: string }): string {
  const { bigThree, planets } = chart;
  
  let prompt = `Проанализируйте натальную карту со следующими данными:

Большая тройка:
- Солнце в ${bigThree.Sun}
- Луна в ${bigThree.Moon}  
- Асцендент в ${bigThree.Ascendant}

Планеты:`;

  planets.forEach((planet: { key: string; sign: string; house: number }) => {
    prompt += `\n- ${planet.key} в ${planet.sign} в ${planet.house} доме`;
  });

  if (profile?.name) {
    prompt += `\n\nДополнительная информация о человеке:
- Имя: ${profile.name}`;
  }

  prompt += `\n\nСоздайте практичную, дружелюбную интерпретацию, избегая сложной терминологии. 
Сосредоточьтесь на практических советах и позитивных аспектах.`;

  return prompt;
}

function getDefaultInterpretation(chart: { bigThree: { Sun: string; Moon: string; Ascendant: string } }) {
  const { bigThree } = chart;
  
  return {
    summary: `Ваша уникальная комбинация ${bigThree.Sun} Солнца, ${bigThree.Moon} Луны и ${bigThree.Ascendant} Асцендента создает интересную и многогранную личность с большим потенциалом для роста.`,
    
    personality: `Солнце в ${bigThree.Sun} наделяет вас особыми качествами этого знака, а Луна в ${bigThree.Moon} влияет на ваш эмоциональный мир. ${bigThree.Ascendant} Асцендент определяет, как вас воспринимают окружающие.`,
    
    work_money: `Ваша астрологическая карта указывает на способности, которые можно развить в профессиональной сфере. Обратите внимание на области, которые резонируют с вашими природными талантами.`,
    
    love_social: `В отношениях важно учитывать баланс между вашими солнечными и лунными качествами. Ваш Асцендент в ${bigThree.Ascendant} влияет на первое впечатление, которое вы производите.`,
    
    health_energy: `Поддерживайте баланс между активностью и отдыхом. Прислушивайтесь к потребностям своего тела и эмоциональному состоянию.`,
    
    today_focus: `Сегодня обратите внимание на возможности для самовыражения и творчества. Доверьтесь своей интуиции при принятии решений.`,
    
    disclaimers: [
      "Астрология - это инструмент для самопознания, а не предсказание судьбы",
      "Используйте астрологические советы как руководство, но всегда принимайте собственные решения",
      "Каждый человек уникален, и астрологическая карта - лишь один из способов понять себя лучше"
    ]
  };
}