interface RateEntry {
  count: number;
  resetAt: number;
}

const hits = new Map<string, RateEntry>();

if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (now > entry.resetAt) hits.delete(key);
    }
  }, 300_000);
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export function getRemainingRequests(key: string, maxRequests: number): number {
  const entry = hits.get(key);
  if (!entry || Date.now() > entry.resetAt) return maxRequests;
  return Math.max(0, maxRequests - entry.count);
}

export function resetRateLimit(key: string): void {
  hits.delete(key);
}
