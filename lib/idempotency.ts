type CacheEntry<T> = { value: Promise<T>; expiresAt: number };

const TTL_MS = 2 * 60_000; // 2 minutes
const cache = new Map<string, CacheEntry<any>>();

export function rememberPromise<T>(key: string, factory: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const existing = cache.get(key);
  if (existing && existing.expiresAt > now) {
    return existing.value;
  }
  const value = factory();
  cache.set(key, { value, expiresAt: now + TTL_MS });
  return value;
}