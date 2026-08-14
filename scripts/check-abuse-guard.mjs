#!/usr/bin/env node
/** Runnable check for the assessment-form abuse window.
 *  Run: node scripts/check-abuse-guard.mjs */

import assert from "node:assert/strict";
import { createWindow } from "../src/lib/abuse-window.mjs";

// 1) A normal visitor submitting once is neither flagged nor blocked.
{
  const record = createWindow();
  const v = record("1.2.3.4", 0);
  assert.deepEqual(v, { count: 1, flagged: false, blocked: false });
  console.log("PASS single submit is clean");
}

// 2) Thresholds are exclusive: flag on the 4th, block on the 13th.
{
  const record = createWindow();
  let v;
  for (let i = 0; i < 3; i++) v = record("1.2.3.4", i);
  assert.equal(v.flagged, false, "3 submits should not flag");
  v = record("1.2.3.4", 3);
  assert.equal(v.flagged, true, "4th submit should flag");
  assert.equal(v.blocked, false, "4th submit should still save");
  for (let i = 4; i < 12; i++) v = record("1.2.3.4", i);
  assert.equal(v.blocked, false, "12 submits should still save");
  v = record("1.2.3.4", 12);
  assert.deepEqual(v, { count: 13, flagged: true, blocked: true }, "13th submit blocks");
  console.log("PASS flags at >3, blocks at >12");
}

// 3) Hits outside the window are forgotten — a blocked IP recovers.
{
  const record = createWindow({ windowMs: 1000 });
  for (let i = 0; i < 20; i++) record("1.2.3.4", i);
  const v = record("1.2.3.4", 5000);
  assert.deepEqual(v, { count: 1, flagged: false, blocked: false });
  console.log("PASS window expiry resets the counter");
}

// 4) Counters are per-key — one abuser does not lock out everyone else.
{
  const record = createWindow();
  for (let i = 0; i < 20; i++) record("bad", i);
  assert.deepEqual(record("good", 20), { count: 1, flagged: false, blocked: false });
  console.log("PASS one abusive IP does not block other visitors");
}

console.log("\nAll abuse-guard checks passed.");
