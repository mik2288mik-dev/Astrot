import { getOpenAI, getModel } from '@/lib/ai/openai';
import { toMessage } from '@/lib/utils/errors';
import { isAllowed } from '@/lib/chat/guard';
import { systemPrompt } from '@/lib/chat/system';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { messages, natal } = await req.json(); // messages: [{role,content}...]
    
    // Берем последнее сообщение пользователя для проверки
    const lastUserMessage = messages?.findLast?.((m: any) => m.role === 'user')?.content || '';
    
    // Проверяем через гвард - разрешена ли тема
    const g = isAllowed(lastUserMessage);
    if (!g.allowed) {
      return Response.json({
        type: 'guard',
        text: 'Я отвечаю только на астрологию, нумерологию и таро. Выберите тему:',
        options: [
          { label: 'Натальная карта', prompt: 'Разбор моей натальной карты' },
          { label: 'Совместимость', prompt: 'Синастрия: совместимость по датам' },
          { label: 'Нумерология', prompt: 'Посчитай число судьбы' },
          { label: 'Таро', prompt: 'Расклад на неделю' }
        ]
      }, { status: 200 });
    }

    const openai = getOpenAI();
    
    // Получаем системный промпт для конкретного домена
    const system = systemPrompt(g.domain!);

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