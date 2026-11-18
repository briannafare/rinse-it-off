"use server";

/** Server actions for the internal /quote audit tool.
 *  Conventions follow src/app/assessment/actions.ts: env-driven IDs with the
 *  live Rinse It Off defaults, Version header 2021-07-28, fail-soft GHL calls.
 *  Every action re-checks the passcode cookie before touching anything. */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  QUOTE_AUTH_COOKIE,
  QUOTE_AUTH_MAX_AGE,
  expectedAuthToken,
  isQuoteAuthed,
} from "./auth";
import type {
  GhlContactMatch,
  SendQuotePayload,
  SendStepResult,
  SendToGhlResult,
} from "@/lib/quote/types";

import { pushQuoteToGhl } from "@/lib/quote/ghl-send";
import { isAutoLine, type OfferLine } from "@/lib/quote/bundle";
import { newOfferId, readOffer, writeOffer } from "@/lib/quote/offers";
import { SITE_URL } from "@/lib/seo";
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// ── Passcode gate ─────────────────────────────────────────────────────────────
export async function unlockQuoteTool(formData: FormData): Promise<void> {
  const pw = String(formData.get("passcode") ?? "");
  const next = formData.get("next") === "/jobs" ? "/jobs" : "/quote"; // the job-report tool shares this passcode
  const configured = process.env.QUOTE_PASSWORD;
  if (!configured) redirect(`${next}?error=unconfigured`);
  if (pw !== configured) redirect(`${next}?error=wrong`);
  const jar = await cookies();
  jar.set(QUOTE_AUTH_COOKIE, expectedAuthToken()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: QUOTE_AUTH_MAX_AGE,
    path: "/",
  });
  redirect(next);
}

// ── Contact search (Step 1 "find existing contact") ───────────────────────────
export async function searchGhlContacts(
  query: string,
): Promise<{ ok: boolean; contacts: GhlContactMatch[]; error?: string }> {
  if (!(await isQuoteAuthed())) return { ok: false, contacts: [], error: "Not authorized" };
  const q = (query || "").trim();
  if (q.length < 2) return { ok: true, contacts: [] };
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    return { ok: false, contacts: [], error: "GHL is not configured (missing API key)" };
  }
  try {
    const url = `${GHL_API_BASE}/contacts/?locationId=${encodeURIComponent(
      GHL_LOCATION_ID,
    )}&query=${encodeURIComponent(q)}&limit=10`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${GHL_API_KEY}`, Version: GHL_VERSION },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("GHL contact search failed:", res.status, await res.text());
      return { ok: false, contacts: [], error: `Search failed (${res.status})` };
    }
    const data = (await res.json()) as { contacts?: Array<Record<string, unknown>> };
    const contacts: GhlContactMatch[] = (data.contacts || []).map((c) => ({
      id: String(c.id ?? ""),
      name:
        String(c.contactName ?? "").trim() ||
        `${String(c.firstName ?? "")} ${String(c.lastName ?? "")}`.trim(),
      email: String(c.email ?? ""),
      phone: String(c.phone ?? ""),
      address: String(c.address1 ?? ""),
      city: String(c.city ?? ""),
      state: String(c.state ?? ""),
      zip: String(c.postalCode ?? ""),
    }));
    return { ok: true, contacts };
  } catch (e) {
    console.error("searchGhlContacts error:", e);
    return { ok: false, contacts: [], error: "Search failed — network error" };
  }
}

// ── Send to GHL (Step 5) ──────────────────────────────────────────────────────
export async function sendQuoteToGhl(payload: SendQuotePayload): Promise<SendToGhlResult> {
  if (!(await isQuoteAuthed())) {
    const fail = (detail: string): SendStepResult => ({ status: "fail", detail });
    return { contact: fail("Not authorized — unlock the tool again"), opportunity: { status: "skip" }, estimate: fail("Not attempted"), sent: fail("Not attempted"), tag: fail("Not attempted"), note: fail("Not attempted") };
  }
  return pushQuoteToGhl(payload);
}

// ── Send as a pick-your-services link (Bri 2026-11-18) ────────────────────────
/** Saves the quote's services as an offer page (/pick/<id>) and texts and emails the client the link.
 *  The client checks what they want, the bundle discount applies (src/lib/quote/bundle.ts), and the
 *  estimate for what they picked goes out from the page. Sending again updates the same page until the
 *  client has picked; after that a send makes a new page. */
export async function sendQuoteAsPicks(
  payload: SendQuotePayload,
  offerId?: string,
  quoteId?: string,
): Promise<{ result: SendToGhlResult; offerId?: string; url?: string; error?: string }> {
  const fail = (detail: string): SendStepResult => ({ status: "fail", detail });
  const blocked = (detail: string) => ({
    result: { contact: fail(detail), opportunity: { status: "skip" as const }, estimate: fail("Not attempted"), sent: fail("Not attempted"), tag: fail("Not attempted"), note: fail("Not attempted") },
    error: detail,
  });
  if (!(await isQuoteAuthed())) return blocked("Not authorized — unlock the tool again");

  const lines: OfferLine[] = payload.lineItems
    .map((i, n) => ({ id: `l${n + 1}`, name: i.name, category: i.description.replace(/ \(add-on\)$/, ""), price: Math.round(i.qty * i.unitPrice * 100) / 100 }))
    .filter((l) => l.price > 0 && !isAutoLine(l.category));
  if (!lines.length) return blocked("No priced services to pick from.");

  const prev = offerId ? await readOffer(offerId) : null;
  const id = prev && prev.status !== "accepted" ? prev.id : newOfferId();
  const url = `${SITE_URL}/pick/${id}`;
  const everything = lines.reduce((t, l) => t + l.price, 0);

  const result = await pushQuoteToGhl({ ...payload, total: everything, pick: { url } });
  await writeOffer({
    id,
    quoteId,
    quoteNumber: payload.quoteNumber,
    propertyType: payload.propertyType,
    contact: payload.contact,
    lines,
    status: "sent",
    sentBy: "Rinse It Off",
    sentAt: Date.now(),
    ghl: { ...prev?.ghl, contactId: result.contact.id ?? prev?.ghl.contactId, opportunityId: result.opportunity.id ?? prev?.ghl.opportunityId },
    updatedAt: Date.now(),
  });
  return { result, offerId: id, url };
}
