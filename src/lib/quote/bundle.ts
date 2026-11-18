/** Pick-your-services pricing (Bri 2026-11-18): the client checks the services they want on /pick/<id>
 *  and the bundle discount applies on its own. Plain module, no directives: the client page shows the
 *  math live and the server re-runs the same math on accept, so a price is never taken from the browser.
 *
 *  Tiers:
 *    1 service                      no discount
 *    2 services                     10% off
 *    3 or more                      15% off
 *    the full set                   20% off: roof, siding, windows and walkways (driveway) are all on the
 *                                   quote and the client picks every service on it.
 *  The bundle discount replaces the tool's "Same visit" credit; the visit minimum still holds. */

import { ROOF_GUTTER_SHARE, VISIT_MIN } from "@/lib/one-time-estimate";

export interface OfferLine {
  id: string;
  name: string; // what the client reads, e.g. "Gutters cleaned out, downspouts flushed"
  category: string; // e.g. "Gutters"
  price: number; // this line on the quote as sent
}

export type BundleKey = "roof" | "gutters" | "siding" | "windows" | "walkways" | "other";
export const FULL_SET: BundleKey[] = ["roof", "siding", "windows", "walkways"];
export const TIERS = [
  { min: 2, pct: 10, label: "Pick 2 services" },
  { min: 3, pct: 15, label: "Pick 3 or more" },
] as const;
export const FULL_PCT = 20;

/** Lines the tool adds on its own; the bundle discount and the minimum below take their place. */
export function isAutoLine(category: string): boolean {
  return /^(same visit|visit minimum|pricing note)$/i.test(category.trim());
}

export function bundleKey(l: Pick<OfferLine, "category" | "name">): BundleKey {
  const t = `${l.category} ${l.name}`.toLowerCase();
  if (/gutter/.test(l.category.toLowerCase())) return "gutters";
  if (/roof|moss/.test(t)) return "roof";
  if (/house wash|siding|soft wash of the siding/.test(t)) return "siding";
  if (/window/.test(t)) return "windows";
  if (/driveway|walkway|concrete|patio|sidewalk/.test(t)) return "walkways";
  if (/gutter/.test(t)) return "gutters";
  return "other";
}

/** "Full gutter clean, added to the roof" is half price only with the roof (ROOF_GUTTER_SHARE). */
const isRoofGutter = (l: OfferLine) => /added to the roof/i.test(l.category);

export function lineFor(l: OfferLine, roofPicked: boolean): { name: string; category: string; price: number } {
  if (isRoofGutter(l) && !roofPicked) {
    return { name: l.name, category: "Gutters", price: Math.round(l.price / ROOF_GUTTER_SHARE / 5) * 5 };
  }
  return { name: l.name, category: l.category, price: l.price };
}

export interface BundleResult {
  lines: Array<{ id: string; name: string; category: string; price: number }>;
  subtotal: number;
  pct: number;
  discount: number;
  minimumAdd: number; // what the visit minimum adds after the discount
  total: number;
  fullSetOnQuote: boolean; // whether 20% is reachable on this quote at all
  next: { pct: number; need: string } | null; // the next tier up, for the nudge
}

export function priceSelection(offer: OfferLine[], pickedIds: string[]): BundleResult {
  const all = offer.filter((l) => l.price > 0 && !isAutoLine(l.category));
  const picked = all.filter((l) => pickedIds.includes(l.id));
  const roofPicked = picked.some((l) => bundleKey(l) === "roof");
  const lines = picked.map((l) => ({ id: l.id, ...lineFor(l, roofPicked) }));
  const subtotal = lines.reduce((t, l) => t + l.price, 0);

  const onQuote = new Set(all.map(bundleKey));
  const fullSetOnQuote = FULL_SET.every((k) => onQuote.has(k));
  const everything = picked.length === all.length;
  const n = picked.length;
  const pct = fullSetOnQuote && everything && n > 0 ? FULL_PCT : n >= 3 ? 15 : n === 2 ? 10 : 0;

  const discount = Math.round(subtotal * pct) / 100;
  const net = subtotal - discount;
  const minimumAdd = n > 0 && net < VISIT_MIN ? Math.round((VISIT_MIN - net) * 100) / 100 : 0;
  const total = n > 0 ? Math.round((net + minimumAdd) * 100) / 100 : 0;

  const left = all.length - n;
  const next =
    pct === FULL_PCT || n === 0
      ? null
      : n === 1
        ? { pct: 10, need: "Add one more service" }
        : n === 2 && all.length >= 3
          ? { pct: 15, need: "Add one more service" }
          : fullSetOnQuote && left > 0
            ? { pct: FULL_PCT, need: left === 1 ? "Add the last service" : `Add the other ${left} services` }
            : null;

  return { lines, subtotal, pct, discount, minimumAdd, total, fullSetOnQuote, next };
}
