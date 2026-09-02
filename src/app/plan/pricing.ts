/** Rinse It Off one-plan membership pricing.
 *
 *  Pure functions, no I/O. Imported by the client component (live price) and
 *  the server action (recomputed server-side so the CRM never trusts the
 *  browser's number). Same inputs always give the same output; see
 *  pricing.test.ts, which runs before every build.
 *
 *  Ground truth for the rates and scope anchors:
 *  ~/brain/notes/rinse-it-off-membership-pricing-engine.md
 */

export type Stories = 1 | 2 | 3;
export type RoofType = "composition" | "shake-steep" | "metal-tile";
export type DrivewaySize = "small" | "typical" | "large";
export type Access = "easy" | "gated-tight" | "steep-ladder";

/** Optional exact measurements. Any one given replaces the estimate for its
 *  line (quantity × rate, still subject to the per-job minimum). */
export interface ExactInputs {
  roofSf?: number;
  drivewaySf?: number;
  walkwaySf?: number;
  gutterLf?: number;
  largeWindows?: number; // large or picture windows, $36 a visit each
  frenchWindows?: number; // French or multi-pane, $23 a visit each
}
export const EXACT_KEYS: (keyof ExactInputs)[] = ["roofSf", "drivewaySf", "walkwaySf", "gutterLf", "largeWindows", "frenchWindows"];

export interface HouseInputs {
  address: string;
  livingSqft: number;
  stories: Stories;
  windows: number;
  roof: RoofType;
  driveway: DrivewaySize;
  access: Access;
  exact?: ExactInputs;
}

// ── Per-unit rates (already carry target margin, never discount below) ──────
export const RATE = {
  windowEach: 22, // kept for reference; the window VALUE uses WINDOW_TIERS below
  concreteSf: 0.36, // driveway + walkways, also the winter walkway pass
  sidingSf: 0.31,
  roofSf: 0.5,
  gutterLf: { 1: 1.25, 2: 1.75, 3: 2.25 } as Record<Stories, number>,
} as const;

// ── Windows are FREE with the membership. Their value is what a standalone
//    visit costs: the real per-trip minimum, or the tiered per-window price if
//    that comes to more. Four visits a year. ──────────────────────────────────
export const WINDOW_VISITS_PER_YEAR = 4;
export const WINDOW_VISIT_MIN = 500; // real standalone per-trip minimum
// Screens are cleaned free too, while they are off. The customer removes and
// reinstalls them; Rinse never touches a screen on the frame. Engine rate:
export const SCREEN_RATE = 9; // per screen, per visit
export const LARGE_WINDOW_RATE = 36; // large or picture window, per visit
export const FRENCH_WINDOW_RATE = 23; // French or multi-pane window, per visit
// Tiered window pricing, per visit: the first 30 at $22, 31 to 50 at $14,
// 51 and up at $8. `upTo: null` means everything past the previous band.
export const WINDOW_TIERS: { upTo: number | null; rate: number }[] = [
  { upTo: 30, rate: 22 },
  { upTo: 50, rate: 14 },
  { upTo: null, rate: 8 },
];

/** What one standalone window visit costs for a given count. Large and
 *  French windows, when the customer counts them, come out of the tiered
 *  count and are priced at their own rates. */
export function windowVisitValue(windows: number, large = 0, french = 0): number {
  const special = Math.min(windows, Math.max(0, large) + Math.max(0, french));
  const largeN = Math.min(Math.max(0, large), special);
  const frenchN = special - largeN;
  const regular = windows - special;
  let placed = 0;
  let total = 0;
  for (const band of WINDOW_TIERS) {
    const capacity = band.upTo === null ? Infinity : band.upTo - placed;
    const count = Math.max(0, Math.min(regular - placed, capacity));
    total += count * band.rate;
    placed += count;
    if (placed >= regular) break;
  }
  total += largeN * LARGE_WINDOW_RATE + frenchN * FRENCH_WINDOW_RATE;
  return Math.max(WINDOW_VISIT_MIN, total);
}

// ── Scope from the house's shape, not a size bucket ─────────────────────────
//    footprint = living sq ft ÷ stories (floored at MIN_FOOTPRINT_SF: even a
//    narrow 3-story house has a garage, a porch, a roof over something).
//    Roof and gutters follow the footprint. Siding is the wall area: the
//    footprint's perimeter × wall height (stories × WALL_FT_PER_STORY) × a
//    net factor for windows, doors and trim. Driveway and winter walkway
//    follow living area between the engine anchors and never drop below the
//    engine's tier A scope. Fits against the engine (2-story house):
//      roof    320 + 0.88 × footprint      -> 1,200 / 1,728 / 2,300 sq ft at 2,000 / 3,200 / 4,500 sf
//      siding  4√footprint × 20 ft × 0.659 -> 1,667 / 2,109 / 2,500 sq ft (engine 1,500 / 2,000 / 2,700)
//      gutters 4√footprint × 1.06          ->   134 /   170 /   201 ft   (engine 120 / 160 / 220)
export const ROOF_BASE_SF = 320; // eaves and overhang that every roof has
export const ROOF_PITCH = 0.88; // roof sq ft per sq ft of footprint beyond that
export const WALL_FT_PER_STORY = 10; // a 30-ft-wall house is priced like 3 stories
export const SIDING_NET = 0.659; // wall area that is actually siding (least-squares fit to the engine)
export const GUTTER_K = 1.06; // gutter ft per ft of a square footprint's perimeter
export const MIN_FOOTPRINT_SF = 600;
export const SCOPE_FLOOR_SQFT = 1200; // nothing prices below a 1,200 sq ft house
export const SCOPE_CEIL_SQFT = 12000;

// Driveway and winter walkway anchors (engine tiers), interpolated on living area.
export interface FlatAnchor { livingSqft: number; drivewaySf: number; winterWalkwaySf: number }
export const FLAT_ANCHORS: FlatAnchor[] = [
  { livingSqft: 2000, drivewaySf: 1000, winterWalkwaySf: 300 },
  { livingSqft: 3200, drivewaySf: 1400, winterWalkwaySf: 400 },
  { livingSqft: 4500, drivewaySf: 1900, winterWalkwaySf: 500 },
];

export interface Scope {
  livingSqft: number;
  footprintSf: number;
  drivewaySf: number;
  sidingSf: number;
  roofSf: number;
  gutterLf: number;
  winterWalkwaySf: number;
}

function interpFlat(sqft: number, key: "drivewaySf" | "winterWalkwaySf"): number {
  const first = FLAT_ANCHORS[0];
  const last = FLAT_ANCHORS[FLAT_ANCHORS.length - 1];
  if (sqft <= first.livingSqft) return first[key]; // tier A is the smallest job we price
  if (sqft >= last.livingSqft) return (last[key] * sqft) / last.livingSqft;
  for (let i = 0; i < FLAT_ANCHORS.length - 1; i++) {
    const lo = FLAT_ANCHORS[i];
    const hi = FLAT_ANCHORS[i + 1];
    if (sqft >= lo.livingSqft && sqft <= hi.livingSqft) {
      const t = (sqft - lo.livingSqft) / (hi.livingSqft - lo.livingSqft);
      return lo[key] + (hi[key] - lo[key]) * t;
    }
  }
  return last[key];
}

/** Scope quantities for a living area and story count. Deterministic. */
export function scopeFor(livingSqftRaw: number, stories: Stories): Scope {
  const livingSqft = Math.min(SCOPE_CEIL_SQFT, Math.max(SCOPE_FLOOR_SQFT, livingSqftRaw || 0));
  const footprintSf = Math.max(MIN_FOOTPRINT_SF, livingSqft / stories);
  const perimeterFt = 4 * Math.sqrt(footprintSf);
  return {
    livingSqft,
    footprintSf,
    drivewaySf: interpFlat(livingSqft, "drivewaySf"),
    sidingSf: perimeterFt * stories * WALL_FT_PER_STORY * SIDING_NET,
    roofSf: ROOF_BASE_SF + ROOF_PITCH * footprintSf,
    gutterLf: perimeterFt * GUTTER_K,
    winterWalkwaySf: interpFlat(livingSqft, "winterWalkwaySf"),
  };
}

// ── Complexity modifiers. These are the ONLY adjustments to the engine. ─────
export const MODIFIER = {
  roofShakeOrSteep: 1.25, // roof line only
  drivewaySmall: 0.8, // driveway line only
  drivewayLarge: 1.25, // driveway line only
  accessGatedTight: 1.08, // whole core total
  accessSteepLadder: 1.15, // whole core total
} as const;

// ── Per-job minimums: what the crew would actually come out for. Each
//    seasonal line = max(quantity × rate × modifiers, minimum). ─────────────
//    Rinse's standalone per-trip minimum is $500, so no seasonal line is ever
//    under that, and taller houses go up from there.
export const SIDING_FACTOR = 0.8; // house wash priced 20% under the engine's siding rate
export const SIDING_MIN: Record<Stories, number> = { 1: 480, 2: 680, 3: 960 };
export const ROOF_MIN: Record<Stories, number> = { 1: 500, 2: 700, 3: 950 };
export const GUTTER_VISIT_MIN: Record<Stories, number> = { 1: 500, 2: 650, 3: 850 };
export const DRIVEWAY_MIN: Record<DrivewaySize, number> = { small: 500, typical: 600, large: 750 };
export const WINTER_MIN: Record<Stories, number> = { 1: 300, 2: 350, 3: 400 };

// Height, charged where it happens: a per-visit access charge on every
// visit of the year (4 seasonal + 4 window).
export const VISITS_PER_YEAR = 8;
export const ACCESS_PER_VISIT: Record<Stories, number> = { 1: 0, 2: 25, 3: 75 };

// ── Membership discounts and floor ──────────────────────────────────────────
export const MEMBER_MONTHLY_DISCOUNT = 0.2; // 12 months, billed monthly
export const MEMBER_PREPAID_DISCOUNT = 0.28; // 12 months, paid up front: a full 10% under the monthly year (0.72 / 0.80)
export const PREPAID_UNDER_MONTHLY = 0.1; // what the customer sees: prepay and save 10%
// Multi-year is a PRICE LOCK, not a discount: 2 or 3 years at the same monthly
// rate. The one exception is prepaying the whole term up front.
export type TermYears = 1 | 2 | 3;
export const TERM_OPTIONS: TermYears[] = [1, 2, 3];
export const MULTI_YEAR_PREPAID_DISCOUNT = 0.3; // whole term paid up front, 2 or 3 years (beats the 1-year prepay)
/** Total for prepaying the full term. One year uses the normal prepaid rate. */
export function prepaidTermTotal(coreAnnual: number, years: TermYears): number {
  const discount = years > 1 ? MULTI_YEAR_PREPAID_DISCOUNT : MEMBER_PREPAID_DISCOUNT;
  return Math.ceil(coreAnnual * years * (1 - discount));
}
export const MONTHLY_FLOOR = 189; // postcard's "from $189" for a basic 3-bedroom
export const ADDON_MEMBER_DISCOUNT = 0.1; // add-on menu = list × 0.90 for members
export const DEPOSIT_USD = 99; // route-slot deposit, applied to the first month. Bri can change this.

export interface PriceLine {
  key: string;
  label: string;
  detail: string; // how the number was reached, plain words, no unit rates
  amount: number; // dollars per year, unrounded
}

export interface PriceResult {
  scope: Scope;
  lines: PriceLine[]; // the priced seasonal lines, plus the per-visit access line
  subtotal: number; // seasonal total before the site-access multiplier
  accessMultiplier: number;
  coreAnnual: number; // seasonal work booked one at a time, per year, after access
  windowsPerVisitValue: number; // what one standalone window visit would cost
  windowsAnnualValue: number; // × WINDOW_VISITS_PER_YEAR, free with the membership
  screensAnnualValue: number; // SCREEN_RATE × windows × visits, free while they are off
  valueReceived: number; // coreAnnual + windowsAnnualValue + screensAnnualValue
  memberMonthly: number; // whole dollars, rounded up, floored at MONTHLY_FLOOR
  memberAnnual: number; // memberMonthly × 12 (what the CRM opportunity is worth)
  prepaidAnnual: number; // whole dollars, rounded up
  prepaidMonthlyEquivalent: number; // whole dollars, rounded up
  savedVsAlaCarte: number; // valueReceived minus the membership year
  prepaySavesMore: number; // membership year minus the prepaid year
}

const about = (n: number, step: number) => Math.round(n / step) * step;
const storyWord = (s: Stories) => (s === 3 ? "3 stories" : s === 2 ? "2 stories" : "1 story");

export function priceHouse(h: HouseInputs): PriceResult {
  const scope = scopeFor(h.livingSqft, h.stories);
  const lines: PriceLine[] = [];

  // Driveway and walkways (summer), scaled by the size the customer picked.
  const ex = h.exact || {};
  const drivewayMult = h.driveway === "small" ? MODIFIER.drivewaySmall : h.driveway === "large" ? MODIFIER.drivewayLarge : 1;
  const exactConcrete = (ex.drivewaySf || 0) + (ex.walkwaySf || 0);
  lines.push({
    key: "driveway",
    label: "Driveway and walkways, summer",
    detail: exactConcrete > 0
      ? `Your measurement: ${exactConcrete.toLocaleString()} sq ft`
      : `${h.driveway === "small" ? "Small" : h.driveway === "large" ? "Large or long" : "Typical"}, about ${about(scope.drivewaySf * drivewayMult, 50).toLocaleString()} sq ft`,
    amount: Math.max(exactConcrete > 0 ? exactConcrete * RATE.concreteSf : scope.drivewaySf * RATE.concreteSf * drivewayMult, DRIVEWAY_MIN[h.driveway]),
  });

  // Siding soft wash (spring): wall area from the perimeter and the wall height.
  lines.push({
    key: "siding",
    label: "Siding soft wash, spring",
    detail: `${storyWord(h.stories)}, about ${about(scope.sidingSf, 50).toLocaleString()} sq ft of siding`,
    amount: Math.max(scope.sidingSf * RATE.sidingSf * SIDING_FACTOR, SIDING_MIN[h.stories]),
  });

  // Roof soft wash (spring), more for wood shake or a steep pitch.
  const roofMult = h.roof === "shake-steep" ? MODIFIER.roofShakeOrSteep : 1;
  const roofSf = ex.roofSf || scope.roofSf;
  lines.push({
    key: "roof",
    label: "Roof soft wash, spring",
    detail: ex.roofSf
      ? `Your measurement: ${ex.roofSf.toLocaleString()} sq ft`
      : `${h.roof === "shake-steep" ? "Wood shake or steep pitch" : h.roof === "metal-tile" ? "Metal or tile" : "Composition shingle"}, about ${about(scope.roofSf, 50).toLocaleString()} sq ft of roof`,
    amount: Math.max(roofSf * RATE.roofSf * roofMult, ROOF_MIN[h.stories]),
  });

  // Gutters (fall). Rate steps up with stories; a steep roof uses the top rate.
  const gutterStories: Stories = h.roof === "shake-steep" ? 3 : h.stories;
  const gutterLf = ex.gutterLf || scope.gutterLf;
  const gutterByFeet = gutterLf * RATE.gutterLf[gutterStories];
  const gutterFloor = GUTTER_VISIT_MIN[h.stories];
  lines.push({
    key: "gutters",
    label: "Gutters and downspouts, fall",
    detail: `${ex.gutterLf ? `Your measurement: ${ex.gutterLf.toLocaleString()} ft` : `${storyWord(h.stories)}, about ${about(scope.gutterLf, 5)} ft`}${gutterByFeet < gutterFloor ? `, ${h.stories}-story minimum` : ""}`,
    amount: Math.max(gutterByFeet, gutterFloor),
  });

  // Winter walkway and entry pass.
  lines.push({
    key: "winter",
    label: "Walkways, steps and entry, winter",
    detail: `Front walk, steps and entry, about ${about(scope.winterWalkwaySf, 10)} sq ft`,
    amount: Math.max(scope.winterWalkwaySf * RATE.concreteSf, WINTER_MIN[h.stories]),
  });

  // Tall-house access, charged on every visit of the year.
  const visitFee = ACCESS_PER_VISIT[h.stories];
  if (visitFee > 0) {
    lines.push({
      key: "story-access",
      label: `${h.stories}-story access, ${VISITS_PER_YEAR} visits`,
      detail: `Ladder and lift time on every visit, $${visitFee} a visit`,
      amount: visitFee * VISITS_PER_YEAR,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const accessMultiplier = h.access === "gated-tight" ? MODIFIER.accessGatedTight : h.access === "steep-ladder" ? MODIFIER.accessSteepLadder : 1;
  const coreAnnual = subtotal * accessMultiplier;

  // Windows: free with the membership, valued at what a standalone visit costs.
  const windows = Math.max(0, Math.floor(h.windows || 0));
  const windowsPerVisitValue = windowVisitValue(windows, ex.largeWindows || 0, ex.frenchWindows || 0);
  const windowsAnnualValue = windowsPerVisitValue * WINDOW_VISITS_PER_YEAR;
  const screensAnnualValue = SCREEN_RATE * windows * WINDOW_VISITS_PER_YEAR;
  const valueReceived = coreAnnual + windowsAnnualValue + screensAnnualValue;

  const memberMonthly = Math.max(MONTHLY_FLOOR, Math.ceil((coreAnnual * (1 - MEMBER_MONTHLY_DISCOUNT)) / 12));
  const memberAnnual = memberMonthly * 12;
  const prepaidAnnual = Math.ceil(coreAnnual * (1 - MEMBER_PREPAID_DISCOUNT));
  const prepaidMonthlyEquivalent = Math.ceil(prepaidAnnual / 12);

  return {
    scope,
    lines,
    subtotal,
    accessMultiplier,
    coreAnnual,
    windowsPerVisitValue,
    windowsAnnualValue,
    screensAnnualValue,
    valueReceived,
    memberMonthly,
    memberAnnual,
    prepaidAnnual,
    prepaidMonthlyEquivalent,
    savedVsAlaCarte: Math.max(0, Math.round(valueReceived - memberAnnual)),
    prepaySavesMore: Math.max(0, memberAnnual - prepaidAnnual),
  };
}

// ── Add-on menu. Member price = list × 0.90. Rates are Rinse's approved
//    residential table (src/app/quote/prompt.ts). Quantities are measured at
//    the first visit unless the calculator already knows the count. ─────────
export type AddOnGroup = "Around the house" | "Concrete and stone" | "Glass and roofline";
export interface AddOn {
  key: string;
  group: AddOnGroup;
  label: string;
  /** List price and its unit, when a rate exists. */
  list?: { amount: number; unit: string };
  /** The unit is "per window": the calculator multiplies by the window count. */
  perWindow?: boolean;
  /** Shown when there is no rate, or as a note under a rate. */
  note?: string;
  /** Records interest only; no price, tagged on the contact. */
  interestOnly?: boolean;
}
export const ADD_ONS: AddOn[] = [
  { key: "deck", group: "Around the house", label: "Deck or patio soft wash", list: { amount: 0.6, unit: "sq ft" } },
  { key: "fence", group: "Around the house", label: "Fence cleaning", list: { amount: 3.6, unit: "linear ft" } },
  { key: "gutter-whitening", group: "Around the house", label: "Gutter whitening (the black streaks on the outside)", note: "Priced at your first visit" },
  { key: "moss", group: "Around the house", label: "Moss treatment on walkways and walls", note: "Priced at your first visit, on top of the surface" },
  { key: "lights", group: "Around the house", label: "Ask me about custom holiday lights", note: "Custom quoted, we'll bring it up at your first visit", interestOnly: true },
  { key: "grease", group: "Concrete and stone", label: "Grease and oil stain removal", list: { amount: 150, unit: "spot" } },
  { key: "garage", group: "Concrete and stone", label: "Garage floor degrease", list: { amount: 0.45, unit: "sq ft" } },
  { key: "retaining", group: "Concrete and stone", label: "Retaining walls", list: { amount: 0.48, unit: "sq ft" } },
  { key: "masonry", group: "Concrete and stone", label: "Brick, block or stone walls", list: { amount: 0.54, unit: "sq ft" }, note: "Algae or efflorescence adds 40%" },
  { key: "graffiti", group: "Concrete and stone", label: "Graffiti removal", list: { amount: 3.6, unit: "sq ft" } },
  { key: "tracks", group: "Glass and roofline", label: "Window tracks and sills", list: { amount: 3.5, unit: "window" }, perWindow: true },
  { key: "skylights", group: "Glass and roofline", label: "Skylights, exterior", list: { amount: 15, unit: "each" } },
  { key: "storm", group: "Glass and roofline", label: "Storm door and storm window glass", list: { amount: 8, unit: "door" } },
  { key: "wells", group: "Glass and roofline", label: "Basement window wells", list: { amount: 8, unit: "well" } },
  { key: "solar", group: "Glass and roofline", label: "Solar panel wash", list: { amount: 12, unit: "panel" } },
];
export const ADD_ON_GROUPS: AddOnGroup[] = ["Around the house", "Concrete and stone", "Glass and roofline"];

export function memberAddOnPrice(list: number): number {
  return Math.round(list * (1 - ADDON_MEMBER_DISCOUNT) * 100) / 100;
}

const unitWord = (unit: string) => (unit === "each" ? "each" : `per ${unit}`);
const dollars = (n: number) => (n < 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(2).replace(/\.00$/, "")}`);

/** List price and member price as display strings, for the struck-through pair. */
export function addOnPrices(a: AddOn): { list: string; member: string; unit: string } | null {
  if (!a.list) return null;
  return { list: dollars(a.list.amount), member: dollars(memberAddOnPrice(a.list.amount)), unit: unitWord(a.list.unit) };
}

/** A computed member total when the calculator knows the quantity (per-window items). */
export function addOnKnownTotal(a: AddOn, h: HouseInputs): number | null {
  if (!a.list || !a.perWindow) return null;
  const n = Math.max(0, Math.floor(h.windows || 0));
  return Math.round(memberAddOnPrice(a.list.amount) * n * 100) / 100;
}

/** Two suggestions from the house and the calendar: deck or patio in spring
 *  and summer, tracks and sills for 20+ windows, a grease spot for a large
 *  driveway, solar the rest of the year. */
export function suggestedAddOns(h: HouseInputs, month = new Date().getMonth()): string[] {
  const picks: string[] = [];
  if (month >= 2 && month <= 7) picks.push("deck");
  if (h.windows >= 20) picks.push("tracks");
  if (h.driveway === "large") picks.push("grease");
  if (!picks.includes("deck") && picks.length < 2) picks.push("solar");
  if (picks.length < 2) picks.push("skylights");
  return picks.slice(0, 2);
}

export function addOnPriceLabel(a: AddOn, h?: HouseInputs): string {
  if (a.list) {
    const known = h ? addOnKnownTotal(a, h) : null;
    if (known !== null) return `${dollars(memberAddOnPrice(a.list.amount))} ${unitWord(a.list.unit)} × ${h!.windows} windows = ${dollars(known)}`;
    return `${dollars(memberAddOnPrice(a.list.amount))} ${unitWord(a.list.unit)}, measured at your first visit${a.note ? `. ${a.note}` : ""}`;
  }
  return a.note ?? "Priced at your first visit";
}
