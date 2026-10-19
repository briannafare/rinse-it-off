/** Fixed input vectors for the membership pricing engine. Runs before every
 *  build (see package.json "prebuild"): `node --experimental-strip-types src/app/plan/pricing.test.ts`.
 *  If a constant in pricing.ts changes on purpose, update the expected numbers here. */
import assert from "node:assert/strict";
import { handPriceReasons, priceHouse, scopeFor, type HouseInputs } from "./pricing.ts";

const base: HouseInputs = { address: "test", livingSqft: 1800, stories: 1, windows: 12, roof: "composition", driveway: "typical", access: "easy" };
const r2 = (n: number) => Math.round(n * 100) / 100;

const cases: { name: string; input: HouseInputs; expect: { coreAnnual: number; memberMonthly: number; prepaidAnnual: number; windowsAnnualValue: number; savedVsAlaCarte: number } }[] = [
  { name: "A basic 3-bed, 1 story, 12 windows", input: base, expect: { coreAnnual: 2832, memberMonthly: 189, prepaidAnnual: 2040, windowsAnnualValue: 2000, savedVsAlaCarte: 2996 } },
  { name: "3,100 sf, 3 stories, 40 windows", input: { ...base, livingSqft: 3100, stories: 3, windows: 40 }, expect: { coreAnnual: 6120, memberMonthly: 408, prepaidAnnual: 4407, windowsAnnualValue: 2000, savedVsAlaCarte: 3944 } },
  { name: "4,500 sf, 3 stories, 60 windows", input: { ...base, livingSqft: 4500, stories: 3, windows: 60 }, expect: { coreAnnual: 7084, memberMonthly: 473, prepaidAnnual: 5101, windowsAnnualValue: 2640, savedVsAlaCarte: 5128 } },
  { name: "2,600 sf, 2 stories, shake roof, large drive, gated", input: { ...base, livingSqft: 2600, stories: 2, windows: 20, roof: "shake-steep", driveway: "large", access: "gated-tight" }, expect: { coreAnnual: 3828.6, memberMonthly: 256, prepaidAnnual: 2757, windowsAnnualValue: 2000, savedVsAlaCarte: 3477 } },
  { name: "1,800 sf, 1 story, 20 windows (8 past the 12 included)", input: { ...base, windows: 20 }, expect: { coreAnnual: 3536, memberMonthly: 236, prepaidAnnual: 2546, windowsAnnualValue: 2000, savedVsAlaCarte: 3136 } },
  { name: "900 sf (floored at 1,200), small drive, steep access", input: { ...base, livingSqft: 900, windows: 6, driveway: "small", access: "steep-ladder" }, expect: { coreAnnual: 2838.2, memberMonthly: 190, prepaidAnnual: 2044, windowsAnnualValue: 2000, savedVsAlaCarte: 2774 } },
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
// Hand pricing (Bri 2026-10-19): the house that got about $300 a month gets no instant number.
assert.deepEqual(handPriceReasons({ ...base, livingSqft: 3000, stories: 3, windows: 25, access: "steep-ladder" }), ["3 or more stories", "a steep lot or hard ladder access"]);
assert.deepEqual(handPriceReasons({ ...base, windows: 31 }), ["more than 30 windows"]);
assert.deepEqual(handPriceReasons({ ...base, livingSqft: 4501, stories: 2 }), ["more than 4,500 sq ft"]);
assert.deepEqual(handPriceReasons({ ...base, livingSqft: 2600, stories: 2, windows: 30, access: "gated-tight" }), []);
assert.equal(Math.round(scopeFor(2000, 2).roofSf), 1200);
assert.equal(Math.round(scopeFor(2000, 2).sidingSf), 1667);
console.log(`pricing.test.ts: ${cases.length} vectors and the no-cliff sweep passed`);
