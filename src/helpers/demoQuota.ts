const BLOCKED_UNTIL_KEY = "demoBlockedUntil";

/** Seconds from a Retry-After header, or null when it is missing or not a positive number. */
export function readRetryAfterSeconds(response: Response): number | null {
  const seconds = Number(response.headers.get("Retry-After"));
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

/** Remembers that the server refused the demo for this many seconds. */
export function blockDemoFor(seconds: number, storage?: Storage, now = Date.now()): void {
  try {
    // Read the default inside the try: touching localStorage throws when site data is blocked.
    (storage ?? localStorage).setItem(BLOCKED_UNTIL_KEY, String(now + seconds * 1000));
  } catch {
    // Storage unavailable (e.g. blocked site data): the server still enforces the quota.
  }
}

/** Milliseconds left on a stored block, or 0 when the demo is not blocked. */
export function demoBlockRemainingMs(storage?: Storage, now = Date.now()): number {
  try {
    const store = storage ?? localStorage;
    const until = Number(store.getItem(BLOCKED_UNTIL_KEY));
    if (Number.isFinite(until) && until > now) return until - now;
    store.removeItem(BLOCKED_UNTIL_KEY);
  } catch {
    // Storage unavailable: treat as not blocked.
  }
  return 0;
}

/** "in 5 minutes" or "in about 23 hours". */
export function describeWait(ms: number): string {
  const minutes = Math.max(1, Math.ceil(ms / 60_000));
  if (minutes < 60) return `in ${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.ceil(minutes / 60);
  return `in about ${hours} hour${hours === 1 ? "" : "s"}`;
}
