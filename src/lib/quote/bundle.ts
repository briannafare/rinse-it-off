/** Pick-your-services pricing (Bri 2026-11-18): the client checks the services they want on /pick/<id>
 *  and the bundle discount applies on its own. Plain module, no directives: the client page shows the
 *  math live and the server re-runs the same math on accept, so a price is never taken from the browser.
 *
 *  A tier needs BOTH its service count and its dollar floor (the subtotal before the discount). Bri,
 *  2026-11-18: "We're not going to give 20% off to somebody who's only spending $250." A pick that meets
 *  the count but not the dollars gets the best tier it fully meets.
 *    10%  2 or more services and $600+
 *    15%  3 or more services and $1,000+
 *    20%  every service on the quote, the quote has roof, siding, windows and walkways, and $1,500+
 *  The dollar floors are a first pass, set here only. The bundle discount replaces the tool's
 *  "Same visit" credit; the visit minimum still holds. */

import { ROOF_GUTTER_SHARE, VISIT_MIN } from "@/lib/one-time-estimate";

export interface OfferLine {
  id: string;
  name: string; // what the client reads, e.g. "Gutters cleaned out, downspouts flushed"
  category: string; // e.g. "Gutters"
  price: number; // this line on the quote as sent
}

export type BundleKey = "roof" | "gutters" | "siding" | "windows" | "walkways" | "other";
export const FULL_SET: BundleKey[] = ["roof", "siding", "windows", "walkways"];

export interface Tier {
  pct: number;
  services: number; // at least this many picked
  spend: number; // and at least this subtotal before the discount
  everything?: boolean; // and every service on the quote, with the full set on it
  label: string;
}
export const TIERS: Tier[] = [
  { pct: 10, services: 2, spend: 600, label: "2 services, $600 or more" },
  { pct: 15, services: 3, spend: 1000, label: "3 or more services, $1,000 or more" },
  { pct: 20, services: 0, spend: 1500, everything: true, label: "Everything on this quote, $1,500 or more" },
];

/** Lines the tool adds on its own; the bundle discount and the minimum below take their place. */
export function isAutoLine(category: string): boolean {
  return /^(same visit|visit minimum|pricing note)$/i.test(category.trim());
}

export function bundleKey(l: Pick<OfferLine, "category" | "name">): BundleKey {
  const t = `${l.category} ${l.name}`.toLowerCase();
  if (/gutter/.test(l.category.toLowerCase())) return "gutters";
  if (/roof|moss/.test(t)) return "roof";
  if (/house wash|siding/.test(t)) return "siding";
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
  tiers: Tier[]; // the tiers this quote can reach at all, for the page
  next: { pct: number; need: string } | null; // the next tier up, for the nudge
}

const usd = (n: number) => `$${Math.ceil(n).toLocaleString("en-US")}`;

export function priceSelection(offer: OfferLine[], pickedIds: string[]): BundleResult {
  const all = offer.filter((l) => l.price > 0 && !isAutoLine(l.category));
  const picked = all.filter((l) => pickedIds.includes(l.id));
  const roofPicked = picked.some((l) => bundleKey(l) === "roof");
  const lines = picked.map((l) => ({ id: l.id, ...lineFor(l, roofPicked) }));
  const subtotal = lines.reduce((t, l) => t + l.price, 0);
  const n = lines.length;

  // What the quote could ever reach: the whole quote, with the roof (so roof gutters at their add-on price).
  const roofOnQuote = all.some((l) => bundleKey(l) === "roof");
  const everythingTotal = all.reduce((t, l) => t + lineFor(l, roofOnQuote).price, 0);
  const fullSetOnQuote = FULL_SET.every((k) => all.some((l) => bundleKey(l) === k));
  const reachable = TIERS.filter((t) =>
    t.everything ? fullSetOnQuote && everythingTotal >= t.spend : all.length >= t.services && everythingTotal >= t.spend,
  );

  const meets = (t: Tier) =>
    n > 0 && subtotal >= t.spend && (t.everything ? fullSetOnQuote && n === all.length : n >= t.services);
  const pct = Math.max(0, ...TIERS.filter(meets).map((t) => t.pct));

  const discount = Math.round(subtotal * pct) / 100;
  const net = subtotal - discount;
  const minimumAdd = n > 0 && net < VISIT_MIN ? Math.round((VISIT_MIN - net) * 100) / 100 : 0;
  const total = n > 0 ? Math.round((net + minimumAdd) * 100) / 100 : 0;

  // The nudge: the next reachable tier, and the plainest thing standing between them and it.
  const up = reachable.find((t) => t.pct > pct);
  let next: BundleResult["next"] = null;
  if (up && n > 0) {
    const left = all.length - n;
    const moreServices = up.everything ? left : Math.max(0, up.services - n);
    const moreSpend = Math.max(0, up.spend - subtotal);
    const need =
      up.everything && left > 0
        ? left === 1 ? "Add the last service" : `Add the other ${left} services`
        : moreServices > 0
          ? `Add ${moreServices === 1 ? "one more service" : `${moreServices} more services`}${moreSpend > 0 ? ` (${usd(up.spend)} or more in all)` : ""}`
          : `Add ${usd(moreSpend)} more in services`;
    next = { pct: up.pct, need };
  }

  return { lines, subtotal, pct, discount, minimumAdd, total, tiers: reachable, next };
}
