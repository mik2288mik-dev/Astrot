import { getOpenAI, getModel } from '@/lib/ai/openai';
import { toMessage } from '@/lib/utils/errors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const openai = getOpenAI();
    const { messages, natal } = await req.json(); // messages: [{role,content}...]

    const system =
      'Ты дружелюбный астролог. Говори коротко и по делу, без домов/аспектов/жаргона. ' +
      'Объясняй простыми словами. Если вопрос общий — уточняй аккуратно.';

    const resp = await openai.chat.completions.create({
      model: getModel(),           // <-- gpt-4o-mini
      temperature: 0.5,
      messages: [
        { role: 'system', content: system },
        { role: 'system', content: `Контекст natal: ${JSON.stringify(natal ?? {})}` },
        ...(messages ?? [])
      ]
    });

    const text = resp.choices?.[0]?.message?.content || '';
    return Response.json({ reply: text });
  } catch (e: unknown) {
    console.error('astro-chat error:', e);
    return Response.json({ error: toMessage(e) }, { status: 502 });
  }
}