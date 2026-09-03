/** Is this submission a test, and what may it write to GoHighLevel?
 *
 *  Every /plan submission upserts a real GHL contact and opens a real
 *  opportunity worth the membership year — PLAN_DRY_RUN never stopped that, it
 *  only suppressed the invoice, the deposit email, the booking and the
 *  checkout. So previews and hand-typed test rows piled up in the live pipeline
 *  (a phantom $4,351 "Yearly membership" card was deleted by hand 2026-09-02).
 *
 *  Two rules, and nothing else: a test run is TAGGED so a purge can find it
 *  later, and it opens NO opportunity so it never lands in the pipeline or the
 *  forecast. The contact itself is still written — the submit path needs an id
 *  to keep working, and the tag makes it disposable.
 *
 *  Kept pure and separate so one runnable check can prove the guard is still
 *  wired in: node scripts/check-test-run-guard.mjs */

export const TEST_RUN_TAG = "test-run";

/** Addresses a real customer does not have. Deliberately narrow: this decides
 *  whether a row becomes auto-deletable, so a false positive throws away a
 *  paying lead. Anything unrecognised is treated as real. */
export function isTestEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at < 1) return false;
  const local = e.slice(0, at);
  const domain = e.slice(at + 1);
  // Reserved-by-RFC and throwaway domains.
  if (/(^|\.)(example|test|invalid|localhost|local)$/.test(domain)) return true;
  if (/^(mailinator\.com|example\.(com|org|net)|test\.com|yopmail\.com|10minutemail\.com)$/.test(domain)) return true;
  // Plus-addressing used as a test tag: jane+test@gmail.com, jane+test3@…
  if (/\+test\d*$/.test(local)) return true;
  // Local part that is the word "test", alone or with a separator/number after
  // it: test@, test1@, test-plan@, test.run@. NOT "tester", "testa", "protest".
  if (/^test\d*([._+-]|$)/.test(local)) return true;
  return false;
}

/** @returns {{isTest: boolean, reason?: string, tags: string[], createOpportunity: boolean}}
 *  `tags` is the caller's tag list with the test tag appended when it applies. */
export function testRunPlan({ dryRun, email, tags = [] }) {
  const reason = dryRun ? "dry run" : isTestEmail(email) ? "test email address" : undefined;
  if (!reason) return { isTest: false, tags, createOpportunity: true };
  return {
    isTest: true,
    reason,
    tags: tags.includes(TEST_RUN_TAG) ? tags : [...tags, TEST_RUN_TAG],
    createOpportunity: false,
  };
}
