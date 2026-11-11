"use client";
import { useEffect, useMemo, useState } from "react";
import { track as vaTrack } from "@vercel/analytics";
import { ArrowRight, Check, MessageSquare, Phone } from "lucide-react";
import { getFreeSlots, submitAssessmentForm } from "../assessment/actions";

/** One-time home cleaning: pick what needs cleaning, say where and how big, then either book a
 *  free look at the house or ask for a rough price by text. Same write path into GHL as
 *  /assessment (contact → Residential pipeline → note → appointment), tagged one-time-clean,
 *  so the "Website Lead — Notify Team" workflow alerts the owners like any other web lead. */

const SERVICES = [
  { key: "gutters", label: "Gutters" },
  { key: "roof-moss", label: "Roof moss" },
  { key: "house-wash", label: "House wash (siding)" },
  { key: "driveway", label: "Driveway and walkways" },
  { key: "windows", label: "Windows (outside)" },
  { key: "deck-fence", label: "Deck or fence" },
  { key: "not-sure", label: "Not sure, I'll describe it" },
];
const SIZES = ["Under 1,500 sq ft", "1,500 to 2,500 sq ft", "2,500 to 3,500 sq ft", "Over 3,500 sq ft", "Not sure"];
const STORIES = ["1 story", "2 stories", "3 or more"];
const PHONE = "+19716264146";
const PHONE_DISPLAY = "(971) 626-4146";
const TZ = "America/Los_Angeles";

// "2026-11-12" → "Wed, Nov 12" (built from parts so the browser's zone can't shift the day)
function dayLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: TZ });

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

// The approved minimums (src/lib/quote/minimums.mjs): one service $350, a driveway on its own $500,
// two or more services together have none.
function minimumLine(picked: string[]) {
  const real = picked.filter((k) => k !== "not-sure");
  if (real.length >= 2) return "Two or more services together have no minimum. We confirm the exact price.";
  if (real.length === 1 && real[0] === "driveway") return "A driveway on its own starts at $500. Add another service and that minimum goes away.";
  if (real.length === 1) return "One service on its own starts at $350. Add another and that minimum goes away.";
  return "One service on its own starts at $350 ($500 for a driveway by itself). Two or more together have no minimum. We'll sort out what you need.";
}

const input =
  "w-full rounded-[10px] border-2 border-[#E4DCCD] bg-white px-4 py-3 text-base text-[#0C1215] outline-none transition-colors focus:border-[#1A6E93]";

export default function BookPage() {
  const [src, setSrc] = useState("direct");
  const [picked, setPicked] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [size, setSize] = useState("");
  const [stories, setStories] = useState("");
  const [notes, setNotes] = useState("");
  const [wants, setWants] = useState<"" | "visit" | "text-price">("");
  const [slotMap, setSlotMap] = useState<Record<string, string[]>>({});
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [dayKey, setDayKey] = useState("");
  const [slot, setSlot] = useState("");
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
    if (svc && SERVICES.some((x) => x.key === svc)) setPicked([svc]);
    // runs before the layout's <Analytics /> sets up window.va, so start its queue here (as /plan does)
    const w = window as unknown as { va?: (...a: unknown[]) => void; vaq?: unknown[][] };
    w.va ??= (...a: unknown[]) => { (w.vaq ??= []).push(a); };
    vaTrack("Book visit", { src: s });
  }, []);

  // Real open times on the same calendar /assessment books. GHL rejects ranges over 31 days.
  useEffect(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    Promise.all([getFreeSlots(now, now + 31 * day), getFreeSlots(now + 31 * day, now + 62 * day)])
      .then(([a, b]) => setSlotMap({ ...a.days, ...b.days }))
      .catch(() => setSlotMap({}))
      .finally(() => setSlotsLoaded(true));
  }, []);

  const days = useMemo(() => Object.keys(slotMap).filter((k) => slotMap[k]?.length).sort().slice(0, 21), [slotMap]);
  const toggle = (k: string) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const labels = SERVICES.filter((s) => picked.includes(s.key)).map((s) => s.label);
  const choose = (w: "visit" | "text-price") => { setWants(w); vaTrack("One-time choose", { mode: w, src }); };

  const ready = picked.length > 0 && address.trim() && wants && (wants === "text-price" || slot) && contact.name.trim() && contact.phone.trim();

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
      appointmentTime: wants === "visit" && slot ? timeLabel(slot) : undefined,
      appointmentISO: wants === "visit" ? slot || undefined : undefined,
      source: `Website — One-time cleaning (${wants === "visit" ? "visit booked" : "price by text"}, ${src})`,
      oneTime: { size, stories, wants },
    });
    setSending(false);
    if (result.success) {
      vaTrack("One-time request", { mode: wants, src, services: picked.length });
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(result.error || "Something went wrong. Please call or text us at (971) 626-4146.");
    }
  };

  const first = contact.name.trim().split(" ")[0] || "there";
  const photoText = encodeURIComponent(`Hi, it's ${contact.name.trim() || "me"}. Photos for the one-time cleaning at ${address.trim()}:`);

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
                We&apos;ll see you <strong className="text-[#0C1215]">{longDate(slot)} at {timeLabel(slot)}</strong> at {address.trim()}. We
                walk around the house with you and give you a price that day. You'll get a reminder text before we come.
              </p>
            ) : (
              <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
                We&apos;ll text a rough price to {contact.phone.trim()}, usually within a few hours. If the number works for you, we set a day
                right there in the text.
              </p>
            )}
            <div className="mt-7 rounded-[12px] bg-[#62C4EB]/25 p-5">
              <p className="font-semibold text-[#0C1215]">Have photos of the house?</p>
              <p className="mt-1 text-[#3B4247]">Text them to us. A couple of pictures of the problem spots makes the price a lot closer.</p>
              <a
                href={`sms:${PHONE}?&body=${photoText}`}
                onClick={() => vaTrack("One-time photos", { src })}
                className="btn-print mt-4 inline-flex min-h-[52px] items-center gap-2 bg-[#F2B632] px-6 text-[#0C1215]"
              >
                <MessageSquare className="h-5 w-5" aria-hidden /> Text us photos
              </a>
            </div>
            <p className="mt-6 text-[15px] text-[#3B4247]">
              Want the outside of the house handled every season instead?{" "}
              <a href="/plan?src=book-done" className="font-semibold text-[#0C1215] underline">See the yearly plan price</a>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-retro-paper pb-28 pt-28 md:pb-24 md:pt-36">
      <div className="container-site max-w-2xl">
        <p className="label-caps !tracking-[0.14em] text-[#1A6E93]">One-time cleaning</p>
        <h1 className="mt-3 text-[2.6rem] leading-[0.98] text-[#0C1215] [text-wrap:balance] md:text-[3.6rem]">
          Book one cleaning. <span className="offer-accent">No plan needed.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[#3B4247]">
          Tell us what needs cleaning and where. Then book a free quote visit, or ask for a rough price by text.
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
                <Chip key={s.key} on={picked.includes(s.key)} onClick={() => toggle(s.key)}>{s.label}</Chip>
              ))}
            </div>
            {picked.length > 0 && (
              <p className="mt-4 rounded-[10px] bg-[#62C4EB]/25 p-3 text-[15px] leading-snug text-[#0C1215]">{minimumLine(picked)}</p>
            )}
          </Step>

          <Step n={2} title="Tell us about the house">
            <label htmlFor="address" className="block text-[15px] font-semibold text-[#0C1215]">Address</label>
            <input id="address" className={`${input} mt-2`} autoComplete="street-address" placeholder="1234 SE Main St, Portland" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <p className="mt-5 text-[15px] font-semibold text-[#0C1215]">About how big is it?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SIZES.map((s) => <Chip key={s} on={size === s} onClick={() => setSize(size === s ? "" : s)}>{s}</Chip>)}
            </div>
            <p className="mt-5 text-[15px] font-semibold text-[#0C1215]">How many stories?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {STORIES.map((s) => <Chip key={s} on={stories === s} onClick={() => setStories(stories === s ? "" : s)}>{s}</Chip>)}
            </div>
            <label htmlFor="notes" className="mt-5 block text-[15px] font-semibold text-[#0C1215]">
              {picked.includes("not-sure") ? "What are you seeing?" : <>Anything we should know? <span className="font-normal text-[#5F676C]">(optional)</span></>}
            </label>
            <textarea id="notes" rows={3} className={`${input} mt-2`} placeholder={picked.includes("not-sure") ? "Green streaks on the roof, a black film on the siding" : "Both sides of a duplex, a steep backyard, a gate code"} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Step>

          <Step n={3} title="How do you want your price?">
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ["visit", "Book a free quote visit", "We come look, about 45 minutes, and give you a price that day. The cleaning itself gets its own day."],
                ["text-price", "Text me a rough price", "From what you told us here. Photos make it closer, and it can change once we see the house."],
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
                  <p className="mt-2 text-[15px] text-[#5F676C]">Loading open times…</p>
                ) : days.length === 0 ? (
                  <p className="mt-2 text-[15px] text-[#3B4247]">
                    We couldn&apos;t load the calendar just now. Choose &ldquo;Text me a rough price&rdquo; and we&apos;ll set a time by text, or call {PHONE_DISPLAY}.
                  </p>
                ) : (
                  <>
                    <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-2">
                      {days.map((k) => (
                        <Chip key={k} on={dayKey === k} onClick={() => { setDayKey(k); setSlot(""); }}>
                          <span className="whitespace-nowrap">{dayLabel(k)}</span>
                        </Chip>
                      ))}
                    </div>
                    {dayKey && (
                      <>
                        <p className="mt-4 text-[15px] font-semibold text-[#0C1215]">Pick a time</p>
                        <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2">
                          {(slotMap[dayKey] || []).map((iso) => (
                            <Chip key={iso} on={slot === iso} onClick={() => setSlot(iso)}>
                              <span className="w-full whitespace-nowrap text-center">{timeLabel(iso)}</span>
                            </Chip>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </Step>

          <Step n={4} title={wants === "text-price" ? "Where should we text the price?" : "Where should we confirm it?"}>
            <div className="grid gap-4">
              <div>
                <label htmlFor="name" className="block text-[15px] font-semibold text-[#0C1215]">First and last name</label>
                <input id="name" className={`${input} mt-2`} autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[15px] font-semibold text-[#0C1215]">Mobile number</label>
                <input id="phone" type="tel" inputMode="tel" className={`${input} mt-2`} autoComplete="tel" placeholder="(503) 555-0100" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="email" className="block text-[15px] font-semibold text-[#0C1215]">
                  Email <span className="font-normal text-[#5F676C]">(optional)</span>
                </label>
                <input id="email" type="email" className={`${input} mt-2`} autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
              </div>
            </div>
          </Step>

          {/* What they're asking for, in one place, right above the button */}
          <div className="frame bg-[#62C4EB] p-5 text-[#0C1215] md:p-7">
            <p className="label-caps !tracking-[0.14em]">Your cleaning</p>
            <p className="mt-2 text-[17px] font-semibold">{labels.length ? labels.join(", ") : "Pick what needs cleaning above"}</p>
            {(size || stories) && <p className="mt-1 text-[15px]">{[size, stories].filter(Boolean).join(", ")}</p>}
            <p className="mt-1 text-[15px]">
              {wants === "visit"
                ? slot ? `Free quote visit, ${longDate(slot)} at ${timeLabel(slot)}` : "Free quote visit: pick a day and time above"
                : wants === "text-price" ? "Rough price by text" : ""}
            </p>

            {error && <p className="mt-4 rounded-[10px] bg-white p-3 text-[15px] text-[#B42318]">{error}</p>}
            <button type="submit" disabled={!ready || sending} className="btn-print mt-5 inline-flex min-h-[56px] w-full items-center justify-center gap-2 bg-[#F2B632] px-6 text-[#0C1215] disabled:cursor-not-allowed disabled:opacity-60">
              {sending ? "Sending…" : wants === "text-price" ? "Text me a price" : "Book my quote visit"}
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
          Want it handled every season instead?{" "}
          <a href="/plan?src=book" className="font-semibold text-[#0C1215] underline">See the yearly plan</a>.
        </p>
        <p className="mt-4 flex items-center gap-2 text-[15px] text-[#3B4247] md:hidden">
          <Phone className="h-4 w-4" aria-hidden /> <a href={`tel:${PHONE}`} className="font-semibold text-[#0C1215]">{PHONE_DISPLAY}</a>
        </p>
      </div>
    </section>
  );
}
