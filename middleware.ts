import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'ALLOW-FROM https://web.telegram.org');
  res.headers.set('Content-Security-Policy', "frame-ancestors https://web.telegram.org https://web.telegram.im https://*.telegram.org");
  return res;
}