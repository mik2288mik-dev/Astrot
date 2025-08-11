import { NextRequest } from 'next/server';
import { verifySubscriptionSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = verifySubscriptionSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'invalid_input', details: parsed.error.flatten() }, { status: 422 });

  const { userId } = parsed.data;
  const active = process.env.MOCK_PREMIUM_ALL === 'true' ? true : userId.length % 2 === 0;
  return Response.json({ active });
}