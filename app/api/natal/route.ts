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
  return Response.json({ received: body, message: 'Natal chart request accepted (mock).' });
}