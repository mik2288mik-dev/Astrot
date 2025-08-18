import { getOpenAI, getModel, defaultChatOptions } from '@/lib/ai/openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const openai = getOpenAI();
    const body = await req.json(); // { natal, topic, depth, locale? }

    const system = [
      'Пиши простым, тёплым языком.',
      'Без домов, аспектов и жаргона.',
      'Ответ строго JSON: { "title": string, "oneLine": string, "content": string[], "suggestions": [{ "label": string, "topic": string, "depth": number }], "wheelFocus"?: { "sign"?: string, "planet"?: "sun"|"moon"|"asc" } }',
      'Чем выше depth, тем конкретнее советы.'
    ].join(' ');

    const resp = await openai.chat.completions.create({
      model: getModel(),            // <-- gpt-4o-mini по умолчанию
      ...defaultChatOptions,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(body) }
      ]
    });

    const text = resp.choices?.[0]?.message?.content || '{}';
    return Response.json(JSON.parse(text));
  } catch (e: unknown) {
    console.error('interpret error:', e);
    const message = e instanceof Error ? e.message : 'OpenAI request failed';
    return Response.json({ error: message }, { status: 502 });
  }
}