/**
 * Tiered standalone minimums — ported faithfully from the approved
 * rio_pricing_fix_export/server/routes.ts logic. Plain ESM (no TS) so both the
 * Next.js server route and scripts/check-pricing.mjs can import the SAME
 * function. Do not fork this logic anywhere else.
 *
 * Rules (approved business data — do not alter the numbers):
 *  - 0 billable services  -> add a $350 "Minimum service charge" line.
 *  - 1 billable service   -> floor it at its tier minimum:
 *        driveway   $500  (+ bundling note recommending an added service)
 *        commercial $750
 *        general    $350
 *  - 2+ billable services -> bundled job, NO minimum applied; totals as-is.
 * The floor never scales other items — it only raises the single line item.
 */

export const MINIMUM_FLOORS = { driveway: 500, commercial: 750, general: 350 };

export const DRIVEWAY_MINIMUM_NOTE =
  "This job is under our $500 standalone minimum for driveway/sidewalk-only work — recommend adding another service (house wash, windows, gutters) or coordinating with a nearby job.";

/**
 * @param {Array<{category: string, description: string, estimatedPrice: number,
 *   isAddon: boolean, addonFor?: string|null, minimumTier?: "driveway"|"commercial"|"general"}>} rawServices
 * @returns {{ services: typeof rawServices, pricingNote: string|null,
 *   applied: { tier: string, floor: number, originalPrice: number } | null }}
 */
export function applyTieredMinimums(rawServices) {
  const billable = (rawServices || []).filter((s) => (s.estimatedPrice || 0) > 0);
  let pricingNote = null;
  let applied = null;

  if (billable.length === 0) {
    billable.push({
      category: "Specialty",
      description: "Minimum service charge — mobilization, setup, and site visit",
      estimatedPrice: 350,
      isAddon: false,
      addonFor: null,
      minimumTier: "general",
    });
    applied = { tier: "general", floor: 350, originalPrice: 0 };
  } else if (billable.length === 1) {
    const tier = billable[0].minimumTier || "general";
    const floor = MINIMUM_FLOORS[tier] ?? MINIMUM_FLOORS.general;
    if (billable[0].estimatedPrice < floor) {
      applied = { tier, floor, originalPrice: billable[0].estimatedPrice };
      billable[0] = { ...billable[0], estimatedPrice: floor };
      if (tier === "driveway") {
        pricingNote = DRIVEWAY_MINIMUM_NOTE;
      }
    }
  }
  // 2+ billable services on one quote = bundled, no minimum applied.

  if (pricingNote) {
    billable.push({
      category: "Pricing Note",
      description: pricingNote,
      estimatedPrice: 0,
      isAddon: false,
      addonFor: null,
      minimumTier: "general",
    });
  }

  return { services: billable, pricingNote, applied };
}
