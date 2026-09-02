/** Fixed input vectors for the membership pricing engine. Runs before every
 *  build (see package.json "prebuild"): `node --experimental-strip-types src/app/plan/pricing.test.ts`.
 *  If a constant in pricing.ts changes on purpose, update the expected numbers here. */
import assert from "node:assert/strict";
import { priceHouse, scopeFor, type HouseInputs } from "./pricing.ts";

const base: HouseInputs = { address: "test", livingSqft: 1800, stories: 1, windows: 12, roof: "composition", driveway: "typical", access: "easy" };
const r2 = (n: number) => Math.round(n * 100) / 100;

const cases: { name: string; input: HouseInputs; expect: { coreAnnual: number; memberMonthly: number; prepaidAnnual: number; windowsAnnualValue: number; savedVsAlaCarte: number } }[] = [
  { name: "A basic 3-bed, 1 story, 12 windows", input: base, expect: { coreAnnual: 2058.44, memberMonthly: 189, prepaidAnnual: 1544, windowsAnnualValue: 2000, savedVsAlaCarte: 1790 } },
  { name: "3,100 sf, 3 stories, 40 windows", input: { ...base, livingSqft: 3100, stories: 3, windows: 40 }, expect: { coreAnnual: 2562.85, memberMonthly: 189, prepaidAnnual: 1923, windowsAnnualValue: 3520, savedVsAlaCarte: 3815 } },
  { name: "4,500 sf, 3 stories, 60 windows", input: { ...base, livingSqft: 4500, stories: 3, windows: 60 }, expect: { coreAnnual: 3269.55, memberMonthly: 218, prepaidAnnual: 2453, windowsAnnualValue: 5280, savedVsAlaCarte: 5934 } },
  { name: "2,600 sf, 2 stories, shake roof, large drive, gated", input: { ...base, livingSqft: 2600, stories: 2, windows: 20, roof: "shake-steep", driveway: "large", access: "gated-tight" }, expect: { coreAnnual: 2684.1, memberMonthly: 189, prepaidAnnual: 2014, windowsAnnualValue: 2000, savedVsAlaCarte: 2416 } },
  { name: "900 sf (floored at 1,200), small drive, steep access", input: { ...base, livingSqft: 900, windows: 6, driveway: "small", access: "steep-ladder" }, expect: { coreAnnual: 1749.79, memberMonthly: 189, prepaidAnnual: 1313, windowsAnnualValue: 2000, savedVsAlaCarte: 1482 } },
];

for (const c of cases) {
  const p = priceHouse(c.input);
  const got = { coreAnnual: r2(p.coreAnnual), memberMonthly: p.memberMonthly, prepaidAnnual: p.prepaidAnnual, windowsAnnualValue: p.windowsAnnualValue, savedVsAlaCarte: p.savedVsAlaCarte };
  assert.deepEqual(got, c.expect, `${c.name}: got ${JSON.stringify(got)}`);
  // Same inputs, same output, every time.
  assert.equal(JSON.stringify(priceHouse({ ...c.input })), JSON.stringify(p), `${c.name}: not deterministic`);
}
// No cliffs: one square foot never moves the core price by more than a dollar, at any story count.
for (const sf of [1999, 2000, 2001, 3199, 3200, 3201, 4499, 4500, 4501]) {
  for (const stories of [1, 2, 3] as const) {
    const a = priceHouse({ ...base, livingSqft: sf, stories }).coreAnnual;
    const b = priceHouse({ ...base, livingSqft: sf + 1, stories }).coreAnnual;
    assert.ok(Math.abs(a - b) < 1, `cliff at ${sf} (${stories} stories): ${a} vs ${b}`);
  }
}
assert.equal(Math.round(scopeFor(2000, 2).roofSf), 1200);
assert.equal(Math.round(scopeFor(4500, 2).sidingSf), 2700);
console.log(`pricing.test.ts: ${cases.length} vectors and the no-cliff sweep passed`);
