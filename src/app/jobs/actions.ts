"use server";

/** Server side of the /jobs tool (job reports for clients, Bri 2026-11-16). Every action re-checks
 *  the same passcode cookie as /quote. GHL sends go out from the Rinse It Off number and inbox. */

import { randomBytes } from "node:crypto";
import { isQuoteAuthed } from "@/app/quote/auth";
import { allReports, readReport, writeReport } from "@/lib/jobs/store";
import { firstName, REPORT_ID, WORKERS, type JobRemarks, type JobReport } from "@/lib/jobs/types";
import { SITE_URL } from "@/lib/seo";

const GHL = "https://services.leadconnectorhq.com";
const KEY = process.env.GHL_API_KEY;
const LOC = process.env.GHL_LOCATION_ID;
const MODEL = "claude-sonnet-5-5";

const deny = { ok: false as const, error: "Unlock the tool again." };

function pacificToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}

export async function newReport(): Promise<{ ok: true; report: JobReport } | typeof deny> {
  if (!(await isQuoteAuthed())) return deny;
  // 12 chars of [a-z0-9] from random bytes: the link is the only key to the page, so it must not be guessable.
  const id = Array.from(randomBytes(12), (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("");
  const report: JobReport = {
    id, status: "draft", client: { name: "", phone: "", email: "", address: "" }, date: pacificToday(),
    lead: WORKERS[0].name, services: [], media: { before: [], during: [], after: [] }, note: "", updatedAt: Date.now(),
  };
  await writeReport(report);
  return { ok: true, report };
}

export async function listReports() {
  if (!(await isQuoteAuthed())) return [];
  return (await allReports()).map((r) => ({
    id: r.id, name: r.client.name, address: r.client.address, date: r.date, status: r.status, lead: r.lead,
    photos: r.media.before.length + r.media.during.length + r.media.after.length, updatedAt: r.updatedAt,
  }));
}

export async function loadReport(id: string) {
  if (!(await isQuoteAuthed())) return null;
  return readReport(id);
}

/** Last save wins (two phones editing one job at the same moment can drop a photo; ponytail: fine for a crew of two). */
export async function saveReport(r: JobReport): Promise<{ ok: boolean; error?: string; updatedAt?: number }> {
  if (!(await isQuoteAuthed())) return deny;
  if (!REPORT_ID.test(r.id)) return { ok: false, error: "Bad report id." };
  const prev = await readReport(r.id);
  const next = { ...r, status: prev?.status ?? "draft", sentAt: prev?.sentAt, updatedAt: Date.now() };
  await writeReport(next);
  return { ok: true, updatedAt: next.updatedAt };
}

// ── The AI's lines on what we did ─────────────────────────────────────────────
const VOICE = `You write the short "what we did" part of a job report from Rinse It Off, a small exterior cleaning company in Portland, Oregon (Bri, Alstun and the crew). The client reads it on their phone right after the job, under their before and after photos.

How it should sound: plain, warm, a little dry, like the person who did the work telling the homeowner what they did while wiping their hands off. Full sentences in ordinary words. "We" for the crew, "you" and "your" for the client. Always "Rinse It Off" if the name comes up. No exclamation points, no emoji, no dashes of any kind (use commas or periods), no hype words (transformed, pristine, sparkling, revitalized, like new, stunning), no "we're thrilled", no sign-off.

What you may say: only what the photos show and the services listed. Name the surface and what came off it (green algae, black streaks, moss, dirt, leaves, cobwebs, tire marks), as plainly as the photos allow. Describe the dirt as weather and time, never as the client's fault. If something in an after photo is still there (a stain that didn't fully lift), don't claim it's gone. Don't invent chemicals, methods, times, products, warranties or numbers. If you can't tell what something is, leave it out. Talk about the house, not the pictures: never mention photos, angles, lighting, or that a surface looks wet (everything is wet right after a wash; the client knows).

Return ONLY JSON: {"summary": "...", "items": [{"area": "...", "did": "..."}]}
- summary: one or two sentences, under 45 words, saying what got cleaned. It sits under the line "All done, <first name>." so don't greet them.
- items: one per area we worked on, 2 to 5 of them. area is two or three words ("Driveway", "Front of the house", "Back deck"). did is one sentence, under 30 words, saying what was on it and what we did.`;

export async function writeRemarks(id: string): Promise<{ ok: true; remarks: JobRemarks } | { ok: false; error: string }> {
  if (!(await isQuoteAuthed())) return deny;
  const r = await readReport(id);
  if (!r) return { ok: false, error: "Couldn't find this job." };
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { ok: false, error: "ANTHROPIC_API_KEY is not set on the server." };
  const stills = (s: "before" | "during" | "after", n: number) =>
    r.media[s].map((m) => (m.kind === "image" ? m.url : m.poster)).filter((u): u is string => !!u).slice(0, n);
  const groups = [["BEFORE", stills("before", 6)], ["DURING", stills("during", 3)], ["AFTER", stills("after", 6)]] as const;
  if (!groups.some(([, u]) => u.length)) return { ok: false, error: "Add a few photos first." };
  const content: unknown[] = [];
  for (const [label, urls] of groups) {
    if (!urls.length) continue;
    content.push({ type: "text", text: `${label} photos:` });
    for (const url of urls) content.push({ type: "image", source: { type: "url", url } });
  }
  content.push({ type: "text", text: [
    r.services.length ? `Services on this job: ${r.services.join(", ")}.` : "",
    r.client.address ? `Property: ${r.client.address}.` : "",
    "Write the JSON now.",
  ].filter(Boolean).join("\n") });
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 8000, output_config: { effort: "low" }, system: VOICE, messages: [{ role: "user", content }] }),
    });
    const data = (await res.json()) as { content?: { type: string; text?: string }[]; error?: { message?: string } };
    if (!res.ok) return { ok: false, error: data.error?.message || `The AI answered ${res.status}.` };
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as JobRemarks;
    // the voice bans dashes; strip any that slip through rather than show them to a client
    const clean = (s: string) => String(s || "").replace(/\s*[—–]\s*/g, ", ").replace(/!/g, ".").trim();
    const remarks: JobRemarks = {
      summary: clean(parsed.summary),
      items: (parsed.items || []).slice(0, 5).map((i) => ({ area: clean(i.area), did: clean(i.did) })).filter((i) => i.area && i.did),
    };
    if (!remarks.summary) return { ok: false, error: "The AI came back empty. Try again." };
    await writeReport({ ...r, remarks, updatedAt: Date.now() });
    return { ok: true, remarks };
  } catch (e) {
    console.error("writeRemarks", e);
    return { ok: false, error: "Couldn't reach the AI. Try again." };
  }
}

// ── Send the link to the client ───────────────────────────────────────────────
function e164(p: string): string {
  const d = (p || "").replace(/\D/g, "");
  return d.length === 10 ? `+1${d}` : d.length === 11 && d.startsWith("1") ? `+${d}` : "";
}

async function ghl(method: string, path: string, body?: unknown, version = "2021-07-28") {
  const res = await fetch(`${GHL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, Version: version, "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, json };
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function sendReport(id: string): Promise<{ ok: true; url: string; sent: string[]; problems: string[] } | { ok: false; error: string }> {
  if (!(await isQuoteAuthed())) return deny;
  if (!KEY || !LOC) return { ok: false, error: "GHL isn't set up on the server." };
  const r = await readReport(id);
  if (!r) return { ok: false, error: "Couldn't find this job." };
  const phone = e164(r.client.phone), email = r.client.email.trim();
  if (!phone && !email) return { ok: false, error: "Add the client's mobile number or email first." };
  if (!r.media.after.length) return { ok: false, error: "Add at least one after photo first." };

  const url = `${SITE_URL}/done/${r.id}`;
  let contactId = r.client.contactId;
  if (!contactId) {
    const [first, ...rest] = r.client.name.trim().split(/\s+/);
    const up = await ghl("POST", "/contacts/upsert", {
      locationId: LOC, firstName: first || undefined, lastName: rest.join(" ") || undefined,
      ...(phone ? { phone } : {}), ...(email ? { email } : {}), ...(r.client.address ? { address1: r.client.address } : {}), source: "Job report",
    });
    contactId = (up.json.contact as { id?: string } | undefined)?.id;
    if (!contactId) return { ok: false, error: `GHL wouldn't save the contact (${up.status}).` };
  }

  const lead = WORKERS.find((w) => w.name === r.lead) ?? WORKERS[0];
  const first = firstName(r.client.name);
  const street = r.client.address.split(",")[0].trim();
  const sms = `Hi ${first}, it's ${lead.name} from Rinse It Off. We're all done${street ? ` at ${street}` : ""}. Here are your before and after photos and what we did: ${url}`;
  const html = `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#0C1215;max-width:520px">
<p>Hi ${esc(first)},</p>
<p>We're all done${street ? ` at ${esc(street)}` : ""}. Your before and after photos and a few lines on what we did are on one page:</p>
<p><a href="${url}" style="display:inline-block;background:#F2B632;color:#0C1215;border:2px solid #0C1215;border-radius:14px;padding:14px 22px;font-weight:700;text-decoration:none;letter-spacing:.06em;text-transform:uppercase;font-size:14px">See your job report</a></p>
<p>Thanks for having us out.</p>
<p>${esc(lead.name)}<br>Rinse It Off · (971) 626-4146</p></div>`;

  const sent: string[] = [], problems: string[] = [];
  const v = "2021-04-15";
  if (phone) {
    const s = await ghl("POST", "/conversations/messages", { type: "SMS", contactId, message: sms, userId: lead.ghlUserId }, v);
    s.ok ? sent.push("text") : problems.push(`Text didn't send (${s.status}${s.json.message ? `: ${s.json.message}` : ""}).`);
  }
  if (email) {
    const s = await ghl("POST", "/conversations/messages", { type: "Email", contactId, subject: "Your Rinse It Off job report", html, userId: lead.ghlUserId }, v);
    s.ok ? sent.push("email") : problems.push(`Email didn't send (${s.status}${s.json.message ? `: ${s.json.message}` : ""}).`);
  }
  if (!sent.length) return { ok: false, error: problems.join(" ") };

  // the record in GHL: a note with the link, and a tag workflows can hang off later
  await ghl("POST", `/contacts/${contactId}/notes`, { body: `Job report sent by ${sent.join(" and ")} (${r.date}, lead: ${lead.name}): ${url}` }).catch(() => null);
  await ghl("POST", `/contacts/${contactId}/tags`, { tags: ["job-report-sent"] }).catch(() => null);
  await writeReport({ ...r, client: { ...r.client, contactId }, status: "sent", sentAt: Date.now(), updatedAt: Date.now() });
  return { ok: true, url, sent, problems };
}
