/** Where the Reserve step sends a customer to pay the $99 membership deposit.
 *
 *  Split out of the server action and kept pure so one runnable check can prove
 *  the thing that actually matters: a dry run must never hand back a live
 *  payment URL, and must never claim the contact was invited to pay. GHL has no
 *  per-link test URL — test vs live is a location-wide payment-provider toggle
 *  (probed 2026-09-02), and flipping the real business into test mode to make a
 *  preview safe is worse than not showing a checkout at all. So a dry run shows
 *  nothing payable.
 *
 *  Run the check: node scripts/check-deposit-guard.mjs */

export const DRY_RUN_ERROR =
  "Deposit checkout is off on this preview. No card is taken and nothing is written to the contact.";

/** @returns {{ok: boolean, tag: boolean, url?: string, error?: string}}
 *  `tag` is whether the caller may write membership-deposit-sent. */
export function depositCheckoutPlan({ dryRun, base, id, email, name, phone }) {
  if (dryRun) return { ok: false, tag: false, error: DRY_RUN_ERROR };
  const q = new URLSearchParams();
  if (email) q.set("email", String(email).slice(0, 160));
  if (name) q.set("name", String(name).slice(0, 120));
  if (phone) q.set("phone", phone);
  return { ok: true, tag: true, url: `${base}/${id}?${q.toString()}` };
}
