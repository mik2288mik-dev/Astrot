import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { sign, day } = req.body as { sign:string; day?: "today"|"yesterday"|"tomorrow" };
  if (!sign) return res.status(400).json({ error: "Missing sign" });

  const url = `https://aztro.sameerkumar.website/?sign=${encodeURIComponent(sign)}&day=${encodeURIComponent(day||"today")}`;
  try {
    const r = await fetch(url, { method: "POST" });
    if (!r.ok) throw new Error("Aztro error");
    const data = await r.json();
    res.status(200).json(data);
  } catch (e:any) {
    res.status(500).json({ error: e.message || "failed" });
  }
}
