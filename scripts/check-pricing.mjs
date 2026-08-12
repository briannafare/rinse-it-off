#!/usr/bin/env node
/** Runnable check for the tiered-minimums pricing logic used by /quote.
 *  Asserts the exact behavior ported from rio_pricing_fix_export/server/routes.ts.
 *  Run: node scripts/check-pricing.mjs */

import assert from "node:assert/strict";
import { applyTieredMinimums, DRIVEWAY_MINIMUM_NOTE } from "../src/lib/quote/minimums.mjs";

const svc = (tier, price, extra = {}) => ({
  category: "Surface Cleaning",
  description: `${tier} test item`,
  estimatedPrice: price,
  isAddon: false,
  addonFor: null,
  minimumTier: tier,
  ...extra,
});

// 1) Driveway-only $200 -> floored to $500 + bundling note appended.
{
  const { services, pricingNote, applied } = applyTieredMinimums([svc("driveway", 200)]);
  assert.equal(services[0].estimatedPrice, 500, "driveway-only $200 should floor to $500");
  assert.equal(pricingNote, DRIVEWAY_MINIMUM_NOTE, "driveway floor must carry the bundling note");
  const noteItem = services.find((s) => s.category === "Pricing Note");
  assert.ok(noteItem, "a $0 Pricing Note line should be appended");
  assert.equal(noteItem.estimatedPrice, 0);
  assert.deepEqual(applied, { tier: "driveway", floor: 500, originalPrice: 200 });
  console.log("PASS driveway-only $200 -> $500 + note");
}

// 2) Commercial-only $400 -> floored to $750, no note.
{
  const { services, pricingNote } = applyTieredMinimums([svc("commercial", 400)]);
  assert.equal(services[0].estimatedPrice, 750, "commercial-only $400 should floor to $750");
  assert.equal(pricingNote, null, "commercial floor carries no note");
  assert.equal(services.length, 1);
  console.log("PASS commercial-only $400 -> $750");
}

// 3) General-only $200 -> floored to $350, no note.
{
  const { services, pricingNote } = applyTieredMinimums([svc("general", 200)]);
  assert.equal(services[0].estimatedPrice, 350, "general-only $200 should floor to $350");
  assert.equal(pricingNote, null);
  assert.equal(services.length, 1);
  console.log("PASS general-only $200 -> $350");
}

// 4) Two services totalling $600 -> bundled, NO minimum override.
{
  const input = [svc("driveway", 200), svc("general", 400)];
  const { services, pricingNote, applied } = applyTieredMinimums(input);
  assert.equal(services[0].estimatedPrice, 200, "bundled jobs keep item prices as-is");
  assert.equal(services[1].estimatedPrice, 400, "bundled jobs keep item prices as-is");
  assert.equal(services.reduce((s, x) => s + x.estimatedPrice, 0), 600, "two services $600 stays $600");
  assert.equal(pricingNote, null);
  assert.equal(applied, null);
  console.log("PASS two services $600 -> $600 (no minimum)");
}

// 5) No billable services -> $350 minimum service charge line.
{
  const { services } = applyTieredMinimums([]);
  assert.equal(services.length, 1);
  assert.equal(services[0].estimatedPrice, 350, "empty quote gets the $350 minimum charge");
  console.log("PASS zero services -> $350 minimum service charge");
}

// 6) Floor at-or-above threshold is untouched.
{
  const { services, applied } = applyTieredMinimums([svc("driveway", 500)]);
  assert.equal(services[0].estimatedPrice, 500, "a $500 driveway job is not modified");
  assert.equal(applied, null);
  console.log("PASS driveway-only $500 -> unchanged");
}

console.log("\nAll pricing checks passed.");
