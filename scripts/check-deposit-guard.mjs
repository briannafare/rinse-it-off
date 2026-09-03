#!/usr/bin/env node
/** Runnable check for the /plan deposit guard.
 *  The one rule: a dry run must never hand back a live payment URL, and must
 *  never write membership-deposit-sent to a real GHL contact.
 *  Run: node scripts/check-deposit-guard.mjs */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { depositCheckoutPlan } from "../src/lib/deposit-checkout.mjs";

const actions = readFileSync(new URL("../src/app/plan/actions.ts", import.meta.url), "utf8");
const defaultOf = (name) => {
  const m = new RegExp(`const ${name} = process\\.env\\.[A-Z_]+ \\|\\| "([^"]+)"`).exec(actions);
  assert.ok(m, `could not read the ${name} default out of actions.ts`);
  return m[1];
};
// The real production values, read from source so this check can't drift.
const base = defaultOf("DEPOSIT_LINK_BASE");
const id = defaultOf("DEPOSIT_LINK_ID");
const customer = { email: "jane@example.com", name: "Jane Smith", phone: "+15035550100" };

// 1) Dry run: no URL at all, and nothing that could be opened or charged.
{
  const plan = depositCheckoutPlan({ dryRun: true, base, id, ...customer });
  assert.equal(plan.ok, false, "dry run must not report a usable checkout");
  assert.equal(plan.url, undefined, "dry run must return no URL");
  assert.equal(plan.tag, false, "dry run must not tag the contact");
  assert.ok(plan.error, "dry run must say why the checkout is off");
  const blob = JSON.stringify(plan);
  assert.ok(!/links\.rinseitoff\.com/.test(blob), "dry run leaked a live links.rinseitoff.com URL");
  assert.ok(!/payment-link/.test(blob), "dry run leaked a payment-link path");
  assert.ok(!blob.includes(id), "dry run leaked the live payment-link id");
  console.log("PASS dry run returns no live URL and no tag");
}

// 2) Production is byte-identical to what shipped before the guard.
{
  const plan = depositCheckoutPlan({ dryRun: false, base, id, ...customer });
  assert.equal(plan.ok, true);
  assert.equal(plan.tag, true, "production still tags membership-deposit-sent");
  assert.equal(
    plan.url,
    `${base}/${id}?email=jane%40example.com&name=Jane+Smith&phone=%2B15035550100`,
    "production checkout URL changed",
  );
  console.log("PASS production URL and tag unchanged");
}

// 3) Missing contact details drop out rather than becoming empty params.
{
  const plan = depositCheckoutPlan({ dryRun: false, base, id, email: "", name: "Jane", phone: undefined });
  assert.equal(plan.url, `${base}/${id}?name=Jane`);
  console.log("PASS blank fields are omitted from the checkout URL");
}

// 4) The server action can only get a URL through the guard — no second path.
{
  const body = /export async function depositCheckout\([\s\S]*?\n}\n/.exec(actions)?.[0];
  assert.ok(body, "could not find depositCheckout in actions.ts");
  assert.ok(
    !/DEPOSIT_LINK_BASE\}\//.test(body),
    "depositCheckout builds a payment URL itself again — route it through depositCheckoutPlan",
  );
  assert.ok(/plan\.tag/.test(body), "depositCheckout tags the contact without checking plan.tag");
  console.log("PASS depositCheckout has no second URL path");
}

// 5) Server and client agree on when a dry run is on, so the disabled UI and
//    the refused action can never disagree.
{
  const page = readFileSync(new URL("../src/app/plan/page.tsx", import.meta.url), "utf8");
  const expr = /process\.env\.PLAN_DRY_RUN \? process\.env\.PLAN_DRY_RUN !== "false" : process\.env\.VERCEL_ENV !== "production"/;
  assert.ok(expr.test(actions), "actions.ts dry-run test changed");
  assert.ok(expr.test(page), "page.tsx dry-run test changed");
  console.log("PASS server and client compute DRY_RUN the same way");
}

console.log("\nAll deposit-guard checks passed.");
