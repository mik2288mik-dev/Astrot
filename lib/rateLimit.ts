type Entry = { count: number; resetAt: number };

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQ = 30; // per window
const bucket = new Map<string, Entry>();

export function rateLimitAllow(key: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = bucket.get(key);
  if (!entry || now > entry.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count < MAX_REQ) {
    entry.count += 1;
    return { allowed: true };
  }
  const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
  return { allowed: false, retryAfterSec };
}