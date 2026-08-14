/** Sliding-window submit counter for the public lead forms.
 *  Two thresholds: FLAG (still save the lead, tag it for review) and
 *  BLOCK (stop writing to the CRM). Clock is injectable so it's testable
 *  without waiting on real time. Run the check: node scripts/check-abuse-guard.mjs */

export const WINDOW_MS = 10 * 60_000;
export const FLAG_AFTER = 3; // more than this in the window -> save, but tag needs-review
export const BLOCK_AFTER = 12; // more than this -> refuse to write

export function createWindow({
  windowMs = WINDOW_MS,
  flagAfter = FLAG_AFTER,
  blockAfter = BLOCK_AFTER,
} = {}) {
  const hits = new Map();

  return function record(key, now = Date.now()) {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);

    // Cheap sweep so a flood of unique keys can't grow the map forever.
    if (hits.size > 5000) {
      for (const [k, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
    }

    const count = recent.length;
    return { count, flagged: count > flagAfter, blocked: count > blockAfter };
  };
}
