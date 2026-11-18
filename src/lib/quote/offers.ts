import "server-only";
import { randomBytes } from "node:crypto";
import { del, list, put } from "@vercel/blob";
import type { OfferLine } from "./bundle";
import type { ContactInfo, PropertyType } from "./types";

/** A quote sent as a pick-your-services link: rinseitoff.com/pick/<id> (Bri 2026-11-18).
 *  Stored like job reports: every save is a new file quote-offers/<id>/offer-<ms>.json and a read takes
 *  the newest, because Blob caches an overwritten file for 60 s. The id is the only key to the page. */

export const OFFER_ID = /^[a-z0-9]{12}$/;

export interface QuoteOffer {
  id: string;
  quoteId?: string; // the saved quote in /quote this came from
  quoteNumber: string;
  propertyType: PropertyType;
  contact: ContactInfo;
  lines: OfferLine[];
  status: "sent" | "accepted";
  sentBy: string; // first name the client sees
  sentAt: number;
  ghl: { contactId?: string; opportunityId?: string; estimateId?: string };
  accepted?: { ids: string[]; total: number; pct: number; at: number };
  updatedAt: number; // field notes and the AI's findings stay in the GHL note, not in this file
}

export function newOfferId(): string {
  return Array.from(randomBytes(12), (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("");
}

const prefix = (id: string) => `quote-offers/${id}/offer-`;

async function versions(id: string) {
  const { blobs } = await list({ prefix: prefix(id), limit: 1000 });
  return blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
}

export async function readOffer(id: string): Promise<QuoteOffer | null> {
  if (!OFFER_ID.test(id)) return null;
  for (const b of (await versions(id).catch(() => [])).slice(0, 2)) {
    const res = await fetch(b.url, { cache: "no-store" }).catch(() => null);
    if (res?.ok) return (await res.json()) as QuoteOffer;
  }
  return null;
}

export async function writeOffer(o: QuoteOffer): Promise<void> {
  await put(`${prefix(o.id)}${Date.now()}.json`, JSON.stringify({ ...o, updatedAt: Date.now() }), {
    access: "public", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60,
  });
  const old = (await versions(o.id).catch(() => [])).slice(2).map((b) => b.url);
  if (old.length) await del(old).catch(() => null);
}
