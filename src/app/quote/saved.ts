"use server";

/** Saved quotes for the /quote tool (Bri 2026-11-15: "needs to save previous quotes somewhere that we can
 *  easily access, retrieve, and make edits"). One folder per quote in Blob store "rinse-quote-files":
 *    saved-quotes/<id>/quote.json   everything but the photos (written here, small)
 *    saved-quotes/<id>/photos.json  the compressed photos the AI reads (uploaded by the browser, a few MB)
 *  Shared by everyone who unlocks the tool. ponytail: the list reads every quote.json; add an index file
 *  if it ever holds thousands. Two people editing one quote at once: the last save wins. */

import { get, list, put } from "@vercel/blob";
import { isQuoteAuthed } from "./auth";

export interface SavedQuoteSummary {
  id: string;
  quoteNumber: string;
  name: string;
  address: string;
  total: number;
  status: "sent" | "in GHL, not sent" | "in progress";
  savedAt: number;
}

const ID = /^[a-z0-9-]{8,64}$/;
const dir = (id: string) => `saved-quotes/${id}`;

async function readJson<T>(pathname: string): Promise<T | null> {
  const r = await get(pathname, { access: "public", useCache: false }).catch(() => null);
  return r?.stream ? ((await new Response(r.stream).json()) as T) : null;
}

export async function saveQuote(id: string, summary: Omit<SavedQuoteSummary, "id" | "savedAt">, draft: unknown) {
  if (!(await isQuoteAuthed())) return { ok: false as const, error: "Unlock the tool again." };
  if (!ID.test(id)) return { ok: false as const, error: "Bad quote id." };
  const savedAt = Date.now();
  await put(`${dir(id)}/quote.json`, JSON.stringify({ summary: { ...summary, id, savedAt }, draft }), {
    access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60,
  });
  return { ok: true as const, savedAt };
}

export async function listQuotes(): Promise<SavedQuoteSummary[]> {
  if (!(await isQuoteAuthed())) return [];
  const blobs: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "saved-quotes/", limit: 1000, cursor });
    blobs.push(...page.blobs.map((b) => b.pathname).filter((p) => p.endsWith("/quote.json")));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const rows = await Promise.all(blobs.map((p) => readJson<{ summary: SavedQuoteSummary }>(p).catch(() => null)));
  return rows.flatMap((r) => (r?.summary ? [r.summary] : [])).sort((a, b) => b.savedAt - a.savedAt);
}

export async function loadQuote(id: string): Promise<{ draft: unknown; photos: unknown[] } | null> {
  if (!(await isQuoteAuthed()) || !ID.test(id)) return null;
  const [q, photos] = await Promise.all([
    readJson<{ draft: unknown }>(`${dir(id)}/quote.json`),
    readJson<unknown[]>(`${dir(id)}/photos.json`),
  ]);
  return q ? { draft: q.draft, photos: photos ?? [] } : null;
}
