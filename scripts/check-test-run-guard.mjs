#!/usr/bin/env node
/** Runnable check for the test-run guard.
 *  The one rule: a dry run or a test email address must be tagged `test-run`
 *  and must never open an opportunity — and a real customer must never be
 *  mistaken for a test.
 *  Run: node scripts/check-test-run-guard.mjs */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TEST_RUN_TAG, isTestEmail, testRunPlan } from "../src/lib/test-run.mjs";

const src = (p) => readFileSync(new URL(`../src/app/${p}`, import.meta.url), "utf8");

// 1) The two ways in: dry run, or a test address. Both tag, neither opens a card.
{
  for (const opts of [
    { dryRun: true, email: "kenn@rinseitoff.com" },
    { dryRun: false, email: "test@example.com" },
    { dryRun: false, email: "Jane+Test@Gmail.com" },
  ]) {
    const plan = testRunPlan({ ...opts, tags: ["plan-quote", "lead-res"] });
    assert.equal(plan.isTest, true, `should be a test run: ${JSON.stringify(opts)}`);
    assert.ok(plan.tags.includes(TEST_RUN_TAG), "test run must carry the test-run tag");
    assert.equal(plan.createOpportunity, false, "test run must not open an opportunity");
    assert.ok(plan.reason, "test run must say why");
  }
  console.log("PASS dry run and test emails are tagged and open no opportunity");
}

// 2) A real lead is untouched — same tags, opportunity still opens. A false
//    positive here would make a paying customer auto-deletable.
{
  const tags = ["plan-quote", "lead-res", "src-web"];
  for (const email of [
    "jane.smith@gmail.com",
    "tester@example-homes.com",
    "protest@outlook.com",
    "testa.morgan@yahoo.com",
    "contact@besttest-realty.com",
    "",
  ]) {
    const plan = testRunPlan({ dryRun: false, email, tags });
    assert.equal(plan.isTest, false, `real lead treated as test: ${email}`);
    assert.deepEqual(plan.tags, tags, `tags changed for a real lead: ${email}`);
    assert.equal(plan.createOpportunity, true, `real lead lost its opportunity: ${email}`);
  }
  console.log("PASS real leads keep their tags and their opportunity");
}

// 3) The address patterns themselves.
{
  for (const e of ["test@example.com", "test1@gmail.com", "test-plan@rinseitoff.com", "jane+test@gmail.com", "jane+test2@gmail.com", "a@foo.test", "b@my.local", "c@mailinator.com", "d@example.org"]) {
    assert.equal(isTestEmail(e), true, `should be a test address: ${e}`);
  }
  for (const e of ["tester@gmail.com", "testament@gmail.com", "jane@testudo.com", "jane+testimonial@gmail.com", "notanemail", "@gmail.com"]) {
    assert.equal(isTestEmail(e), false, `should NOT be a test address: ${e}`);
  }
  console.log("PASS test-address matching is narrow");
}

// 4) The guard is still wired into every submit path that writes a contact and
//    an opportunity. Removing it from any of them fails the build.
{
  for (const [file, oppMarker] of [
    ["plan/actions.ts", "!testRun.createOpportunity"],
    ["assessment/actions.ts", "!testRun.createOpportunity"],
    ["quote/actions.ts", "!testRun.createOpportunity"],
  ]) {
    const body = src(file);
    assert.ok(/from "@\/lib\/test-run\.mjs"/.test(body), `${file} no longer imports the test-run guard`);
    assert.ok(/testRunPlan\(\{/.test(body), `${file} no longer calls testRunPlan`);
    assert.ok(body.includes("testRun.tags"), `${file} sends its own tag list again — send testRun.tags`);
    assert.ok(body.includes(oppMarker), `${file} opens an opportunity without checking ${oppMarker}`);
  }
  console.log("PASS plan, assessment and quote all route through the guard");
}

// 5) /plan passes the dry-run flag in, so a preview can never open a card.
{
  const plan = src("plan/actions.ts");
  assert.ok(
    /testRunPlan\(\{ dryRun: DRY_RUN, email, tags: baseTags \}\)/.test(plan),
    "/plan must pass DRY_RUN and the submitted email into the guard",
  );
  console.log("PASS /plan feeds DRY_RUN into the guard");
}

console.log("\nAll test-run guard checks passed.");
