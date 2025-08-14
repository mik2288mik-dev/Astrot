import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { chart, locale = 'ru', tone = 'friendly' } = await req.json();

    const system = `
Ты — опытный астролог и эмпатичный собеседник.
Говори ясным человеческим языком, избегай пугающих формулировок.
Стиль: теплый, современный, поддерживающий, но честный.
Говори на языке пользователя: ${locale}.
Тональность ответа: ${tone}.
Структура ответа:
1) "Большая тройка" (Солнце, Луна, Асцендент) — 3–5 предложений.
2) Ключевые темы по планетам в домах — 6–10 пунктов.
3) Мягкие рекомендации (3–5 коротких, практичных).
Не используй жаргон вроде «квадратуры» без пояснений. Не выдумывай факты, опирайся только на данные карты.
`;

    const user = `
Ниже — данные натальной карты в JSON.
Нужно кратко и ёмко интерпретировать.

Данные:
${JSON.stringify(chart, null, 2)}
`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    });

    const text = completion.choices[0]?.message?.content ?? '';
    return new Response(JSON.stringify({ ok: true, text }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }
}