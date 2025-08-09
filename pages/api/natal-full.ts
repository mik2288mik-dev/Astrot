import type { NextApiRequest, NextApiResponse } from "next";
import { computeNatal } from "../../lib/natal";
import { openai } from "../../lib/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    // 1) заглушка проверки подписки (позже заменим)
    const { userId } = req.body || {};
    const active = Boolean(userId); // если есть userId — считаем, что премиум активен
    if (!active) return res.status(200).json({ error: "premium_required" });

    // 2) расчёт карты
    const chart = await computeNatal(req.body);

    // 3) дневной гороскоп Aztro по солнечному знаку
    const hz = await fetch(`${getBaseUrl(req)}/api/horoscope`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sign: chart.sunSign.toLowerCase(), day: "today" })
    });
    const daily = hz.ok ? await hz.json() : null;
    const dailyText = daily ? [
      `Sign: ${chart.sunSign}`,
      `Mood: ${daily.mood}`,
      `Compatibility: ${daily.compatibility}`,
      `Description: ${daily.description}`
    ].join("\n") : "";

    // 4) объяснение ИИ
    const system = `
Ты — добрый, проницательный и чуткий супер-астролог, почти предсказатель, с 15+ годами практики.
Формат ответа:
1) Общая картина
2) Сильные стороны
3) Слабые стороны
4) Потенциальные напряжения (без фатализма)
5) Практические рекомендации
6) TL;DR (3–5 пунктов)
Пиши на языке ru.
`.trim();

    const r = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Данные натальной карты:\n${chart.summaryText}\n\n${dailyText ? "Дневной гороскоп (Aztro):\n"+dailyText : ""}` }
      ]
    });

    const explanation = r.choices?.[0]?.message?.content || "";
    res.status(200).json({ chart, daily, explanation });
  } catch (e:any) {
    res.status(500).json({ error: e.message || "natal-full failed" });
  }
}

function getBaseUrl(req: NextApiRequest){
  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  return `${proto}://${req.headers.host}`;
}
