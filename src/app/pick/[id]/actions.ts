"use server";

import { pushQuoteToGhl } from "@/lib/quote/ghl-send";
import { priceSelection } from "@/lib/quote/bundle";
import { readOffer, writeOffer } from "@/lib/quote/offers";
import { SITE_URL } from "@/lib/seo";

/** The client's "book these" on /pick/<id>. Open to anyone holding the link (the 12-char id is the key).
 *  Prices are never taken from the browser: only the ids of the lines they checked, re-priced here
 *  with the same rules the page showed. Then the estimate for exactly those services goes out through
 *  the same GHL path as the /quote tool (50% deposit on acceptance). One booking per link. */
export async function bookPicks(
  id: string,
  ids: string[],
): Promise<{ ok: true; total: number; pct: number; sent: boolean } | { ok: false; error: string }> {
  const offer = await readOffer(id);
  if (!offer) return { ok: false, error: "We couldn't find this quote. Text us at (971) 626-4146." };
  if (offer.status === "accepted" && offer.accepted) {
    return { ok: true, total: offer.accepted.total, pct: offer.accepted.pct, sent: true };
  }
  const known = new Set(offer.lines.map((l) => l.id));
  const picked = Array.isArray(ids) ? ids.filter((x) => typeof x === "string" && known.has(x)) : [];
  const r = priceSelection(offer.lines, picked);
  if (!r.lines.length) return { ok: false, error: "Pick at least one service." };

  const lineItems = [
    ...r.lines.map((l) => ({ name: l.name, description: l.category, qty: 1, unitPrice: l.price, isAddon: false })),
    ...(r.minimumAdd > 0
      ? [{ name: "Brings the visit up to our minimum", description: "Visit minimum", qty: 1, unitPrice: r.minimumAdd, isAddon: false }]
      : []),
  ];
  const label = `Bundle discount: ${r.pct}% off ${r.lines.length} services`;
  const result = await pushQuoteToGhl({
    contact: offer.contact,
    propertyType: offer.propertyType,
    quoteNumber: offer.quoteNumber,
    lineItems,
    discountPercent: 0,
    discountReason: "",
    ...(r.pct > 0 ? { discountFixed: { value: r.discount, description: label } } : {}),
    subtotal: r.subtotal + r.minimumAdd,
    total: r.total,
    sendToClient: true,
    sentTag: "quote-picked",
    ghl: { estimateId: offer.ghl.estimateId, opportunityId: offer.ghl.opportunityId },
    notes: `The client picked ${r.lines.length} of ${offer.lines.length} services on ${SITE_URL}/pick/${offer.id}${r.pct ? ` (${label})` : ""}.`,
    summary: "",
    pricingNote: "",
    files: [],
  });

  await writeOffer({
    ...offer,
    status: "accepted",
    accepted: { ids: r.lines.map((l) => l.id), total: r.total, pct: r.pct, at: Date.now() },
    ghl: { ...offer.ghl, contactId: result.contact.id ?? offer.ghl.contactId, estimateId: result.estimate.id ?? offer.ghl.estimateId },
  });
  if (result.estimate.status !== "ok") console.error("pick: estimate failed after the client picked", offer.id, result.estimate.detail);
  return { ok: true, total: r.total, pct: r.pct, sent: result.sent.status === "ok" };
}
