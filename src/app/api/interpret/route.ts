import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'Ты дружелюбный астролог, объясняй простым языком, отвечай строго в JSON по схеме {summary,personality:{strengths,growth},work_money,love_social,health_energy,today_focus,disclaimers}',
        },
        { role: 'user', content: JSON.stringify(body) },
      ],
      response_format: { type: 'json_object' },
    })
    const text = resp.choices[0]?.message?.content || '{}'
    return NextResponse.json({ ok: true, data: JSON.parse(text) })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
