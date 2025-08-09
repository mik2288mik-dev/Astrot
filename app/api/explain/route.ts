import { NextRequest } from 'next/server';
import { explainSchema } from '@/lib/validation';
import { getOpenAI } from '@/lib/openai';

export const runtime = 'nodejs';

const SYSTEM_TEMPLATE = (
  locale: string
) => `Ты — профессиональный астролог с 15+ лет практики.
Формат ответа:
1) Общая картина
2) Сильные стороны
3) Слабые стороны
4) Потенциальные напряжения (без фатализма)
5) Практические рекомендации
6) TL;DR (3–5 пунктов)
Пиши на языке ${locale}.`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = explainSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 422 });
  const { summaryText, dailyText, locale } = parsed.data;

  try {
    const openai = getOpenAI();
    const messages = [
      { role: 'system' as const, content: SYSTEM_TEMPLATE(locale) },
      { role: 'user' as const, content: `Суммарное описание карты:\n${summaryText}\n\nДневной гороскоп:${dailyText ? `\n${dailyText}` : ' (нет данных)'}` }
    ];
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages
    });
    const text = completion.choices?.[0]?.message?.content || '';
    return Response.json({ text });
  } catch (e: any) {
    return Response.json({ error: 'openai_failed', message: String(e?.message || e) }, { status: 502 });
  }
}