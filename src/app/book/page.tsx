"use client";
import { useEffect, useMemo, useState } from "react";
import { track as vaTrack } from "@vercel/analytics";
import { ArrowRight, Check, MessageSquare, Minus, Phone, Plus } from "lucide-react";
import { getFreeSlots, submitAssessmentForm } from "../assessment/actions";
import { lookupHouse } from "./actions";
import { arrivalWindow } from "@/lib/appointment-time.mjs";
import {
  CONDITION_CAP, DRIVEWAY_SF, FLOOR, MOSS_LABEL, RATE, SERVICES, SIZE_BANDS, VISIT_MIN,
  guessStories, measure, pairing, quote, servicePrice,
  type Choices, type Driveway, type House, type Moss, type ServiceKey, type Stories,
} from "@/lib/one-time-estimate";

/** One-time cleaning: address (size and outline from public records) → what needs
 *  cleaning, priced for that house → one total → a day → name and mobile.
 *  Bri 2026-11-11: a real number, not a range plus "book a visit"; priced from crew cost and
 *  local competitors; no $500 for ten windows; few questions. Condition can move the price by at most
 *  CONDITION_CAP, with their OK. A free quote visit stays available as the second path.
 *  Writes into GHL through the /assessment action, which recomputes the price. */

const PHONE = "+19716264146";
const PHONE_DISPLAY = "(971) 626-4146";
const TZ = "America/Los_Angeles";
const STORIES: { v: Stories; label: string }[] = [
  { v: 1, label: "1 story" },
  { v: 2, label: "2 stories" },
  { v: 3, label: "3 or more" },
];
const DRIVEWAYS: { v: Driveway; label: string }[] = [
  { v: "small", label: "Small" },
  { v: "typical", label: "Two-car" },
  { v: "large", label: "Large or long" },
];
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

// Before we know the house: the unit price, or the smallest job of that kind.
const UNIT: Partial<Record<ServiceKey, string>> = {
  "roof-moss": `from ${money(FLOOR["roof-moss"]!)}`,
  gutters: `$${RATE.gutterLf.toFixed(2)} a foot`,
  "house-wash": `from ${money(FLOOR["house-wash"]!)}`,
  windows: `${money(RATE.window)} a window`,
  driveway: `from ${money(Math.round((DRIVEWAY_SF.small * RATE.concreteSf) / 5) * 5)}`,
};

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
    const key = new Date(Date.now() + i * 86400000).toLocaleDateString("en-CA", { timeZone: TZ });
    if (new Date(`${key}T12:00:00`).getDay() !== 0) out.push(key);
  }
  return out;
}

function Chip({ on, onClick, children, wide }: { on: boolean; onClick: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`${wide ? "w-full " : ""}flex min-h-12 items-center gap-2 rounded-[12px] border-2 px-4 py-2.5 text-left text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 motion-reduce:transition-none ${
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
  const [address, setAddress] = useState("");
  const [lookup, setLookup] = useState<Lookup>({ state: "idle" });
  const [sqft, setSqft] = useState<number | null>(null);
  const [sqftSource, setSqftSource] = useState<"county" | "owner">("owner");
  const [outline, setOutline] = useState<{ footprintSf?: number; perimeterFt?: number }>({});
  const [editingSize, setEditingSize] = useState(false);
  const [stories, setStories] = useState<Stories | null>(null);
  const [storiesGuessed, setStoriesGuessed] = useState(false);
  const [picked, setPicked] = useState<ServiceKey[]>([]);
  const [moss, setMoss] = useState<Moss | null>(null);
  const [windows, setWindows] = useState<number | null>(null);
  const [driveway, setDriveway] = useState<Driveway>("typical");
  const [wants, setWants] = useState<"book-cleaning" | "visit">("book-cleaning");
  const [cleanDay, setCleanDay] = useState("");
  const [slotMap, setSlotMap] = useState<Record<string, string[]>>({});
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [dayKey, setDayKey] = useState("");
  const [slot, setSlot] = useState("");
  const [home, setHome] = useState<"" | "home" | "walk-around">("");
  const [notes, setNotes] = useState("");
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

  // Quote-visit openings load only if they ask for a visit.
  useEffect(() => {
    if (wants !== "visit" || slotsLoaded) return;
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    Promise.all([getFreeSlots(now, now + 31 * day), getFreeSlots(now + 31 * day, now + 62 * day)])
      .then(([a, b]) => setSlotMap({ ...a.days, ...b.days }))
      .catch(() => setSlotMap({}))
      .finally(() => setSlotsLoaded(true));
  }, [wants, slotsLoaded]);

  const visitDays = useMemo(() => Object.keys(slotMap).filter((k) => slotMap[k]?.length).sort().slice(0, 21), [slotMap]);
  const cleanDays = useMemo(cleaningDays, []);
  const toggle = (k: ServiceKey) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const house: House | null = sqft && stories ? { sqft, stories, ...outline } : null;
  const windowCount = windows ?? (house ? measure(house).windows : 12);
  const choices: Choices = { moss: moss ?? "patchy", windows: windowCount, driveway };
  const q = house ? quote(house, picked, choices) : null;
  const total = q ? q.total : 0;
  const pair = q && q.lines.length ? pairing(picked) : null;
  // what adding it really costs: its price less the same-visit savings, never below 0
  const pairPrice = pair && house ? quote(house, [...picked, pair.key], choices).total - total : null;
  const needsMoss = picked.includes("roof-moss") && !moss;

  const findHouse = async () => {
    if (!address.trim() || lookup.state === "looking") return;
    setLookup({ state: "looking" });
    const r = await lookupHouse(address);
    if (r) {
      setSqft(r.sqft);
      setSqftSource("county");
      setOutline({ footprintSf: r.footprintSf, perimeterFt: r.perimeterFt });
      setEditingSize(false);
      const g = guessStories(r.sqft, r.footprintSf);
      setStories(g);
      setStoriesGuessed(!!g);
      setWindows(null);
      setLookup({ state: "found", matched: r.matched });
    } else {
      setSqft(null);
      setOutline({});
      setSqftSource("owner");
      setLookup({ state: "missing" });
    }
    vaTrack("Book house lookup", { found: r ? "yes" : "no", outline: r?.footprintSf ? "yes" : "no", src });
  };

  const whenReady = wants === "visit" ? !!slot && !!home : !!cleanDay;
  const ready = picked.length > 0 && address.trim() && (wants === "visit" || (house && !needsMoss)) && whenReady && contact.name.trim() && contact.phone.trim();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setError("");
    setSending(true);
    const labels = SERVICES.filter((s) => picked.includes(s.key)).map((s) => (s.key === "roof-moss" && moss ? `${s.label} (${moss} moss)` : s.label));
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
        home: wants === "visit" && home ? home : undefined,
        preferredDay: wants === "book-cleaning" && cleanDay ? longDay(cleanDay) : undefined,
        planToo,
        price: house ? { house, picked, choices } : undefined,
      },
    });
    setSending(false);
    if (result.success) {
      vaTrack("Book request", { path: wants, src, services: picked.length, total, plan: planToo ? "yes" : "no" });
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
            <h1 className="mt-5 text-[2.2rem] leading-[1.02] text-[#0C1215] md:text-[3rem]">You&apos;re booked, {first}.</h1>
            {wants === "visit" ? (
              <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
                Bri will be at {address.trim()} on <strong className="text-[#0C1215]">{longDate(slot)}, arriving {arrivalWindow(slot)}</strong>.{" "}
                {home === "walk-around"
                  ? "You don't need to be there, since she'll walk around the outside and text you the price."
                  : "She'll look at the outside with you and give you the price that day."}{" "}
                You&apos;ll get a reminder text the day before.
              </p>
            ) : (
              <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
                Your cleaning is set for <strong className="text-[#0C1215]">{longDay(cleanDay)}</strong>
                {total ? <> at <strong className="text-[#0C1215]">{money(total)}</strong></> : null}. We&apos;ll text {contact.phone.trim()} with your
                one-hour arrival window.
              </p>
            )}
            <div className="mt-7 rounded-[12px] bg-[#62C4EB]/25 p-5">
              <p className="font-semibold text-[#0C1215]">Have photos of the house?</p>
              <p className="mt-1 text-[#3B4247]">Text them to us. A couple of pictures of the worst spots helps us bring the right gear.</p>
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
        <h1 className="mt-3 text-[2.6rem] leading-[0.98] text-[#0C1215] [text-wrap:balance] md:text-[3.6rem]">Get your price</h1>
        <p className="mt-5 text-lg leading-relaxed text-[#3B4247]">
          Type your address and pick what needs cleaning. We look up your house and price it on the spot. Then pick a day.
        </p>
        <p className="mt-3 text-[15px] text-[#3B4247]">
          Rather just talk?{" "}
          <a href={`tel:${PHONE}`} className="font-semibold text-[#0C1215] underline decoration-[#F2B632] decoration-[3px] underline-offset-4">
            Call or text {PHONE_DISPLAY}
          </a>
          .
        </p>

        <form onSubmit={submit} className="mt-10 grid gap-5">
          <Step n={1} title="Where's the house?">
            <label htmlFor="address" className={label}>Address</label>
            <div className="mt-2 flex gap-2">
              <input
                id="address"
                className={input}
                autoComplete="street-address"
                placeholder="1234 SW Main St, Tigard"
                value={address}
                onChange={(e) => { setAddress(e.target.value); if (lookup.state !== "idle") setLookup({ state: "idle" }); }}
                onBlur={() => { if (lookup.state === "idle" && /\d+\s+\S+/.test(address)) findHouse(); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); findHouse(); } }}
                required
              />
              <button type="button" onClick={findHouse} className="shrink-0 rounded-[10px] border-2 border-[#0C1215] bg-white px-4 text-[15px] font-semibold text-[#0C1215]">
                {lookup.state === "looking" ? "Looking…" : "Look it up"}
              </button>
            </div>

            {lookup.state === "found" && !editingSize && sqft && (
              <div className="mt-4 rounded-[10px] bg-[#62C4EB]/25 p-4 text-[15px] text-[#0C1215]">
                Found it: <strong>{sqft.toLocaleString("en-US")} sq ft</strong>
                {outline.footprintSf ? <>, and we measured the roof and gutter line from above</> : null}.
                <span className="block text-[13px] text-[#3B4247]">{lookup.matched}</span>
                <button type="button" onClick={() => { setEditingSize(true); setSqftSource("owner"); }} className="mt-2 text-[14px] font-semibold underline">
                  Size not right? Change it
                </button>
              </div>
            )}

            {(lookup.state === "missing" || editingSize) && (
              <div className="mt-4">
                <p className={label}>
                  {lookup.state === "missing" ? "We couldn't find this house in county records. About how big is it?" : "About how big is it?"}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {SIZE_BANDS.map((b) => (
                    <Chip key={b.sqft} on={sqft === b.sqft} onClick={() => { setSqft(b.sqft); setOutline({}); setSqftSource("owner"); setWindows(null); }}>
                      {b.label}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {(lookup.state === "found" || lookup.state === "missing") && (
              <>
                <p className="mt-5 text-[15px] font-semibold text-[#0C1215]">
                  {storiesGuessed ? "Looks like this many stories. Change it if not." : "How many stories?"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STORIES.map((s) => (
                    <Chip key={s.v} on={stories === s.v} onClick={() => { setStories(s.v); setStoriesGuessed(false); }}>{s.label}</Chip>
                  ))}
                </div>
              </>
            )}
          </Step>

          <Step n={2} title="What needs cleaning?">
            <div className="grid grid-cols-1 gap-2.5">
              {SERVICES.map((s) => {
                const on = picked.includes(s.key);
                const price = house && s.priced ? servicePrice(s.key, house, choices) : null;
                return (
                  <div key={s.key} className={on ? "rounded-[14px] border-2 border-[#0C1215] p-1.5" : ""}>
                    <Chip wide on={on} onClick={() => toggle(s.key)}>
                      <span className="flex w-full items-baseline justify-between gap-3">
                        <span>{s.label}</span>
                        <span className="shrink-0 text-[14px] font-normal tabular-nums text-[#3B4247]">
                          {!s.priced ? "priced when we see it" : price !== null ? money(price) : UNIT[s.key]}
                        </span>
                      </span>
                    </Chip>

                    {on && s.key === "roof-moss" && (
                      <div className="px-2.5 pb-2 pt-3">
                        <p className="text-[15px] font-semibold text-[#0C1215]">How much moss?</p>
                        <div className="mt-2 grid gap-2">
                          {(Object.keys(MOSS_LABEL) as Moss[]).map((m) => (
                            <Chip key={m} on={moss === m} onClick={() => setMoss(m)}>
                              <span><strong className="capitalize">{m}</strong>: {MOSS_LABEL[m].toLowerCase()}</span>
                            </Chip>
                          ))}
                        </div>
                        <p className="mt-2 text-[13px] text-[#5F676C]">Can&apos;t see the roof? Pick patchy. It&apos;s the most common.</p>
                      </div>
                    )}

                    {on && s.key === "windows" && (
                      <div className="flex flex-wrap items-center gap-3 px-2.5 pb-2 pt-3">
                        <span className="text-[15px] text-[#0C1215]">
                          {windows === null ? "About" : ""} <strong className="tabular-nums">{windowCount}</strong> windows{windows === null && house ? " for a house this size" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <button type="button" aria-label="One fewer window" onClick={() => setWindows(Math.max(1, windowCount - 1))} className="flex h-11 w-11 items-center justify-center rounded-[10px] border-2 border-[#0C1215] bg-white">
                            <Minus className="h-4 w-4" aria-hidden />
                          </button>
                          <button type="button" aria-label="One more window" onClick={() => setWindows(windowCount + 1)} className="flex h-11 w-11 items-center justify-center rounded-[10px] border-2 border-[#0C1215] bg-white">
                            <Plus className="h-4 w-4" aria-hidden />
                          </button>
                        </span>
                      </div>
                    )}

                    {on && s.key === "driveway" && (
                      <div className="px-2.5 pb-2 pt-3">
                        <p className="text-[15px] font-semibold text-[#0C1215]">How big is the driveway?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {DRIVEWAYS.map((d) => <Chip key={d.v} on={driveway === d.v} onClick={() => setDriveway(d.v)}>{d.label}</Chip>)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Step>

          {q && q.lines.length > 0 && !needsMoss && (
            <Step n={3} title="Your price">
              <ul className="divide-y divide-[#E4DCCD]">
                {q.lines.map((l) => (
                  <li key={l.key} className="flex items-baseline justify-between gap-4 py-2.5 text-[16px] text-[#0C1215]">
                    <span>{l.key === "roof-moss" && moss ? `Roof moss (${moss}), gutters flushed after` : l.label}</span>
                    <span className="tabular-nums"><strong>{money(l.price)}</strong></span>
                  </li>
                ))}
                {q.sameVisitOff > 0 && (
                  <li className="flex items-baseline justify-between gap-4 py-2.5 text-[16px] text-[#0C1215]">
                    <span>All on one visit</span>
                    <span className="whitespace-nowrap tabular-nums"><strong>&minus;{money(q.sameVisitOff)}</strong></span>
                  </li>
                )}
                {q.unpriced.map((u) => (
                  <li key={u} className="flex items-baseline justify-between gap-4 py-2.5 text-[16px] text-[#0C1215]">
                    <span>{u}</span>
                    <span className="text-[14px] text-[#5F676C]">priced when we see it</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-baseline justify-between gap-4 border-t-2 border-[#0C1215] pt-3 text-[20px] font-semibold text-[#0C1215]">
                <span>Total</span>
                <span className="tabular-nums">{money(total)}</span>
              </p>

              {q.minimumGap > 0 && (
                <p className="mt-3 rounded-[10px] bg-[#62C4EB]/25 p-3 text-[15px] leading-snug text-[#0C1215]">
                  Your cleaning comes to {money(VISIT_MIN - q.minimumGap)}. A visit starts at {money(VISIT_MIN)}, so add something below or keep it as is. If
                  we&apos;re already working near you that day, we drop the minimum and you pay {money(VISIT_MIN - q.minimumGap)}. We&apos;ll tell you when we confirm your day.
                </p>
              )}

              {pair && pairPrice !== null && pairPrice > 0 && (
                <div className="mt-4 rounded-[12px] border-2 border-dashed border-[#0C1215]/30 p-4">
                  <p className="text-[15px] leading-snug text-[#0C1215]">{pair.why}</p>
                  <button
                    type="button"
                    onClick={() => { toggle(pair.key); vaTrack("Book add pairing", { add: pair.key, src }); }}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[10px] border-2 border-[#0C1215] bg-white px-4 text-[15px] font-semibold text-[#0C1215]"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> Add {SERVICES.find((s) => s.key === pair.key)!.label.toLowerCase()} for {money(pairPrice)}
                  </button>
                </div>
              )}

              <p className="mt-4 text-[15px] leading-relaxed text-[#3B4247]">
                We check the house when we arrive, before we start. If it needs more than you picked (thicker moss, say), we show you photos first.
                The most it can go up is {money(CONDITION_CAP)}, and you can say no.
              </p>
            </Step>
          )}

          <Step n={q && q.lines.length > 0 && !needsMoss ? 4 : 3} title={wants === "visit" ? "Pick a time for Bri's visit" : "Pick a day"}>
            {wants === "book-cleaning" ? (
              <>
                <div className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-2">
                  {cleanDays.map((k) => (
                    <Chip key={k} on={cleanDay === k} onClick={() => setCleanDay(k)}>
                      <span className="whitespace-nowrap">{dayLabel(k)}</span>
                    </Chip>
                  ))}
                </div>
                <p className="mt-2 text-[15px] text-[#3B4247]">We&apos;ll text you a one-hour arrival window for that day.</p>
                <p className="mt-4 text-[15px] text-[#3B4247]">
                  Rather have Bri look at it first?{" "}
                  <button type="button" onClick={() => { setWants("visit"); vaTrack("Book path", { path: "visit", src }); }} className="font-semibold text-[#0C1215] underline">
                    Book a free quote visit
                  </button>
                  . You don&apos;t need to be home.
                </p>
              </>
            ) : (
              <>
                {!slotsLoaded ? (
                  <p className="text-[15px] text-[#5F676C]">Loading openings…</p>
                ) : visitDays.length === 0 ? (
                  <p className="text-[15px] text-[#3B4247]">We couldn&apos;t load the calendar just now. Call or text {PHONE_DISPLAY} and we&apos;ll set it up.</p>
                ) : (
                  <>
                    <div className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-2">
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
                <p className="mt-5 text-[15px] text-[#3B4247]">
                  <button type="button" onClick={() => setWants("book-cleaning")} className="font-semibold text-[#0C1215] underline">
                    Book the cleaning instead
                  </button>
                </p>
              </>
            )}

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
          </Step>

          <Step n={q && q.lines.length > 0 && !needsMoss ? 5 : 4} title="Where should we text you?">
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

          <div className="frame bg-[#62C4EB] p-5 text-[#0C1215] md:p-7">
            <p className="label-caps !tracking-[0.14em]">Your booking</p>
            <p className="mt-2 text-[17px] font-semibold">
              {picked.length ? SERVICES.filter((s) => picked.includes(s.key)).map((s) => s.label).join(", ") : "Pick what needs cleaning above"}
              {wants === "book-cleaning" && total ? `: ${money(total)}` : ""}
            </p>
            <p className="mt-1 text-[15px]">
              {wants === "visit"
                ? slot ? `Free quote visit, ${longDate(slot)}, arriving ${arrivalWindow(slot)}` : "Free quote visit: pick a day and an arrival window above"
                : cleanDay ? `Cleaning on ${longDay(cleanDay)}. We'll text your arrival window.` : "Pick a day above"}
            </p>

            {error && <p className="mt-4 rounded-[10px] bg-white p-3 text-[15px] text-[#B42318]">{error}</p>}
            <button type="submit" disabled={!ready || sending} className="btn-print mt-5 inline-flex min-h-[56px] w-full items-center justify-center gap-2 bg-[#F2B632] px-6 text-[#0C1215] disabled:cursor-not-allowed disabled:opacity-60">
              {sending ? "Sending…" : wants === "visit" ? "Book my quote visit" : "Book my cleaning"}
              {!sending && <ArrowRight className="h-5 w-5" aria-hidden />}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-[#0C1215]/80">
              By submitting, you agree to receive calls and texts about your booking from Rinse It Off. Msg &amp; data rates may apply, frequency varies.
              Reply STOP to opt out, HELP for help. See our <a href="/privacy" className="underline">Privacy Policy</a> and{" "}
              <a href="/terms" className="underline">Terms</a>.
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
