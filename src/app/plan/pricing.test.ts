/** Fixed input vectors for the membership pricing engine. Runs before every
 *  build (see package.json "prebuild"): `node --experimental-strip-types src/app/plan/pricing.test.ts`.
 *  If a constant in pricing.ts changes on purpose, update the expected numbers here. */
import assert from "node:assert/strict";
import { handPriceReasons, priceHouse, scopeFor, type HouseInputs } from "./pricing.ts";

const base: HouseInputs = { address: "test", livingSqft: 1800, stories: 1, windows: 12, roof: "composition", driveway: "typical", slope: "flat", sides: "all", parking: "close" };
const r2 = (n: number) => Math.round(n * 100) / 100;

const cases: { name: string; input: HouseInputs; expect: { coreAnnual: number; memberMonthly: number; prepaidAnnual: number; windowsAnnualValue: number; savedVsAlaCarte: number } }[] = [
  { name: "A basic 3-bed, 1 story, 12 windows", input: base, expect: { coreAnnual: 2832, memberMonthly: 189, prepaidAnnual: 2040, windowsAnnualValue: 2000, savedVsAlaCarte: 2996 } },
  { name: "3,100 sf, 3 stories, 40 windows", input: { ...base, livingSqft: 3100, stories: 3, windows: 40 }, expect: { coreAnnual: 7784.5, memberMonthly: 519, prepaidAnnual: 5605, windowsAnnualValue: 2000, savedVsAlaCarte: 4276 } },
  { name: "4,500 sf, 3 stories, 60 windows", input: { ...base, livingSqft: 4500, stories: 3, windows: 60 }, expect: { coreAnnual: 9758.01, memberMonthly: 651, prepaidAnnual: 7026, windowsAnnualValue: 2640, savedVsAlaCarte: 5666 } },
  { name: "2,600 sf, 2 stories, shake roof, large drive, tight side yard", input: { ...base, livingSqft: 2600, stories: 2, windows: 20, roof: "shake-steep", driveway: "large", sides: "most" }, expect: { coreAnnual: 4414.51, memberMonthly: 295, prepaidAnnual: 3179, windowsAnnualValue: 2000, savedVsAlaCarte: 3595 } },
  { name: "1,800 sf, 1 story, 20 windows (8 past the 12 included)", input: { ...base, windows: 20 }, expect: { coreAnnual: 3536, memberMonthly: 236, prepaidAnnual: 2546, windowsAnnualValue: 2000, savedVsAlaCarte: 3136 } },
  { name: "900 sf (floored at 1,200), small drive, steep lot", input: { ...base, livingSqft: 900, windows: 6, driveway: "small", slope: "steep" }, expect: { coreAnnual: 3072.38, memberMonthly: 205, prepaidAnnual: 2213, windowsAnnualValue: 2000, savedVsAlaCarte: 2828 } },
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
  for (const stories of [1, 2, 3, 4] as const) {
    const a = priceHouse({ ...base, livingSqft: sf, stories }).coreAnnual;
    const b = priceHouse({ ...base, livingSqft: sf + 1, stories }).coreAnnual;
    assert.ok(Math.abs(a - b) < 1, `cliff at ${sf} (${stories} stories): ${a} vs ${b}`);
  }
}
// Hand pricing (Bri 2026-10-19): the 4-story steep house with one open side and a tiny driveway gets no instant
// number, and neither does the same house at 3 stories.
const bri: HouseInputs = { ...base, livingSqft: 3000, stories: 4, windows: 25, slope: "steep", sides: "one-two", parking: "far" };
assert.deepEqual(handPriceReasons(bri), ["4 or more stories"]);
assert.equal(handPriceReasons({ ...bri, stories: 3 }).length, 1);
// The hybrid: an easy single-story stays at the floor, and every difficulty step only ever raises the price.
assert.equal(priceHouse(base).memberMonthly, 189);
const ladder: Partial<HouseInputs>[] = [{ stories: 2 }, { slope: "some" }, { sides: "most" }, { slope: "steep" }, { parking: "far" }, { stories: 3 }];
let acc: HouseInputs = { ...base, livingSqft: 2400, windows: 20 }, prev = priceHouse(acc).coreAnnual;
for (const step of ladder) { acc = { ...acc, ...step }; const now = priceHouse(acc).coreAnnual; assert.ok(now > prev, `difficulty step ${JSON.stringify(step)} did not raise the price`); prev = now; }
assert.deepEqual(handPriceReasons({ ...base, windows: 31 }), ["more than 30 windows"]);
assert.deepEqual(handPriceReasons({ ...base, livingSqft: 4501, stories: 2 }), ["more than 4,500 sq ft"]);
assert.deepEqual(handPriceReasons({ ...base, livingSqft: 2600, stories: 2, windows: 30, sides: "most" }), []);
assert.equal(Math.round(scopeFor(2000, 2).roofSf), 1200);
assert.equal(Math.round(scopeFor(2000, 2).sidingSf), 1667);
console.log(`pricing.test.ts: ${cases.length} vectors and the no-cliff sweep passed`);
