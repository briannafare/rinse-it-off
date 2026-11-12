// Run: npx tsx scripts/check-one-time-price.mts  (one-time /book prices; fails loudly if a rule breaks)
import assert from "node:assert/strict";
import { quote, servicePrice, VISIT_MIN, FLOOR, SAME_VISIT_OFF } from "../src/lib/one-time-estimate.ts";

const two = { sqft: 2250, stories: 2 as const }, one = { sqft: 1500, stories: 1 as const };
const c = { moss: "patchy" as const, windows: 20, driveway: "typical" as const };
const p = (k: Parameters<typeof servicePrice>[0], h: typeof two | typeof one, x = c) => servicePrice(k, h, x)!;
const near = (v: number, lo: number, hi: number, what: string) => assert.ok(v >= lo && v <= hi, `${what} ${v} outside ${lo}-${hi}`);
// Anchors, 2026-11-11: Bri's crew times + published Portland-area prices + SuperMe panel grid
near(p("roof-moss", two), 695, 750, "two-story roof");
near(p("roof-moss", one), 600, 650, "one-story roof");
near(p("house-wash", two), 550, 600, "two-story wash");
assert.equal(p("house-wash", one), FLOOR["house-wash"]);
near(p("gutters", two), 325, 345, "two-story gutters");
near(p("gutters", one), 280, 300, "one-story gutters");
// thick moss costs more than patchy, patchy more than light, never below the floor
const roof = (moss: "light" | "patchy" | "thick") => p("roof-moss", two, { ...c, moss });
assert.ok(roof("light") < roof("patchy") && roof("patchy") < roof("thick"));
assert.equal(servicePrice("roof-moss", { sqft: 600, stories: 1 }, { ...c, moss: "light" }), FLOOR["roof-moss"]);
// a small job alone pays the visit minimum; two services get the same-visit savings once
const w = quote(one, ["windows"], { ...c, windows: 13 });
assert.equal(w.total, VISIT_MIN);
const rw = quote(two, ["roof-moss", "house-wash"], c);
assert.equal(rw.total, rw.subtotal - SAME_VISIT_OFF);
// the roof job already flushes gutters: a full clean on top is half price
const rg = quote(two, ["roof-moss", "gutters"], c);
assert.equal(rg.lines.find((l) => l.key === "gutters")!.price, Math.round(p("gutters", two) / 2 / 5) * 5);
console.log("one-time prices ok", { roof2: roof("patchy"), wash2: p("house-wash", two), gutters2: p("gutters", two), roofPlusGutters2: rg.total, windows13alone: w.total });
