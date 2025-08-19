import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { decide, type Domain } from '@/lib/chat/guard';
import { systemPrompt } from '@/lib/chat/system';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { message, domain: clientDomain, lastWasGuard } = await req.json();
    const text = String(message ?? '').trim();

    const decision = decide(clientDomain ?? null, text, !!lastWasGuard);

    // 1) Попросить выбрать тему — только один раз
    if (decision.action === 'ask-domain') {
      return NextResponse.json({
        type: 'guard',
        text: 'Привет! 👋 Я ваш персональный астролог-консультант. Помогу разобраться в тонкостях астрологии, нумерологии и таро. О чем хотите поговорить?',
        options: decision.options,
        once: true,
      });
    }

    const domain = decision.domain as Domain;

    // 2) Настройка роли под домен (жёстко ограничиваем знания)
    const sys = systemPrompt(domain);

    // 3) Мягкая перенаправлялка (не блокируем диалог)
    const softPrefix = decision.action === 'soft-redirect'
      ? (domain==='astro'
          ? 'Интересная тема! Хотя это не совсем астрология, попробую связать со звездным влиянием. '
          : domain==='numerology'
            ? 'Любопытно! Это выходит за рамки чистой нумерологии, но давайте посмотрим через призму чисел. '
            : 'Занимательно! Хотя это не совсем таро, попробую найти связь с картами. ')
      : '';

    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ error: 'OPENAI_API_KEY missing' }, { status: 500 });
    const openai = new OpenAI({ apiKey: key });

    // Вызов модели
    const rsp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: softPrefix + text },
      ],
    });

    return NextResponse.json({
      type: 'ai',
      domain,                                // <- вернём выбранный домен
      text: rsp.choices[0]?.message?.content ?? '',
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}