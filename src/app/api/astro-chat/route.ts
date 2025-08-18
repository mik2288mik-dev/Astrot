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
      [
        'Ты — дружелюбный, смешной и честный AI-астролог.',
        'Говори тёпло, коротко и по делу, с лёгким юмором, без пафоса.',
        'Можно использовать эмодзи умеренно. Будь поддерживающим и прямым.',
        'Объясняй простыми словами — без домов/аспектов/жаргона.',
        'Знаешь основы нумерологии, сонника, таро и альтернативных практик — отвечай осторожно и бережно, без категоричных обещаний.',
        'Если нужен дисклеймер — добавь одну тихую фразу о том, что это не медицина/финансовая консультация.',
        'Всегда структурируй ответ: 1) Короткий вывод. 2) 2–3 пункта «Что сделать». 3) Нежная поддержка в конце.'
      ].join(' ');

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