/** Rinse It Off one-plan membership pricing.
 *
 *  Pure functions, no I/O. Imported by the client component (live price) and
 *  the server action (recomputed server-side so the CRM never trusts the
 *  browser's number). Ground truth for every constant:
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
  windowEach: 22, // per exterior window, per visit
  concreteSf: 0.36, // driveway + walkways, also the winter walkway pass
  sidingSf: 0.31,
  roofSf: 0.5,
  gutterLf: { 1: 1.25, 2: 1.75, 3: 2.25 } as Record<Stories, number>,
} as const;

export const WINDOW_VISITS_PER_YEAR = 4;

// ── Home tiers by living area. Scope CEILINGS per visit, not estimates. ─────
export type TierCode = "A" | "B" | "C";
export interface Tier {
  code: TierCode;
  label: string;
  maxLivingSqft: number; // Infinity for the top tier
  windowsPerVisit: number;
  drivewaySf: number;
  sidingSf: number;
  roofSf: number;
  gutterLf: number;
  winterWalkwaySf: number;
}
export const TIERS: Tier[] = [
  { code: "A", label: "Cozy", maxLivingSqft: 2000, windowsPerVisit: 12, drivewaySf: 1000, sidingSf: 1500, roofSf: 1200, gutterLf: 120, winterWalkwaySf: 300 },
  { code: "B", label: "Standard", maxLivingSqft: 3200, windowsPerVisit: 20, drivewaySf: 1400, sidingSf: 2000, roofSf: 1700, gutterLf: 160, winterWalkwaySf: 400 },
  { code: "C", label: "Estate", maxLivingSqft: Infinity, windowsPerVisit: 30, drivewaySf: 1900, sidingSf: 2700, roofSf: 2300, gutterLf: 220, winterWalkwaySf: 500 },
];

// ── Complexity modifiers. These are the ONLY adjustments to the engine. ─────
export const MODIFIER = {
  roofShakeOrSteep: 1.25, // roof line only
  drivewaySmall: 0.8, // driveway line only
  drivewayLarge: 1.25, // driveway line only
  accessGatedTight: 1.08, // whole à la carte total
  accessSteepLadder: 1.15, // whole à la carte total
} as const;

// ── Membership discounts and floor ──────────────────────────────────────────
export const MEMBER_MONTHLY_DISCOUNT = 0.2; // 12 months, billed monthly
export const MEMBER_PREPAID_DISCOUNT = 0.25; // 12 months, paid up front
export const MONTHLY_FLOOR = 189; // postcard's "from $189" for a basic 3-bedroom
export const ADDON_MEMBER_DISCOUNT = 0.1; // add-on menu = list × 0.90 for members

export function tierFor(livingSqft: number): Tier {
  return TIERS.find((t) => livingSqft <= t.maxLivingSqft) ?? TIERS[TIERS.length - 1];
}

export interface PriceLine {
  key: string;
  label: string;
  detail: string; // how the number was reached, plain words
  amount: number; // dollars per year, unrounded
}

export interface PriceResult {
  tier: Tier;
  lines: PriceLine[];
  subtotal: number; // sum of lines before the access modifier
  accessMultiplier: number;
  alaCarteAnnual: number; // after access modifier
  memberMonthly: number; // whole dollars, rounded up, floored at MONTHLY_FLOOR
  memberAnnual: number; // memberMonthly × 12 (what the CRM opportunity is worth)
  prepaidAnnual: number; // whole dollars, rounded up
  prepaidMonthlyEquivalent: number; // whole dollars, rounded up
  windowsIncluded: number;
  windowsExtra: number;
}

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export function priceHouse(h: HouseInputs): PriceResult {
  const tier = tierFor(h.livingSqft);
  const lines: PriceLine[] = [];

  // Driveway and walkways (summer), scaled by the size the customer picked.
  const drivewayMult = h.driveway === "small" ? MODIFIER.drivewaySmall : h.driveway === "large" ? MODIFIER.drivewayLarge : 1;
  lines.push({
    key: "driveway",
    label: "Driveway and walkways, summer",
    detail: `${tier.drivewaySf.toLocaleString()} sq ft at $${RATE.concreteSf.toFixed(2)}${drivewayMult !== 1 ? `, ${h.driveway === "small" ? "20% less for a small driveway" : "25% more for a large or long one"}` : ""}`,
    amount: tier.drivewaySf * RATE.concreteSf * drivewayMult,
  });

  // Siding soft wash (spring)
  lines.push({
    key: "siding",
    label: "Siding soft wash, spring",
    detail: `${tier.sidingSf.toLocaleString()} sq ft at $${RATE.sidingSf.toFixed(2)}`,
    amount: tier.sidingSf * RATE.sidingSf,
  });

  // Roof soft wash (spring), more for wood shake or a steep pitch.
  const roofMult = h.roof === "shake-steep" ? MODIFIER.roofShakeOrSteep : 1;
  lines.push({
    key: "roof",
    label: "Roof soft wash, spring",
    detail: `${tier.roofSf.toLocaleString()} sq ft at $${RATE.roofSf.toFixed(2)}${roofMult !== 1 ? ", 25% more for wood shake or a steep pitch" : ""}`,
    amount: tier.roofSf * RATE.roofSf * roofMult,
  });

  // Gutters (fall). Rate steps up with stories; a steep roof uses the top rate.
  const gutterStories: Stories = h.roof === "shake-steep" ? 3 : h.stories;
  const gutterRate = RATE.gutterLf[gutterStories];
  lines.push({
    key: "gutters",
    label: "Gutters and downspouts, fall",
    detail: `${tier.gutterLf} linear ft at $${gutterRate.toFixed(2)} (${gutterStories === 3 ? "3 stories or steep" : `${gutterStories} ${gutterStories === 1 ? "story" : "stories"}`})`,
    amount: tier.gutterLf * gutterRate,
  });

  // Winter walkway and entry pass, at the concrete rate.
  lines.push({
    key: "winter",
    label: "Walkways, steps and entry, winter",
    detail: `${tier.winterWalkwaySf} sq ft at $${RATE.concreteSf.toFixed(2)}`,
    amount: tier.winterWalkwaySf * RATE.concreteSf,
  });

  // Exterior windows, four visits a year. The tier includes a cap; extras are
  // billed at the same rate.
  const windowsIncluded = Math.min(Math.max(0, h.windows), tier.windowsPerVisit);
  const windowsExtra = Math.max(0, h.windows - tier.windowsPerVisit);
  lines.push({
    key: "windows",
    label: `Exterior windows, ${WINDOW_VISITS_PER_YEAR} times a year`,
    detail: `${windowsIncluded} windows at $${RATE.windowEach} each, ${WINDOW_VISITS_PER_YEAR} visits`,
    amount: windowsIncluded * RATE.windowEach * WINDOW_VISITS_PER_YEAR,
  });
  if (windowsExtra > 0) {
    lines.push({
      key: "windows-extra",
      label: "Extra windows past the plan's count",
      detail: `${windowsExtra} more at $${RATE.windowEach} each, ${WINDOW_VISITS_PER_YEAR} visits`,
      amount: windowsExtra * RATE.windowEach * WINDOW_VISITS_PER_YEAR,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const accessMultiplier = h.access === "gated-tight" ? MODIFIER.accessGatedTight : h.access === "steep-ladder" ? MODIFIER.accessSteepLadder : 1;
  const alaCarteAnnual = subtotal * accessMultiplier;

  const memberMonthly = Math.max(MONTHLY_FLOOR, Math.ceil((alaCarteAnnual * (1 - MEMBER_MONTHLY_DISCOUNT)) / 12));
  const memberAnnual = memberMonthly * 12;
  const prepaidAnnual = Math.ceil(alaCarteAnnual * (1 - MEMBER_PREPAID_DISCOUNT));
  const prepaidMonthlyEquivalent = Math.ceil(prepaidAnnual / 12);

  return {
    tier,
    lines,
    subtotal,
    accessMultiplier,
    alaCarteAnnual,
    memberMonthly,
    memberAnnual,
    prepaidAnnual,
    prepaidMonthlyEquivalent,
    windowsIncluded,
    windowsExtra,
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

export function addOnPriceLabel(a: AddOn): string {
  if (a.list) {
    const m = memberAddOnPrice(a.list.amount);
    const shown = m < 1 ? `$${m.toFixed(2)}` : `$${m.toFixed(2).replace(/\.00$/, "")}`;
    return `From ${shown} ${a.list.unit === "each" ? "each" : `per ${a.list.unit}`}, priced at your first visit`;
  }
  return a.fromNote ?? "Priced at your first visit";
}

export { money };
