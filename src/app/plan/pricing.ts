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

export interface HouseInputs {
  address: string;
  livingSqft: number;
  stories: Stories;
  windows: number;
  roof: RoofType;
  driveway: DrivewaySize;
  access: Access;
}

// ── Per-unit rates (already carry target margin, never discount below) ──────
export const RATE = {
  windowEach: 22, // per exterior window, per visit (used for the free-windows VALUE only)
  concreteSf: 0.36, // driveway + walkways, also the winter walkway pass
  sidingSf: 0.31,
  roofSf: 0.5,
  gutterLf: { 1: 1.25, 2: 1.75, 3: 2.25 } as Record<Stories, number>,
} as const;

// ── Windows are FREE with the membership. Their value is what a standalone
//    visit costs: Rinse's real per-trip minimum, or the per-window rate if
//    that comes to more. Four visits a year. ──────────────────────────────────
export const WINDOW_VISITS_PER_YEAR = 4;
export const WINDOW_VISIT_MIN = 500; // real standalone per-trip minimum

// ── Scope from the house's shape, not a size bucket ─────────────────────────
//    footprint = living sq ft ÷ stories. Roof and gutters follow the footprint
//    (a 3-story house has a small roof; the stories multiplier and the gutter
//    floor carry the height cost). Siding follows living area. Driveway and
//    winter walkway follow living area between the engine's anchors. The
//    constants below are least-squares fits so a 2-story house at 2,000 /
//    3,200 / 4,500 sq ft lands on the engine's tier A / B / C scope numbers:
//      roof    320 + 0.88 × footprint  -> 1,200 / 1,728 / 2,300  (engine 1,200 / 1,700 / 2,300)
//      siding  540 + 0.48 × living     -> 1,500 / 2,076 / 2,700  (engine 1,500 / 2,000 / 2,700)
//      gutters 4 × sqrt(footprint) × 1.06 -> 134 / 170 / 201 ft  (engine 120 / 160 / 220)
export const ROOF_BASE_SF = 320; // eaves and overhang that every roof has
export const ROOF_PITCH = 0.88; // roof sq ft per sq ft of footprint beyond that
export const SIDING_BASE_SF = 540;
export const SIDING_K = 0.48; // siding sq ft per sq ft of living area beyond that
export const GUTTER_K = 1.06; // gutter ft per ft of a square footprint's perimeter
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
  if (sqft <= first.livingSqft) return (first[key] * sqft) / first.livingSqft;
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
  const footprintSf = livingSqft / stories;
  return {
    livingSqft,
    footprintSf,
    drivewaySf: interpFlat(livingSqft, "drivewaySf"),
    sidingSf: SIDING_BASE_SF + SIDING_K * livingSqft,
    roofSf: ROOF_BASE_SF + ROOF_PITCH * footprintSf,
    gutterLf: 4 * Math.sqrt(footprintSf) * GUTTER_K,
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

// Gutter per-visit floor by stories: fuel, equipment and time on a tall house.
export const GUTTER_VISIT_MIN: Record<Stories, number> = { 1: 250, 2: 350, 3: 500 };

// Roof and siding lines on a 3+ story house (1 and 2 stories = 1.0).
export const STORY_MULT: Record<Stories, number> = { 1: 1, 2: 1, 3: 1.15 };

// ── Membership discounts and floor ──────────────────────────────────────────
export const MEMBER_MONTHLY_DISCOUNT = 0.2; // 12 months, billed monthly
export const MEMBER_PREPAID_DISCOUNT = 0.25; // 12 months, paid up front
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
  lines: PriceLine[]; // the priced (core) lines
  subtotal: number; // sum of lines before the access modifier
  accessMultiplier: number;
  coreAnnual: number; // core services booked one at a time, per year
  windowsPerVisitValue: number; // what one standalone window visit would cost
  windowsAnnualValue: number; // × WINDOW_VISITS_PER_YEAR, free with the membership
  valueReceived: number; // coreAnnual + windowsAnnualValue
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
  const storyMult = STORY_MULT[h.stories];

  // Driveway and walkways (summer), scaled by the size the customer picked.
  const drivewayMult = h.driveway === "small" ? MODIFIER.drivewaySmall : h.driveway === "large" ? MODIFIER.drivewayLarge : 1;
  lines.push({
    key: "driveway",
    label: "Driveway and walkways, summer",
    detail: `${h.driveway === "small" ? "Small" : h.driveway === "large" ? "Large or long" : "Typical"}, about ${about(scope.drivewaySf * drivewayMult, 50).toLocaleString()} sq ft`,
    amount: scope.drivewaySf * RATE.concreteSf * drivewayMult,
  });

  // Siding soft wash (spring)
  lines.push({
    key: "siding",
    label: "Siding soft wash, spring",
    detail: `${storyWord(h.stories)}, about ${about(scope.sidingSf, 50).toLocaleString()} sq ft of siding`,
    amount: scope.sidingSf * RATE.sidingSf * storyMult,
  });

  // Roof soft wash (spring), more for wood shake or a steep pitch.
  const roofMult = h.roof === "shake-steep" ? MODIFIER.roofShakeOrSteep : 1;
  lines.push({
    key: "roof",
    label: "Roof soft wash, spring",
    detail: `${h.roof === "shake-steep" ? "Wood shake or steep pitch" : h.roof === "metal-tile" ? "Metal or tile" : "Composition shingle"}, about ${about(scope.roofSf, 50).toLocaleString()} sq ft of roof`,
    amount: scope.roofSf * RATE.roofSf * roofMult * storyMult,
  });

  // Gutters (fall). Rate steps up with stories; a steep roof uses the top
  // rate; a per-visit floor covers the time a tall house takes.
  const gutterStories: Stories = h.roof === "shake-steep" ? 3 : h.stories;
  const gutterByFeet = scope.gutterLf * RATE.gutterLf[gutterStories];
  const gutterFloor = GUTTER_VISIT_MIN[h.stories];
  const gutterFloored = gutterByFeet < gutterFloor;
  lines.push({
    key: "gutters",
    label: "Gutters and downspouts, fall",
    detail: `${storyWord(h.stories)}, about ${about(scope.gutterLf, 5)} ft${gutterFloored ? `, ${h.stories}-story minimum` : ""}`,
    amount: Math.max(gutterByFeet, gutterFloor),
  });

  // Winter walkway and entry pass.
  lines.push({
    key: "winter",
    label: "Walkways, steps and entry, winter",
    detail: `Front walk, steps and entry, about ${about(scope.winterWalkwaySf, 10)} sq ft`,
    amount: scope.winterWalkwaySf * RATE.concreteSf,
  });

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const accessMultiplier = h.access === "gated-tight" ? MODIFIER.accessGatedTight : h.access === "steep-ladder" ? MODIFIER.accessSteepLadder : 1;
  const coreAnnual = subtotal * accessMultiplier;

  // Windows: free with the membership, valued at what a standalone visit costs.
  const windows = Math.max(0, Math.floor(h.windows || 0));
  const windowsPerVisitValue = Math.max(WINDOW_VISIT_MIN, windows * RATE.windowEach);
  const windowsAnnualValue = windowsPerVisitValue * WINDOW_VISITS_PER_YEAR;
  const valueReceived = coreAnnual + windowsAnnualValue;

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
    valueReceived,
    memberMonthly,
    memberAnnual,
    prepaidAnnual,
    prepaidMonthlyEquivalent,
    savedVsAlaCarte: Math.max(0, Math.round(valueReceived - memberAnnual)),
    prepaySavesMore: Math.max(0, memberAnnual - prepaidAnnual),
  };
}

// ── Add-on menu. Member price = list × 0.90. Quantities are measured on site. ─
export interface AddOn {
  key: string;
  label: string;
  /** List price and its unit, when a rate exists. Omitted when it is quoted on site. */
  list?: { amount: number; unit: string };
  /** Shown instead of a computed price when the item has no unit rate. */
  fromNote?: string;
}
export const ADD_ONS: AddOn[] = [
  { key: "deck", label: "Deck soft wash", fromNote: "Priced at your first visit" },
  { key: "fence", label: "Fence soft wash", fromNote: "Priced at your first visit" },
  { key: "patio", label: "Patio or extra concrete", list: { amount: 0.36, unit: "sq ft" } },
  { key: "garage", label: "Garage floor degrease", list: { amount: 0.45, unit: "sq ft" } },
  { key: "solar", label: "Solar panel wash", list: { amount: 12, unit: "panel" } },
  { key: "skylights", label: "Skylights", list: { amount: 15, unit: "each" } },
  { key: "lights", label: "Holiday lights, custom fit to your roofline", fromNote: "From $599 with the membership, priced by roofline and complexity" },
];

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

/** Two suggestions from the house and the calendar. Lights from September
 *  through January, deck the rest of the year; skylights for 2+ stories;
 *  garage floor for a large driveway. */
export function suggestedAddOns(h: HouseInputs, month = new Date().getMonth()): string[] {
  const lightsSeason = month >= 8 || month === 0;
  const picks: string[] = [lightsSeason ? "lights" : "deck"];
  if (h.stories >= 2) picks.push("skylights");
  else if (h.driveway === "large") picks.push("garage");
  else picks.push(lightsSeason ? "deck" : "fence");
  return picks.slice(0, 2);
}

export function addOnPriceLabel(a: AddOn): string {
  if (a.list) return `From ${dollars(memberAddOnPrice(a.list.amount))} ${unitWord(a.list.unit)}, priced at your first visit`;
  return a.fromNote ?? "Priced at your first visit";
}
