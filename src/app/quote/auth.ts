/** Passcode gate for the internal /quote tool. Server-side only — imported by
 *  the page (server component), the server actions, and the analyze route.
 *  No auth libraries: the cookie value is a salted SHA-256 of QUOTE_PASSWORD,
 *  so rotating the env var invalidates every existing cookie. */

import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const QUOTE_AUTH_COOKIE = "rio_quote_auth";
export const QUOTE_AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Derived token stored in the httpOnly cookie. Null when QUOTE_PASSWORD unset. */
export function expectedAuthToken(): string | null {
  const pw = process.env.QUOTE_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`rio-quote-v1:${pw}`).digest("hex");
}

/** Re-check on every server action / route handler that touches quote data. */
export async function isQuoteAuthed(): Promise<boolean> {
  const expected = expectedAuthToken();
  if (!expected) return false;
  const jar = await cookies();
  return jar.get(QUOTE_AUTH_COOKIE)?.value === expected;
}
