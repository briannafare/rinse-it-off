// Run: npx tsx scripts/check-one-time-price.mts  (one-time /book prices; fails loudly if a rule breaks)
import assert from "node:assert/strict";
import { quote, servicePrice, VISIT_MIN, FLOOR } from "../src/lib/one-time-estimate.ts";

const tigard = { sqft: 2247, stories: 2 as const, footprintSf: 1583, perimeterFt: 170 };
const c = { moss: "patchy" as const, windows: 10, driveway: "typical" as const };
// 10 windows never reads as the $250 visit minimum (Bri 2026-11-11)
assert.ok(servicePrice("windows", { sqft: 1500, stories: 1 }, c)! < 150);
const w = quote({ sqft: 1500, stories: 1 }, ["windows"], c);
assert.equal(w.minimumGap, VISIT_MIN - w.subtotal);
// thick moss costs more than patchy, patchy more than light, and never below the floor
const roof = (moss: "light" | "patchy" | "thick") => servicePrice("roof-moss", tigard, { ...c, moss })!;
assert.ok(roof("light") < roof("patchy") && roof("patchy") < roof("thick"));
assert.equal(servicePrice("roof-moss", { sqft: 600, stories: 1 }, { ...c, moss: "light" }), FLOOR["roof-moss"]);
// panel anchors: 2,000 sq ft-ish roof around $500 patchy, gutters near $1.50/ft
assert.ok(roof("patchy") >= 450 && roof("patchy") <= 600, String(roof("patchy")));
// a full house clears the minimum
assert.equal(quote(tigard, ["roof-moss", "gutters"], c).minimumGap, 0);
console.log("one-time prices ok", { roof: roof("patchy"), gutters: servicePrice("gutters", tigard, c), windows10: servicePrice("windows", { sqft: 1500, stories: 1 }, c) });
