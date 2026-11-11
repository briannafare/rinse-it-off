/** One-time cleaning prices for the /book page: a real number for this house.
 *
 *  Bri 2026-11-11: the old "from" prices ($500 for windows, $750 roof) read as
 *  overcharging, and a range plus "book a visit to get your real price" wasn't a quote.
 *  Rates below are the SuperMe panel's founding rates (Peter Kazanjy, Kyle Poyar, Paul
 *  Ghio, Rohan Katyal, Dan Hockenmaier, 2026-11-11, https://superme.ai/chat/2h58b0ooushnzie9ir6b3),
 *  set near the Portland market: about 20% under list for the first 25 customers.
 *  One $250 minimum on the whole visit, never per service; no minimum on a day the crew
 *  is already nearby. Condition can move the price by at most CONDITION_CAP, and only
 *  with the homeowner's OK. The text assistant's price guide
 *  (~/tools/rinse-it-off-ghl/homeowner_bot.py) must match these numbers. */
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

// ── Rates: [founding, list]. Change prices here. ────────────────────────────
export const FOUNDING_SPOTS = 25;
export const LIST_UP = 1.2; // list = founding × 1.2, shown crossed out
export const RATE = {
  gutterLf: 1.5,
  window: 10,
  concreteSf: 0.25,
  houseWashSf: 0.19, // per sq ft of living area
  roofSf: { light: 0.225, patchy: 0.25, thick: 0.325 } as Record<Moss, number>, // thick = second pass priced in
};
export const FLOOR = { "roof-moss": 395, "house-wash": 350 } as Partial<Record<ServiceKey, number>>; // smallest job of that kind
// ponytail: one factor for height (ladder work, slower). Tune against real crew hours.
export const STORY_FACTOR: Record<Stories, number> = { 1: 1, 2: 1.1, 3: 1.3 };
export const VISIT_MIN = 250;
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
export interface Choices { moss: Moss; windows: number; driveway: Driveway }

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

/** Founding price of one service for this house, or null if it's priced on site. */
export function servicePrice(key: ServiceKey, h: House, c: Choices): number | null {
  const m = measure(h);
  const sf = STORY_FACTOR[h.stories];
  const raw: Partial<Record<ServiceKey, number>> = {
    "roof-moss": m.roofSf * RATE.roofSf[c.moss],
    gutters: m.gutterLf * RATE.gutterLf * sf,
    "house-wash": h.sqft * RATE.houseWashSf * sf,
    windows: c.windows * RATE.window * sf,
    driveway: DRIVEWAY_SF[c.driveway] * RATE.concreteSf,
  };
  if (raw[key] === undefined) return null;
  return round5(Math.max(raw[key]!, FLOOR[key] ?? 0));
}

export interface Quote {
  lines: { key: ServiceKey; label: string; price: number; list: number }[];
  unpriced: string[];
  subtotal: number;
  list: number;
  minimumGap: number; // what's left to reach VISIT_MIN on a normal day (0 if covered)
}

export function quote(h: House, picked: ServiceKey[], c: Choices): Quote {
  const lines = SERVICES.filter((s) => picked.includes(s.key) && s.priced).map((s) => {
    const price = servicePrice(s.key, h, c)!;
    return { key: s.key, label: s.label, price, list: round5(price * LIST_UP) };
  });
  const subtotal = lines.reduce((t, l) => t + l.price, 0);
  return {
    lines,
    unpriced: SERVICES.filter((s) => picked.includes(s.key) && !s.priced).map((s) => s.label),
    subtotal,
    list: lines.reduce((t, l) => t + l.list, 0),
    minimumGap: lines.length ? Math.max(0, VISIT_MIN - subtotal) : 0,
  };
}

/** The one add worth suggesting, preferring one that covers the visit minimum. */
export function pairing(picked: ServiceKey[]): { key: ServiceKey; why: string } | null {
  const has = (k: ServiceKey) => picked.includes(k);
  if (has("roof-moss") && !has("gutters")) return { key: "gutters", why: "Moss off the roof ends up in the gutters, so most people clear them on the same visit." };
  if (has("gutters") && !has("roof-moss")) return { key: "roof-moss", why: "Roof moss is what fills most gutters. Treating it on the same visit keeps them clear longer." };
  if (has("windows") && !has("gutters")) return { key: "gutters", why: "Gutters are the usual add to a window visit, with the ladder already out." };
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
