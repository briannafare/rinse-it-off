import "server-only";

/** GHL sends every invoice with ONE location-wide email template and has no per-invoice choice or if/else in
 *  it (tested 2026-11-24). Default = the 50% deposit email. Any invoice that isn't a deposit request (a
 *  no-deposit quote, or the balance the crew lead bills after the job) swaps in the paid-in-full copy for
 *  its send, then puts the default back. ponytail: the swap is location-wide for ~2 s, so two invoices sent
 *  in the same seconds could get each other's email. Fine for a two-person crew. */
export const INVOICE_EMAIL_DEPOSIT = "6a0e2ade68d54c25680b8733"; // "Invoice Payment Request"
export const INVOICE_EMAIL_FULL = "6b0675e49e8fbeae46132e72"; // "Invoice Payment Request — Paid in Full"

const GHL = "https://services.leadconnectorhq.com";

/** Point GHL's "invoice sent" email at a template. Returns false if it could not. */
export async function setInvoiceEmailTemplate(templateId: string): Promise<boolean> {
  const key = process.env.GHL_API_KEY, loc = process.env.GHL_LOCATION_ID;
  if (!key || !loc) return false;
  const headers = { Authorization: `Bearer ${key}`, Version: "2021-07-28", "Content-Type": "application/json" };
  const cur = await fetch(`${GHL}/invoices/settings?altId=${loc}&altType=location`, { headers, cache: "no-store" });
  if (!cur.ok) return false;
  const { customNotification } = (await cur.json()) as { customNotification: Record<string, { defaultEmailTemplateId?: string }> };
  if (!customNotification?.customerSendInvoice) return false;
  if (customNotification.customerSendInvoice.defaultEmailTemplateId === templateId) return true;
  customNotification.customerSendInvoice.defaultEmailTemplateId = templateId;
  const res = await fetch(`${GHL}/invoices/settings`, {
    method: "POST",
    headers,
    cache: "no-store",
    body: JSON.stringify({ altId: loc, altType: "location", customNotification }),
  });
  return res.ok;
}
