export async function GET() {
  return Response.json({
    status: 'ok',
    demo: true,
    sample: {
      sun: 'Gemini',
      moon: 'Libra',
      ascendant: 'Leo'
    }
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return new Response(
    JSON.stringify({
      ok: false,
      error: { code: 410, message: 'Endpoint moved. Use /api/natal-chart (POST).', details: { received: body } }
    }),
    { status: 410, headers: { 'Content-Type': 'application/json' } }
  );
}