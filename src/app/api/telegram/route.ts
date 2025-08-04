import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // Simple health check to avoid 404 when Telegram pings the webhook
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    console.log("Telegram update", update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to process Telegram update", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
