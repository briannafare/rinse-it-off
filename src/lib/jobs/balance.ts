import "server-only";
import { del, get, list, put } from "@vercel/blob";
import { INVOICE_EMAIL_DEPOSIT, INVOICE_EMAIL_FULL, setInvoiceEmailTemplate } from "@/lib/ghl/invoiceEmail";

/** The other half of a deposit invoice (Bri 2026-11-21: "change it so it only sends when the crew lead
 *  specifies the job is complete"). The quote tool's invoice now bills the 50% deposit only and leaves one
 *  of these in Blob store "rinse-quote-files" at balances/<deposit invoice id>.json. Nothing about it reaches
 *  the client until the crew lead opens the job in /jobs and taps "Job's done: bill the balance". That makes
 *  a second GHL invoice for the rest, due that day, and sends it.
 *
 *  Why not one invoice with a payment schedule: GHL makes every installment carry a due date and emails
 *  "Invoice payment due" on it. The quote tool used the job date, so Mike got a payment-due email the morning
 *  of his job, before any work was done (INV-000633, 2026-11-20). */

export interface BalanceDue {
  depositInvoiceId: string;
  contactId: string;
  client: { name: string; email?: string; phone?: string; address: string };
  services: string[]; // line names from the quote, for the balance invoice's description
  total: number;
  deposit: number;
  balance: number;
  jobDate: string; // YYYY-MM-DD, the day the deposit holds
  quoteNumber: string;
  status: "waiting" | "billed";
  balanceInvoiceId?: string;
  billedAt?: number;
  billedBy?: string; // the crew lead who marked the job done
  createdAt: number;
  updatedAt: number;
}

const GHL = "https://services.leadconnectorhq.com";
const ID = /^[A-Za-z0-9]{10,40}$/;
const path = (id: string) => `balances/${id}.json`;

export const halfOf = (total: number) => Math.round(total * 50) / 100;

export async function readBalance(depositInvoiceId: string): Promise<BalanceDue | null> {
  if (!ID.test(depositInvoiceId)) return null;
  const r = await get(path(depositInvoiceId), { access: "public", useCache: false }).catch(() => null);
  return r?.stream ? ((await new Response(r.stream).json()) as BalanceDue) : null;
}

export async function writeBalance(b: BalanceDue): Promise<void> {
  await put(path(b.depositInvoiceId), JSON.stringify({ ...b, updatedAt: Date.now() }), {
    access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60,
  });
}

/** Forget a waiting balance (its quote was re-sent as a no-deposit invoice). Never call it on a billed one. */
export async function dropBalance(depositInvoiceId: string): Promise<void> {
  if (ID.test(depositInvoiceId)) await del(path(depositInvoiceId));
}

/** Balances not billed yet. ponytail: reads every file; fine for a few hundred jobs. */
export async function waitingBalances(): Promise<BalanceDue[]> {
  const ids: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "balances/", limit: 1000, cursor });
    for (const b of page.blobs) {
      const m = b.pathname.match(/^balances\/([A-Za-z0-9]+)\.json$/);
      if (m) ids.push(m[1]);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const rows = await Promise.all(ids.map((id) => readBalance(id).catch(() => null)));
  return rows.filter((b): b is BalanceDue => !!b && b.status === "waiting").sort((a, b) => a.jobDate.localeCompare(b.jobDate));
}

const money = (n: number) => `$${n.toFixed(2)}`;

/** Makes the balance invoice in GHL, due today, and texts it (email only when there is no phone) from `senderUserId` (the crew lead,
 *  so the message is signed with their name). Returns the new invoice id, or an error a person can act on. */
export async function sendBalanceInvoice(
  b: BalanceDue,
  senderUserId: string,
  today: string,
): Promise<{ ok: true; invoiceId: string; sent: boolean; problem?: string } | { ok: false; error: string }> {
  const key = process.env.GHL_API_KEY, loc = process.env.GHL_LOCATION_ID;
  if (!key || !loc) return { ok: false, error: "GHL isn't set up on the server." };
  const headers = { Authorization: `Bearer ${key}`, Version: "2021-07-28", "Content-Type": "application/json", Accept: "application/json" };
  const sentTo: Record<string, string[]> = {};
  if (b.client.email) sentTo.email = [b.client.email];
  if (b.client.phone) sentTo.phoneNo = [b.client.phone];
  if (!Object.keys(sentTo).length) return { ok: false, error: "The client has no email or phone on the quote." };

  const body = {
    altId: loc,
    altType: "location",
    name: `BAL : ${b.client.name}`,
    title: "INVOICE",
    currency: "USD",
    liveMode: true,
    issueDate: today,
    dueDate: today,
    businessDetails: { name: "Rinse It Off — Fresh Rinse LLC", website: "rinseitoff.com" },
    contactDetails: { id: b.contactId, name: b.client.name, email: b.client.email || undefined, phoneNo: b.client.phone || undefined },
    items: [{
      name: "Balance for the finished job",
      description: `${b.services.join(", ")}. Job total ${money(b.total)}, deposit paid ${money(b.deposit)}.`.slice(0, 500),
      currency: "USD",
      qty: 1,
      amount: b.balance,
      type: "one_time",
    }],
    discount: { type: "percentage", value: 0 },
    termsNotes: "<ul><li>The job is done. This is the other half of the total.</li><li>Not responsible for pre-existing damage</li></ul>",
    sentTo,
  };
  const made = await fetch(`${GHL}/invoices/`, { method: "POST", headers, body: JSON.stringify(body), cache: "no-store" });
  const data = (await made.json().catch(() => ({}))) as { _id?: string; id?: string; message?: unknown };
  const invoiceId = data._id || data.id || "";
  if (!made.ok || !invoiceId) return { ok: false, error: `GHL wouldn't make the balance invoice (${made.status}).` };

  // GHL has one location-wide invoice email and neither copy fits a balance: the default asks for a 50%
  // deposit, and the paid-in-full one says "The full amount is due in one payment, with no deposit" (read on
  // the Nov 24 probe sends). So the balance goes by text, GHL's plain invoice text signed by the lead. Only a
  // client with no phone gets the email, on the paid-in-full copy, and the default is put back after.
  // TODO(Bri): a "balance due" email template in GHL would let this email everyone.
  const action = b.client.phone ? "sms" : "email";
  const swapEmail = action === "email";
  if (swapEmail && !(await setInvoiceEmailTemplate(INVOICE_EMAIL_FULL).catch(() => false))) {
    return { ok: true, invoiceId, sent: false, problem: "The invoice is in GHL but didn't send: couldn't switch to the paid-in-full email. Send it from GHL." };
  }
  let send: Response;
  try {
    send = await fetch(`${GHL}/invoices/${invoiceId}/send`, {
      method: "POST", headers, cache: "no-store",
      body: JSON.stringify({ altId: loc, altType: "location", userId: senderUserId, action, liveMode: true }),
    });
  } finally {
    if (swapEmail && !(await setInvoiceEmailTemplate(INVOICE_EMAIL_DEPOSIT).catch(() => false))) {
      console.error("Invoice email template NOT restored to the 50% deposit default");
    }
  }
  return send.ok
    ? { ok: true, invoiceId, sent: true }
    : { ok: true, invoiceId, sent: false, problem: `The invoice is in GHL but didn't send (${send.status}). Send it from GHL.` };
}
