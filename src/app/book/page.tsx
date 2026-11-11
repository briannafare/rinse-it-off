"use client";
import { useEffect, useMemo, useState } from "react";
import { track as vaTrack } from "@vercel/analytics";
import { ArrowRight, Check, MessageSquare, Phone, Plus } from "lucide-react";
import { getFreeSlots, submitAssessmentForm } from "../assessment/actions";
import { lookupHouse } from "./actions";
import { arrivalWindow } from "@/lib/appointment-time.mjs";
import { estimate, FROM, pairing, SERVICES, type ServiceKey } from "@/lib/one-time-estimate";
import type { Stories } from "@/app/plan/pricing";

/** One-time cleaning: what needs cleaning → where (size from county records, or their own
 *  number, or "not sure") → what a house that size usually runs → a free quote visit OR the
 *  cleaning itself → a day (and a one-hour arrival window for visits) → name and mobile.
 *  Bri 2026-11-10: no fake prices, no exact times, the two paths stay separate, and they
 *  don't need to be home for a quote visit. Writes into GHL through the /assessment action. */

const PHONE = "+19716264146";
const PHONE_DISPLAY = "(971) 626-4146";
const TZ = "America/Los_Angeles";
const STORIES: { v: Stories; label: string }[] = [
  { v: 1, label: "1 story" },
  { v: 2, label: "2 stories" },
  { v: 3, label: "3 or more" },
];
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

// "2026-11-12" → "Thu, Nov 12" (built from parts so the browser's zone can't shift the day)
function dayLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
const longDay = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};
const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: TZ });
// The next 21 days we'd clean (Monday to Saturday), as "YYYY-MM-DD" in Pacific time.
function cleaningDays() {
  const out: string[] = [];
  for (let i = 1; out.length < 21 && i < 40; i++) {
    const d = new Date(Date.now() + i * 86400000);
    const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
    if (new Date(`${key}T12:00:00`).getDay() !== 0) out.push(key);
  }
  return out;
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex min-h-12 items-center gap-2 rounded-[12px] border-2 px-4 py-2.5 text-left text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 motion-reduce:transition-none ${
        on ? "border-[#0C1215] bg-[#F2B632] font-semibold text-[#0C1215]" : "border-[#E4DCCD] bg-white text-[#0C1215] hover:border-[#0C1215]"
      }`}
    >
      {on && <Check className="h-4 w-4 shrink-0" aria-hidden />}
      {children}
    </button>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="frame min-w-0 bg-white p-5 md:p-7">
      <h2 className="flex items-center gap-3 text-[1.35rem] leading-tight text-[#0C1215] md:text-[1.6rem]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0C1215] text-sm font-bold text-white">{n}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const input =
  "w-full rounded-[10px] border-2 border-[#E4DCCD] bg-white px-4 py-3 text-base text-[#0C1215] outline-none transition-colors focus:border-[#1A6E93]";
const label = "block text-[15px] font-semibold text-[#0C1215]";

type Lookup = { state: "idle" | "looking" | "found" | "missing"; matched?: string };

export default function BookPage() {
  const [src, setSrc] = useState("direct");
  const [picked, setPicked] = useState<ServiceKey[]>([]);
  const [address, setAddress] = useState("");
  const [lookup, setLookup] = useState<Lookup>({ state: "idle" });
  const [sqftText, setSqftText] = useState("");
  const [sqftSource, setSqftSource] = useState<"county" | "owner">("owner");
  const [sizeUnknown, setSizeUnknown] = useState(false);
  const [editingSize, setEditingSize] = useState(false);
  const [stories, setStories] = useState<Stories | null>(null);
  const [notes, setNotes] = useState("");
  const [wants, setWants] = useState<"" | "visit" | "book-cleaning">("");
  const [slotMap, setSlotMap] = useState<Record<string, string[]>>({});
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [dayKey, setDayKey] = useState("");
  const [slot, setSlot] = useState("");
  const [home, setHome] = useState<"" | "home" | "walk-around">("");
  const [cleanDay, setCleanDay] = useState("");
  const [planToo, setPlanToo] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // ?service=gutters preselects from a service page; ?src= says which button sent them.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = (q.get("src") || "direct").replace(/[^\w-]/g, "").slice(0, 40) || "direct";
    setSrc(s);
    const svc = q.get("service");
    if (svc && SERVICES.some((x) => x.key === svc)) setPicked([svc as ServiceKey]);
    // runs before the layout's <Analytics /> sets up window.va, so start its queue here (as /plan does)
    const w = window as unknown as { va?: (...a: unknown[]) => void; vaq?: unknown[][] };
    w.va ??= (...a: unknown[]) => { (w.vaq ??= []).push(a); };
    vaTrack("Book visit", { src: s });
  }, []);

  // Real openings on the same calendar /assessment books. GHL rejects ranges over 31 days.
  useEffect(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    Promise.all([getFreeSlots(now, now + 31 * day), getFreeSlots(now + 31 * day, now + 62 * day)])
      .then(([a, b]) => setSlotMap({ ...a.days, ...b.days }))
      .catch(() => setSlotMap({}))
      .finally(() => setSlotsLoaded(true));
  }, []);

  const visitDays = useMemo(() => Object.keys(slotMap).filter((k) => slotMap[k]?.length).sort().slice(0, 21), [slotMap]);
  const cleanDays = useMemo(cleaningDays, []);
  const toggle = (k: ServiceKey) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const labels = SERVICES.filter((s) => picked.includes(s.key)).map((s) => s.label);

  const sqft = sizeUnknown ? null : Number(sqftText.replace(/[^\d]/g, "")) || null;
  const est = estimate(sqft && sqft >= 400 ? sqft : null, stories, picked);
  const pair = est ? pairing(picked) : null;
  const pairEst = pair && sqft && stories ? estimate(sqft, stories, [pair.key]) : null;

  const findHouse = async () => {
    if (!address.trim() || lookup.state === "looking") return;
    setLookup({ state: "looking" });
    const r = await lookupHouse(address);
    if (r) {
      setSqftText(String(r.sqft));
      setSqftSource("county");
      setSizeUnknown(false);
      setEditingSize(false);
      setLookup({ state: "found", matched: r.matched });
    } else {
      setSqftSource("owner");
      setLookup({ state: "missing" });
    }
    vaTrack("Book house lookup", { found: r ? "yes" : "no", src });
  };

  const choose = (w: "visit" | "book-cleaning") => { setWants(w); vaTrack("Book path", { path: w, src }); };
  const sizeAnswered = sizeUnknown || !!sqft;
  const whenReady = wants === "visit" ? !!slot && !!home : wants === "book-cleaning" ? !!cleanDay : false;
  const ready = picked.length > 0 && address.trim() && sizeAnswered && stories && whenReady && contact.name.trim() && contact.phone.trim();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || !wants) return;
    setError("");
    setSending(true);
    const result = await submitAssessmentForm({
      propertyType: "residential",
      services: labels,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      address,
      message: notes,
      appointmentDate: wants === "visit" && slot ? longDate(slot) : undefined,
      appointmentTime: wants === "visit" && slot ? `arriving ${arrivalWindow(slot)}` : undefined,
      appointmentISO: wants === "visit" ? slot || undefined : undefined,
      source: `Website — One-time cleaning (${wants === "visit" ? "quote visit" : "booked the cleaning"}, ${src})`,
      oneTime: {
        wants,
        sqft: sqft || undefined,
        sqftSource: sqft ? sqftSource : undefined,
        stories: STORIES.find((s) => s.v === stories)?.label,
        estimate: est ? { low: est.low, high: est.high } : undefined,
        home: wants === "visit" && home ? home : undefined,
        preferredDay: wants === "book-cleaning" && cleanDay ? longDay(cleanDay) : undefined,
        planToo,
      },
    });
    setSending(false);
    if (result.success) {
      vaTrack("Book request", { path: wants, src, services: picked.length, plan: planToo ? "yes" : "no" });
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(result.error || `Something went wrong. Please call or text us at ${PHONE_DISPLAY}.`);
    }
  };

  const first = contact.name.trim().split(" ")[0] || "there";
  const photoText = encodeURIComponent(`Hi, it's ${contact.name.trim() || "me"}. Photos of the house at ${address.trim()}:`);

  if (sent) {
    return (
      <section className="bg-retro-paper pb-24 pt-28 md:pt-36">
        <div className="container-site max-w-2xl">
          <div className="frame bg-white p-6 md:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2B632] ring-2 ring-[#0C1215]">
              <Check className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="mt-5 text-[2.2rem] leading-[1.02] text-[#0C1215] md:text-[3rem]">
              {wants === "visit" ? `You're booked, ${first}.` : `Got it, ${first}.`}
            </h1>
            {wants === "visit" ? (
              <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
                Bri will be at {address.trim()} on <strong className="text-[#0C1215]">{longDate(slot)}, arriving {arrivalWindow(slot)}</strong>.{" "}
                {home === "walk-around"
                  ? "You don't need to be there. She'll walk around the outside and text you the exact price."
                  : "She'll look at the outside with you and give you the exact price that day."}{" "}
                You&apos;ll get a reminder text the day before.
              </p>
            ) : (
              <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
                We&apos;ll text {contact.phone.trim()} to confirm your arrival window on <strong className="text-[#0C1215]">{longDay(cleanDay)}</strong>.
                The price is confirmed when we arrive, before any work starts.
              </p>
            )}
            <div className="mt-7 rounded-[12px] bg-[#62C4EB]/25 p-5">
              <p className="font-semibold text-[#0C1215]">Have photos of the house?</p>
              <p className="mt-1 text-[#3B4247]">Text them to us. A couple of pictures of the problem spots helps us bring the right gear.</p>
              <a
                href={`sms:${PHONE}?&body=${photoText}`}
                onClick={() => vaTrack("Book photos", { src })}
                className="btn-print mt-4 inline-flex min-h-[52px] items-center gap-2 bg-[#F2B632] px-6 text-[#0C1215]"
              >
                <MessageSquare className="h-5 w-5" aria-hidden /> Text us photos
              </a>
            </div>
            {!planToo && (
              <p className="mt-6 text-[15px] text-[#3B4247]">
                Want the outside of the house taken care of every season?{" "}
                <a href="/plan?src=book-done" className="font-semibold text-[#0C1215] underline">See the yearly plan</a>.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-retro-paper pb-28 pt-28 md:pb-24 md:pt-36">
      <div className="container-site max-w-2xl">
        <p className="label-caps !tracking-[0.14em] text-[#1A6E93]">One-time cleaning</p>
        <h1 className="mt-3 text-[2.6rem] leading-[0.98] text-[#0C1215] [text-wrap:balance] md:text-[3.6rem]">Book a cleaning</h1>
        <p className="mt-5 text-lg leading-relaxed text-[#3B4247]">
          Tell us what needs cleaning and where. You&apos;ll see what a house your size usually runs, then book a free quote visit or the cleaning itself.
        </p>
        <p className="mt-3 text-[15px] text-[#3B4247]">
          Rather just talk?{" "}
          <a href={`tel:${PHONE}`} className="font-semibold text-[#0C1215] underline decoration-[#F2B632] decoration-[3px] underline-offset-4">
            Call or text {PHONE_DISPLAY}
          </a>
          .
        </p>

        <form onSubmit={submit} className="mt-10 grid gap-5">
          <Step n={1} title="What needs cleaning?">
            <p className="-mt-2 mb-4 text-[15px] text-[#5F676C]">Pick as many as you like.</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <Chip key={s.key} on={picked.includes(s.key)} onClick={() => toggle(s.key)}>
                  <span className="flex w-full items-baseline justify-between gap-3">
                    <span>{s.label}</span>
                    <span className="shrink-0 text-[13px] font-normal text-[#5F676C]">
                      {FROM[s.key] ? `from ${money(FROM[s.key]!)}` : "priced on site"}
                    </span>
                  </span>
                </Chip>
              ))}
            </div>
          </Step>

          <Step n={2} title="Where's the house?">
            <label htmlFor="address" className={label}>Address</label>
            <div className="mt-2 flex gap-2">
              <input
                id="address"
                className={input}
                autoComplete="street-address"
                placeholder="1234 SE Main St, Portland"
                value={address}
                onChange={(e) => { setAddress(e.target.value); if (lookup.state !== "idle") setLookup({ state: "idle" }); }}
                onBlur={() => { if (lookup.state === "idle" && /\d+\s+\S+/.test(address)) findHouse(); }}
                required
              />
              <button type="button" onClick={findHouse} className="shrink-0 rounded-[10px] border-2 border-[#0C1215] bg-white px-4 text-[15px] font-semibold text-[#0C1215]">
                {lookup.state === "looking" ? "Looking…" : "Look it up"}
              </button>
            </div>

            {lookup.state === "found" && !editingSize && (
              <div className="mt-4 rounded-[10px] bg-[#62C4EB]/25 p-4 text-[15px] text-[#0C1215]">
                County records list this house at <strong>{Number(sqftText).toLocaleString("en-US")} sq ft</strong>
                <span className="block text-[13px] text-[#3B4247]">{lookup.matched}</span>
                <button type="button" onClick={() => { setEditingSize(true); setSqftSource("owner"); }} className="mt-2 text-[14px] font-semibold underline">
                  Not right? Change it
                </button>
              </div>
            )}

            {(lookup.state === "missing" || editingSize) && (
              <div className="mt-4">
                <label htmlFor="sqft" className={label}>
                  {lookup.state === "missing" ? "We couldn't find this house in county records. About how many square feet is it?" : "How many square feet is it?"}
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    id="sqft"
                    inputMode="numeric"
                    className={`${input} max-w-[180px]`}
                    placeholder="2,100"
                    value={sizeUnknown ? "" : sqftText}
                    onChange={(e) => { setSqftText(e.target.value); setSizeUnknown(false); setSqftSource("owner"); }}
                  />
                  <Chip on={sizeUnknown} onClick={() => { setSizeUnknown(!sizeUnknown); setSqftText(""); }}>Not sure</Chip>
                </div>
              </div>
            )}

            {lookup.state !== "idle" && lookup.state !== "looking" && (
              <>
                <p className="mt-5 text-[15px] font-semibold text-[#0C1215]">How many stories?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STORIES.map((s) => <Chip key={s.v} on={stories === s.v} onClick={() => setStories(s.v)}>{s.label}</Chip>)}
                </div>
              </>
            )}
          </Step>

          {picked.length > 0 && sizeAnswered && stories && (
            <Step n={3} title={est ? "What a house this size usually runs" : "Your price"}>
              {est ? (
                <>
                  <ul className="divide-y divide-[#E4DCCD]">
                    {est.lines.map((l) => (
                      <li key={l.key} className="flex items-baseline justify-between gap-4 py-2.5 text-[16px] text-[#0C1215]">
                        <span>{l.label}</span>
                        <span className="font-semibold tabular-nums">{money(l.low)} to {money(l.high)}</span>
                      </li>
                    ))}
                    {est.unpriced.map((u) => (
                      <li key={u} className="flex items-baseline justify-between gap-4 py-2.5 text-[16px] text-[#0C1215]">
                        <span>{u}</span>
                        <span className="text-[14px] text-[#5F676C]">priced on site</span>
                      </li>
                    ))}
                  </ul>
                  {est.lines.length > 1 && (
                    <p className="mt-3 flex items-baseline justify-between gap-4 border-t-2 border-[#0C1215] pt-3 text-[18px] font-semibold text-[#0C1215]">
                      <span>Together</span>
                      <span className="tabular-nums">{money(est.low)} to {money(est.high)}</span>
                    </p>
                  )}
                  <p className="mt-4 text-[15px] leading-relaxed text-[#3B4247]">
                    This isn&apos;t your quote. We price by the exact square foot and by the condition, and nobody has seen the house yet. A roof with heavy
                    moss, for example, can need more than one treatment. You get the exact price before any work starts.
                  </p>
                  {pair && pairEst && (
                    <div className="mt-5 rounded-[12px] border-2 border-dashed border-[#0C1215]/30 p-4">
                      <p className="text-[15px] leading-snug text-[#0C1215]">{pair.why}</p>
                      <button
                        type="button"
                        onClick={() => { toggle(pair.key); vaTrack("Book add pairing", { add: pair.key, src }); }}
                        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[10px] border-2 border-[#0C1215] bg-white px-4 text-[15px] font-semibold text-[#0C1215]"
                      >
                        <Plus className="h-4 w-4" aria-hidden /> Add {SERVICES.find((s) => s.key === pair.key)!.label.toLowerCase()}, usually{" "}
                        {money(pairEst.low)} to {money(pairEst.high)}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[16px] leading-relaxed text-[#3B4247]">
                  We&apos;ll give you the exact price when we see the house. Book a free quote visit below, or book the cleaning and we&apos;ll confirm the
                  price when we arrive, before any work starts.
                </p>
              )}
            </Step>
          )}

          <Step n={picked.length > 0 && sizeAnswered && stories ? 4 : 3} title="How do you want to go ahead?">
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ["visit", "Free quote visit", "Bri comes by, looks at the outside and gives you the exact price. You don't need to be home."],
                ["book-cleaning", "Book the cleaning", "Pick a day. We confirm the price when we arrive, before any work starts."],
              ] as const).map(([k, title, body]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={wants === k}
                  onClick={() => choose(k)}
                  className={`rounded-[14px] border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 motion-reduce:transition-none ${
                    wants === k ? "border-[#0C1215] bg-[#F2B632]" : "border-[#E4DCCD] bg-white hover:border-[#0C1215]"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[17px] font-semibold text-[#0C1215]">
                    {wants === k && <Check className="h-4 w-4" aria-hidden />}
                    {title}
                  </span>
                  <span className="mt-1 block text-[15px] leading-snug text-[#3B4247]">{body}</span>
                </button>
              ))}
            </div>

            {wants === "visit" && (
              <div className="mt-6">
                <p className="text-[15px] font-semibold text-[#0C1215]">Pick a day</p>
                {!slotsLoaded ? (
                  <p className="mt-2 text-[15px] text-[#5F676C]">Loading openings…</p>
                ) : visitDays.length === 0 ? (
                  <p className="mt-2 text-[15px] text-[#3B4247]">
                    We couldn&apos;t load the calendar just now. Call or text {PHONE_DISPLAY} and we&apos;ll set it up.
                  </p>
                ) : (
                  <>
                    <div className="-mx-1 mt-2 flex max-w-full gap-2 overflow-x-auto px-1 pb-2">
                      {visitDays.map((k) => (
                        <Chip key={k} on={dayKey === k} onClick={() => { setDayKey(k); setSlot(""); }}>
                          <span className="whitespace-nowrap">{dayLabel(k)}</span>
                        </Chip>
                      ))}
                    </div>
                    {dayKey && (
                      <>
                        <p className="mt-4 text-[15px] font-semibold text-[#0C1215]">Pick an arrival window</p>
                        <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
                          {(slotMap[dayKey] || []).map((iso) => (
                            <Chip key={iso} on={slot === iso} onClick={() => setSlot(iso)}>
                              <span className="w-full whitespace-nowrap text-center">{arrivalWindow(iso)}</span>
                            </Chip>
                          ))}
                        </div>
                      </>
                    )}
                    <p className="mt-5 text-[15px] font-semibold text-[#0C1215]">Will you be home?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Chip on={home === "home"} onClick={() => setHome("home")}>I&apos;ll be home</Chip>
                      <Chip on={home === "walk-around"} onClick={() => setHome("walk-around")}>Walk around without me</Chip>
                    </div>
                  </>
                )}
                {SERVICES.some((s) => !picked.includes(s.key)) && (
                  <>
                    <p className="mt-6 text-[15px] font-semibold text-[#0C1215]">While Bri&apos;s there, want her to price anything else?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {SERVICES.filter((s) => !picked.includes(s.key) && s.key !== "other").map((s) => (
                        <Chip key={s.key} on={false} onClick={() => toggle(s.key)}>
                          <Plus className="h-4 w-4" aria-hidden /> {s.label}
                        </Chip>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {wants === "book-cleaning" && (
              <div className="mt-6">
                <p className="text-[15px] font-semibold text-[#0C1215]">Pick a day</p>
                <div className="-mx-1 mt-2 flex max-w-full gap-2 overflow-x-auto px-1 pb-2">
                  {cleanDays.map((k) => (
                    <Chip key={k} on={cleanDay === k} onClick={() => setCleanDay(k)}>
                      <span className="whitespace-nowrap">{dayLabel(k)}</span>
                    </Chip>
                  ))}
                </div>
                <p className="mt-2 text-[15px] text-[#3B4247]">We&apos;ll text you to confirm a one-hour arrival window that day.</p>
              </div>
            )}

            {wants && (
              <>
                <label htmlFor="notes" className={`${label} mt-6`}>
                  Anything we should know? <span className="font-normal text-[#5F676C]">(optional)</span>
                </label>
                <textarea id="notes" rows={2} className={`${input} mt-2`} placeholder="Gate code, a dog in the yard, the side with the worst moss" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[12px] border-2 border-[#E4DCCD] bg-white p-4">
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-[#0C1215]" checked={planToo} onChange={(e) => setPlanToo(e.target.checked)} />
                  <span className="text-[15px] leading-snug text-[#0C1215]">
                    <strong>Also price the yearly plan for my house.</strong>{" "}
                    <span className="text-[#3B4247]">One visit each season, with the outside windows cleaned free at every one.</span>
                  </span>
                </label>
              </>
            )}
          </Step>

          <Step n={picked.length > 0 && sizeAnswered && stories ? 5 : 4} title="Where should we confirm it?">
            <div className="grid gap-4">
              <div>
                <label htmlFor="name" className={label}>First and last name</label>
                <input id="name" className={`${input} mt-2`} autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="phone" className={label}>Mobile number</label>
                <input id="phone" type="tel" inputMode="tel" className={`${input} mt-2`} autoComplete="tel" placeholder="(503) 555-0100" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="email" className={label}>
                  Email <span className="font-normal text-[#5F676C]">(optional)</span>
                </label>
                <input id="email" type="email" className={`${input} mt-2`} autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
              </div>
            </div>
          </Step>

          {/* What they're asking for, in one place, right above the button */}
          <div className="frame bg-[#62C4EB] p-5 text-[#0C1215] md:p-7">
            <p className="label-caps !tracking-[0.14em]">Your request</p>
            <p className="mt-2 text-[17px] font-semibold">{labels.length ? labels.join(", ") : "Pick what needs cleaning above"}</p>
            {est && <p className="mt-1 text-[15px]">Usually {money(est.low)} to {money(est.high)} for a house this size</p>}
            <p className="mt-1 text-[15px]">
              {wants === "visit"
                ? slot ? `Free quote visit, ${longDate(slot)}, arriving ${arrivalWindow(slot)}` : "Free quote visit: pick a day and an arrival window above"
                : wants === "book-cleaning"
                  ? cleanDay ? `Cleaning on ${longDay(cleanDay)}. We'll text to confirm the arrival window.` : "Cleaning: pick a day above"
                  : ""}
            </p>

            {error && <p className="mt-4 rounded-[10px] bg-white p-3 text-[15px] text-[#B42318]">{error}</p>}
            <button type="submit" disabled={!ready || sending} className="btn-print mt-5 inline-flex min-h-[56px] w-full items-center justify-center gap-2 bg-[#F2B632] px-6 text-[#0C1215] disabled:cursor-not-allowed disabled:opacity-60">
              {sending ? "Sending…" : wants === "book-cleaning" ? "Book my cleaning" : "Book my quote visit"}
              {!sending && <ArrowRight className="h-5 w-5" aria-hidden />}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-[#0C1215]/80">
              By submitting, you agree to receive calls and texts about your quote and appointment from Rinse It Off. Msg &amp; data rates may apply,
              frequency varies. Reply STOP to opt out, HELP for help. See our{" "}
              <a href="/privacy" className="underline">Privacy Policy</a> and <a href="/terms" className="underline">Terms</a>.
            </p>
          </div>
        </form>

        <p className="mt-8 text-[15px] text-[#3B4247]">
          For a business, HOA or apartment building,{" "}
          <a href="/assessment?type=commercial" className="font-semibold text-[#0C1215] underline">book the commercial walkthrough</a>.
        </p>
        <p className="mt-4 flex items-center gap-2 text-[15px] text-[#3B4247] md:hidden">
          <Phone className="h-4 w-4" aria-hidden /> <a href={`tel:${PHONE}`} className="font-semibold text-[#0C1215]">{PHONE_DISPLAY}</a>
        </p>
      </div>
    </section>
  );
}
