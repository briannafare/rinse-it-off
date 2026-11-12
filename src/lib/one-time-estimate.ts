/** One-time cleaning prices for the /book page: a real number for this house.
 *
 *  Bri 2026-11-11: priced from crew time and cost, then checked against published Portland-area
 *  prices (notes/signal-rinse-gutter-competitor-prices-2026-11.md in the brain). Her crew times:
 *  two-story gutters about 2 total hours; a roof job about 4 (soft wash, loose debris off,
 *  gutters flushed). Each visit costs about $108 before the work (drive, setup, truck), so the
 *  $295 visit minimum carries small jobs and a second service on the same visit gets
 *  SAME_VISIT_OFF. SuperMe panel check (Paul Ghio, Kyle Poyar, Lenny Rachitsky, Dan Hockenmaier,
 *  Peter Kazanjy, 2026-11-11, https://superme.ai/chat/2h598f3u9at2azopcmxvp). No minimum on a day
 *  the crew is already nearby. Condition can move the price by at most CONDITION_CAP, and only
 *  with the homeowner's OK. The text assistant and phone receptionist price guides
 *  (~/tools/rinse-it-off-ghl/) must match these numbers. */
import { includedWindows } from "@/app/plan/pricing";

export type ServiceKey = "roof-moss" | "house-wash" | "gutters" | "driveway" | "windows" | "deck-fence" | "other";
export type Moss = "light" | "patchy" | "thick";
export type Driveway = "small" | "typical" | "large";
export type Stories = 1 | 2 | 3;

export const SERVICES: { key: ServiceKey; label: string; priced: boolean }[] = [
  { key: "roof-moss", label: "Roof moss", priced: true },
  { key: "gutters", label: "Gutters", priced: true },
  { key: "house-wash", label: "House wash (siding)", priced: true },
  { key: "windows", label: "Windows (outside)", priced: true },
  { key: "driveway", label: "Driveway and walkways", priced: true },
  { key: "deck-fence", label: "Deck or fence", priced: false },
  { key: "other", label: "Something else", priced: false },
];

// ── Rates. Change prices here. ───────────────────────────────────────────────
export const RATE = {
  gutterLf: 1.5,
  window: 11,
  concreteSf: 0.35,
  houseWashSf: 0.23, // per sq ft of living area
  roofSf: { 1: 0.275, 2: 0.4, 3: 0.47 } as Record<Stories, number>, // patchy moss; lower roofs go faster
};
export const MOSS_FACTOR: Record<Moss, number> = { light: 0.9, patchy: 1, thick: 1.25 };
export const FLOOR = { "roof-moss": 450, "house-wash": 395 } as Partial<Record<ServiceKey, number>>; // smallest job of that kind
// Height slows each job differently: gutters most (two-story about 2 hours vs 1.25).
export const STORY_FACTOR: Record<"gutters" | "other", Record<Stories, number>> = {
  gutters: { 1: 1, 2: 1.3, 3: 1.6 },
  other: { 1: 1, 2: 1.1, 3: 1.3 },
};
export const VISIT_MIN = 295;
export const SAME_VISIT_OFF = 75; // two or more services on one visit share the drive and setup
export const ROOF_GUTTER_SHARE = 0.5; // the roof job already flushes the gutters; a full clean on top is half price
export const CONDITION_CAP = 75;
export const DRIVEWAY_SF: Record<Driveway, number> = { small: 450, typical: 750, large: 1100 }; // driveway + front walk
export const MOSS_LABEL: Record<Moss, string> = {
  light: "A little green in spots",
  patchy: "Green patches across parts of the roof",
  thick: "Thick cushions covering whole sections",
};

export interface House {
  sqft: number; // living area
  stories: Stories;
  footprintSf?: number; // measured building outline, when Metro has it
  perimeterFt?: number;
}
export interface Choices { moss: Moss; windows: number; driveway: Driveway; hard?: Hard[] }

/** Houses that take a different setup (Bri 2026-11-12: four stories on forested hillsides, no room
 *  for the lift, delicate surfaces). The services each one affects get a fixed price from photos
 *  instead of an instant one; everything else stays instant. CONDITION_CAP is only for ordinary
 *  variation. SuperMe panel 2026-11-12: https://superme.ai/chat/2h5e3glcc8jhnwvtfyqdd */
export type Hard = "tall" | "slope" | "lift" | "surface";
const UP_HIGH: ServiceKey[] = ["roof-moss", "gutters", "house-wash"];
export const HARD: Record<Hard, { label: string; reviews: ServiceKey[] }> = {
  tall: { label: "Four or more stories", reviews: UP_HIGH },
  slope: { label: "Steep slope or hillside around the house", reviews: UP_HIGH },
  lift: { label: "Trees, wires or no level spot to park a lift near the house", reviews: UP_HIGH },
  surface: { label: "Cedar shake, tile, stucco or old paint", reviews: ["roof-moss", "house-wash"] },
};

/** Roof, gutter and window quantities for the house. Uses the measured outline when we
 *  have it, else a footprint from living area (plus a garage). */
export function measure(h: House) {
  const footprint = h.footprintSf && h.footprintSf > 300 ? h.footprintSf : h.sqft / h.stories + 300;
  const perimeter = h.perimeterFt && h.perimeterFt > 60 ? h.perimeterFt : 4.6 * Math.sqrt(footprint); // 4.6: houses aren't square
  return {
    roofSf: Math.round(footprint * 1.15 + perimeter), // ~6/12 pitch plus a foot of eave
    gutterLf: Math.round(perimeter),
    windows: includedWindows(h.sqft),
  };
}

/** Guess stories from county living area vs the measured outline (minus a garage). */
export function guessStories(sqft: number, footprintSf?: number): Stories | null {
  if (!footprintSf || footprintSf < 500) return null;
  const r = sqft / Math.max(400, footprintSf - 400);
  return r < 1.35 ? 1 : r < 2.4 ? 2 : 3;
}

const round5 = (n: number) => Math.round(n / 5) * 5;

/** Price of one service on its own for this house, or null if it's priced on site. */
export function servicePrice(key: ServiceKey, h: House, c: Choices): number | null {
  const m = measure(h);
  const sf = STORY_FACTOR.other[h.stories];
  const raw: Partial<Record<ServiceKey, number>> = {
    "roof-moss": m.roofSf * RATE.roofSf[h.stories] * MOSS_FACTOR[c.moss],
    gutters: m.gutterLf * RATE.gutterLf * STORY_FACTOR.gutters[h.stories],
    "house-wash": h.sqft * RATE.houseWashSf * sf,
    windows: c.windows * RATE.window * sf,
    driveway: DRIVEWAY_SF[c.driveway] * RATE.concreteSf,
  };
  if (raw[key] === undefined) return null;
  return round5(Math.max(raw[key]!, FLOOR[key] ?? 0));
}

export interface Quote {
  lines: { key: ServiceKey; label: string; price: number }[];
  unpriced: string[];
  review: string[]; // priced from photos (HARD), not in the total
  subtotal: number;
  sameVisitOff: number; // SAME_VISIT_OFF when two or more priced services, else 0
  minimumGap: number; // what's left to reach VISIT_MIN on a normal day (0 if covered)
  total: number; // what they pay on a normal day
}

export function quote(h: House, picked: ServiceKey[], c: Choices): Quote {
  const review = new Set((c.hard ?? []).flatMap((h) => HARD[h]?.reviews ?? [])); // hard comes from the browser
  const instant = (k: ServiceKey) => picked.includes(k) && !review.has(k);
  const roof = instant("roof-moss");
  const lines = SERVICES.filter((s) => instant(s.key) && s.priced).map((s) => {
    const alone = servicePrice(s.key, h, c)!;
    return s.key === "gutters" && roof
      ? { key: s.key, label: "Full gutter clean, added to the roof", price: round5(alone * ROOF_GUTTER_SHARE) }
      : { key: s.key, label: s.label, price: alone };
  });
  const subtotal = lines.reduce((t, l) => t + l.price, 0);
  const sameVisitOff = lines.length > 1 ? SAME_VISIT_OFF : 0;
  const net = subtotal - sameVisitOff;
  return {
    lines,
    unpriced: SERVICES.filter((s) => picked.includes(s.key) && !s.priced).map((s) => s.label),
    review: SERVICES.filter((s) => picked.includes(s.key) && s.priced && review.has(s.key)).map((s) => s.label),
    subtotal,
    sameVisitOff,
    minimumGap: lines.length ? Math.max(0, VISIT_MIN - net) : 0,
    total: lines.length ? Math.max(net, VISIT_MIN) : 0,
  };
}

/** The one add worth suggesting. */
export function pairing(picked: ServiceKey[]): { key: ServiceKey; why: string } | null {
  const has = (k: ServiceKey) => picked.includes(k);
  if (has("gutters") && !has("roof-moss")) return { key: "roof-moss", why: "Roof moss is what fills most gutters. Treating it on the same visit keeps them clear longer." };
  if (has("windows") && !has("gutters")) return { key: "gutters", why: "Gutters are the usual add to a window visit, since we're already working up high." };
  if (has("house-wash") && !has("windows")) return { key: "windows", why: "Siding rinse runs down the glass, so the outside windows are the natural add after a house wash." };
  if (has("driveway") && !has("house-wash")) return { key: "house-wash", why: "With the crew and the water already there, the siding is the usual add to a driveway." };
  return null;
}

/** Sizes for houses county records don't have. Midpoints of the bands. */
export const SIZE_BANDS = [
  { label: "Under 1,500 sq ft", sqft: 1200 },
  { label: "1,500 to 2,500", sqft: 2000 },
  { label: "2,500 to 3,500", sqft: 3000 },
  { label: "Over 3,500", sqft: 4000 },
];
