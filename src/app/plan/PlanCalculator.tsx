"use client";
import { useEffect, useMemo, useState } from "react";
import { bookFirstVisit, createDepositInvoice, submitPlanQuote } from "./actions";
import { getFreeSlots } from "../assessment/actions";
import {
  ADD_ONS,
  DEPOSIT_USD,
  MEMBER_MONTHLY_DISCOUNT,
  MEMBER_PREPAID_DISCOUNT,
  MONTHLY_FLOOR,
  WINDOW_VISITS_PER_YEAR,
  addOnPrices,
  priceHouse,
  suggestedAddOns,
  type Access,
  type DrivewaySize,
  type HouseInputs,
  type RoofType,
  type Stories,
} from "./pricing";

// ─── Design tokens (inlined, same source as the assessment page) ──────────────
const DS = `
  @import url("https://use.typekit.net/asf7gwn.css");

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:           #0C1215;
    --blue:          #62C4EB;
    --blue-deep:     #3AA8D4;
    --blue-wash:     #EDF7FC;
    --mint:          #4DFFA6;
    --surface:       #FFFFFF;
    --surface-alt:   #F4F7F8;
    --text-primary:  #0C1215;
    --text-secondary:#4B5C6B;
    --text-muted:    #8C9AA5;
    --border:        #E4ECF1;
    --border-light:  #EFF4F7;
    --font-display: "neue-haas-grotesk-display", system-ui, -apple-system, sans-serif;
    --font-body:    "neue-haas-grotesk-text", system-ui, -apple-system, sans-serif;
    --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px; --r-2xl: 32px;
    --shadow-soft: 0 2px 16px rgba(12,18,21,0.05);
    --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
    --aura-water:
      radial-gradient(120% 120% at 12% 10%, #DDF1FB 0%, transparent 55%),
      radial-gradient(120% 120% at 88% 22%, #E9F6FC 0%, transparent 55%),
      radial-gradient(140% 130% at 55% 100%, #EEF5FB 0%, transparent 60%);
  }

  html { -webkit-font-smoothing: antialiased; }
  body { font-family: var(--font-body); color: var(--text-primary); background: var(--surface); }
  ::selection { background: rgba(77,255,166,0.25); }

  .plan { font-family: var(--font-body); color: var(--text-primary); background: var(--surface); min-height: 100vh; width: 100%; max-width: 100vw; overflow-x: hidden; }
  .plan * { min-width: 0; }
  .plan img, .plan input, .plan select, .plan button { max-width: 100%; }
  .plan-wrap, .plan-card { width: 100%; }
  .plan h1, .plan h2, .plan p, .plan .price-for, .plan .choice { overflow-wrap: anywhere; }
  .plan a:focus-visible, .plan button:focus-visible, .plan input:focus-visible, .plan select:focus-visible {
    outline: 2px solid var(--blue); outline-offset: 2px;
  }

  .plan-header { background: var(--ink); padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .plan-header a.phone { font-family: var(--font-display); font-weight: 600; font-size: 0.9375rem; color: var(--blue); text-decoration: none; white-space: nowrap; }

  .plan-hero { background: var(--aura-water); background-color: var(--surface-alt); padding: 36px 24px 32px; }
  .plan-hero h1 { font-family: var(--font-display); font-weight: 400; font-size: clamp(2rem, 6vw, 3rem); letter-spacing: -0.03em; line-height: 1.0; color: var(--ink); margin-bottom: 14px; text-wrap: balance; }
  .plan-hero h1 .accent { color: var(--blue); font-weight: 500; }
  .plan-hero p { font-size: 1.0625rem; line-height: 1.6; color: var(--text-secondary); max-width: 440px; margin: 0 auto; text-wrap: pretty; }

  .plan-wrap { max-width: 560px; margin: 0 auto; padding: 24px 16px 64px; }
  .plan-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--r-2xl); padding: clamp(22px, 5vw, 40px); box-shadow: var(--shadow-soft); }

  /* Step counter: the one place a small label is allowed. */
  .steps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 28px; }
  .steps .seg { height: 4px; border-radius: 2px; background: var(--border); transition: background 0.3s var(--ease-out-expo); }
  .steps .seg.on { background: var(--blue); }
  .steps .seg.past { background: var(--ink); }
  .steps .name { font-size: 0.8125rem; font-weight: 500; color: var(--text-muted); margin-top: 8px; }
  .steps .name.on { color: var(--ink); }

  .plan h2 { font-family: var(--font-display); font-weight: 500; font-size: clamp(1.5rem, 4.5vw, 1.875rem); letter-spacing: -0.02em; line-height: 1.1; color: var(--ink); margin-bottom: 8px; text-wrap: balance; }
  .plan .lead { font-size: 1rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 24px; text-wrap: pretty; }
  .plan .summary { font-size: 0.875rem; line-height: 1.6; color: var(--text-muted); margin: -2px 0 14px; text-wrap: pretty; }
  .plan .linkish { background: none; border: none; padding: 0; font: inherit; color: var(--blue-deep); text-decoration: underline; cursor: pointer; min-height: 0; }

  .field { margin-bottom: 22px; }
  .field label, .field .q { display: block; font-size: 0.9375rem; font-weight: 500; color: var(--text-primary); margin-bottom: 8px; }
  .field .help { font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin-top: 8px; }
  .field input, .field select {
    width: 100%; min-height: 52px; padding: 12px 14px; border: 2px solid var(--border); border-radius: var(--r-md);
    font-size: 1.0625rem; font-family: var(--font-body); color: var(--ink); background: var(--surface);
    transition: border-color 0.15s; appearance: none; -webkit-appearance: none;
  }
  .field input:focus, .field select:focus { border-color: var(--blue); outline: none; }
  .field select { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234B5C6B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }
  .unit-wrap { position: relative; }
  .unit-wrap .unit { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 0.9375rem; color: var(--text-muted); pointer-events: none; }

  .choices { display: grid; gap: 8px; }
  .choices.cols-3 { grid-template-columns: repeat(3, 1fr); }
  .choice {
    min-height: 52px; padding: 12px 14px; border: 2px solid var(--border); border-radius: var(--r-md);
    background: var(--surface); color: var(--ink); font-family: var(--font-body); font-size: 0.9375rem; font-weight: 400;
    text-align: left; cursor: pointer; transition: border-color 0.15s, background 0.15s; display: flex; align-items: center; gap: 10px; line-height: 1.3;
  }
  .choice.center { justify-content: center; text-align: center; font-family: var(--font-display); font-weight: 600; font-size: 1.0625rem; }
  .choice.on { border-color: var(--blue); background: var(--blue-wash); font-weight: 500; }
  .choice .box { width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--border); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: transparent; }
  .choice.on .box { border-color: var(--blue); background: var(--blue); }
  .choice .sub { display: block; font-size: 0.8125rem; color: var(--text-muted); font-weight: 400; margin-top: 2px; }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 56px; padding: 16px 24px; border: none; border-radius: var(--r-md); font-family: var(--font-display); font-weight: 600; font-size: 1.0625rem; letter-spacing: -0.01em; cursor: pointer; transition: transform 0.2s var(--ease-out-expo), background 0.2s; }
  .btn-ink { background: var(--ink); color: #fff; }
  .btn-ink:hover { background: #1a232a; }
  .btn-ink:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--text-secondary); font-family: var(--font-body); font-weight: 500; font-size: 0.9375rem; min-height: 44px; }
  .btn-ghost:hover { color: var(--ink); }

  .price-big { display: flex; align-items: baseline; gap: 6px; margin: 4px 0 6px; }
  .price-big .num { font-family: var(--font-display); font-weight: 400; font-size: clamp(4rem, 18vw, 6rem); letter-spacing: -0.04em; line-height: 0.95; color: var(--ink); font-variant-numeric: tabular-nums; }
  .price-big .per { font-family: var(--font-body); font-size: 1.125rem; color: var(--text-secondary); }
  .price-for { font-size: 1rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5; }
  .price-for strong { color: var(--ink); font-weight: 500; }

  .strip { background: var(--mint); color: var(--ink); border-radius: var(--r-md); padding: 10px 14px; margin: -12px 0 22px; font-size: 0.875rem; line-height: 1.5; font-weight: 500; text-wrap: pretty; }
  .strip span { font-weight: 400; opacity: 0.75; margin: 0 6px; }

  .toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: var(--surface-alt); border-radius: var(--r-md); padding: 4px; margin: 4px 0 16px; }
  .toggle button { min-height: 48px; border: none; border-radius: 9px; background: transparent; font-family: var(--font-display); font-weight: 600; font-size: 1rem; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .toggle button.on { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-soft); }
  .toggle .tag { font-family: var(--font-body); font-size: 0.75rem; font-weight: 500; color: var(--ink); background: var(--mint); border-radius: var(--r-sm); padding: 2px 7px; }

  .saves { background: var(--mint); color: var(--ink); border-radius: var(--r-lg); padding: 22px 22px; margin: 4px 0 14px; }
  .saves .big { font-family: var(--font-display); font-weight: 500; font-size: clamp(1.5rem, 6vw, 1.875rem); letter-spacing: -0.02em; line-height: 1.15; text-wrap: balance; }
  .saves .more { font-size: 0.9375rem; line-height: 1.5; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(12,18,21,0.18); color: var(--ink); }
  .saves .more strong { font-weight: 500; }

  .covers { background: var(--surface-alt); border-radius: var(--r-lg); padding: 14px 18px; margin-bottom: 14px; }
  .covers ul { list-style: none; display: grid; gap: 6px; }
  .covers li { font-size: 0.9375rem; line-height: 1.45; color: var(--text-primary); display: flex; gap: 10px; align-items: baseline; }
  .covers li::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0; transform: translateY(-2px); }
  .covers li span { color: var(--text-muted); }

  .fine { font-size: 0.875rem; line-height: 1.55; color: var(--text-muted); text-wrap: pretty; }

  details.math { margin: 18px 0 8px; }
  details.math summary { cursor: pointer; font-size: 0.9375rem; font-weight: 500; color: var(--text-secondary); list-style: none; display: flex; align-items: center; gap: 8px; min-height: 44px; }
  details.math summary::-webkit-details-marker { display: none; }
  details.math summary::before { content: ""; width: 8px; height: 8px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(-45deg); transition: transform 0.2s; margin-left: 2px; }
  details.math[open] summary::before { transform: rotate(45deg); }
  .math-line { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: 1px solid var(--border-light); font-size: 0.9375rem; }
  .math-line .l { color: var(--text-primary); }
  .math-line .d { display: block; font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }
  .math-line .a { font-variant-numeric: tabular-nums; color: var(--text-primary); white-space: nowrap; }
  .math-line.total { border-top: 2px solid var(--border); font-weight: 500; }
  .math-line.mint .a, .math-line.mint .l { color: #0a7a4b; }
  .math-line .strike { text-decoration: line-through; color: var(--text-muted); font-weight: 400; margin-right: 8px; }
  .math-line .free { display: inline-block; background: var(--mint); color: var(--ink); border-radius: var(--r-sm); padding: 2px 8px; font-size: 0.8125rem; font-weight: 500; }

  .addon { align-items: flex-start; }
  .addon .box { margin-top: 2px; }
  .addon .body { flex: 1; }
  .addon .title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .addon .pop { font-size: 0.75rem; font-weight: 500; color: var(--ink); background: var(--mint); border-radius: var(--r-sm); padding: 2px 7px; line-height: 1.4; }
  .addon .was { text-decoration: line-through; color: var(--text-muted); margin-right: 6px; }
  .addon .now { color: var(--ink); font-weight: 500; }
  .running { background: var(--blue-wash); border: 2px solid var(--blue); border-radius: var(--r-lg); padding: 12px 16px; margin-top: 14px; font-size: 0.9375rem; line-height: 1.5; color: var(--text-primary); }
  .running strong { font-weight: 500; }

  .reserve { border: 2px solid var(--border); border-radius: var(--r-lg); padding: 18px; margin-bottom: 14px; }
  .reserve h3 { font-family: var(--font-display); font-weight: 500; font-size: 1.125rem; letter-spacing: -0.01em; color: var(--ink); margin-bottom: 6px; }
  .reserve p { font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px; }
  .reserve .ok { background: var(--mint); color: var(--ink); border-radius: var(--r-md); padding: 12px 14px; font-size: 0.9375rem; line-height: 1.5; }
  .reserve a.btn { text-decoration: none; }
  .days { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin: 0 -4px; padding-left: 4px; padding-right: 4px; scrollbar-width: none; }
  .days::-webkit-scrollbar { display: none; }
  .day { flex: 0 0 auto; min-width: 64px; min-height: 60px; border: 2px solid var(--border); border-radius: var(--r-md); background: var(--surface); font-family: var(--font-body); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 8px 6px; }
  .day .dow { font-size: 0.75rem; color: var(--text-muted); }
  .day .dom { font-family: var(--font-display); font-weight: 600; font-size: 1.125rem; color: var(--ink); }
  .day.on { border-color: var(--blue); background: var(--blue-wash); }
  .day:disabled { opacity: 0.35; cursor: not-allowed; }
  .times { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .time { min-height: 44px; padding: 8px 14px; border: 2px solid var(--border); border-radius: var(--r-sm); background: var(--surface); font-family: var(--font-body); font-size: 0.9375rem; color: var(--ink); cursor: pointer; }
  .time.on { border-color: var(--blue); background: var(--ink); color: var(--blue); }

  .error { background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--r-sm); padding: 12px 16px; margin-bottom: 16px; font-size: 0.875rem; color: #b91c1c; line-height: 1.5; }

  .consent { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; margin-top: 12px; text-align: center; }
  .consent a { color: var(--blue-deep); text-decoration: underline; }

  .done { text-align: center; padding: 8px 0; }
  .done .mark { width: 64px; height: 64px; background: var(--blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--ink); }
  .done h2 { font-size: clamp(1.75rem, 6vw, 2.25rem); margin-bottom: 12px; }
  .done p { font-size: 1.0625rem; line-height: 1.6; color: var(--text-secondary); max-width: 420px; margin: 0 auto; text-wrap: pretty; }
  .done p + p { margin-top: 12px; }
  .done .tel { background: var(--ink); border-radius: var(--r-lg); padding: 18px 28px; display: inline-block; margin-top: 28px; }
  .done .tel .k { font-size: 0.8125rem; color: rgba(255,255,255,0.55); margin-bottom: 4px; }
  .done .tel a { font-family: var(--font-display); font-weight: 700; font-size: 1.5rem; color: var(--blue); text-decoration: none; letter-spacing: -0.02em; }

  @media (prefers-reduced-motion: reduce) { .plan * { transition: none !important; } }
`;

const STEP_NAMES = ["House", "Price", "Add-ons", "Claim", "Reserve"];
type Billing = "monthly" | "annual";
const PCT = (d: number) => `${Math.round(d * 100)}%`;
const TZ = "America/Los_Angeles";
const slotTime = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
const slotDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: TZ });
const dayParts = (key: string) => {
  const d = new Date(`${key}T12:00:00`);
  return { dow: d.toLocaleDateString("en-US", { weekday: "short" }), dom: d.getDate() };
};
const DAYS = ["No preference", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="2 6 5 9 10 3" />
    </svg>
  );
}

export default function PlanCalculator({ src }: { src: string }) {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [sqft, setSqft] = useState("");
  const [stories, setStories] = useState<Stories | 0>(0);
  const [windows, setWindows] = useState("");
  const [roof, setRoof] = useState<RoofType>("composition");
  const [driveway, setDriveway] = useState<DrivewaySize>("typical");
  const [access, setAccess] = useState<Access>("easy");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [contact, setContact] = useState({ name: "", phone: "", email: "", bestDay: DAYS[0] });
  const [billing, setBilling] = useState<Billing>("monthly");
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState<{ saved: boolean; contactId?: string } | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  // Step 5: deposit + first visit (both optional).
  const [depositUrl, setDepositUrl] = useState("");
  const [depositBusy, setDepositBusy] = useState(false);
  const [depositErr, setDepositErr] = useState("");
  const [slotMap, setSlotMap] = useState<Record<string, string[]>>({});
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [dayKey, setDayKey] = useState("");
  const [booking, setBooking] = useState("");
  const [bookedISO, setBookedISO] = useState("");
  const [bookErr, setBookErr] = useState("");

  const house: HouseInputs | null = useMemo(() => {
    const s = parseInt(sqft, 10);
    const w = parseInt(windows, 10);
    if (!address.trim() || !(s > 0) || !stories || !(w >= 0) || windows === "") return null;
    return { address: address.trim(), livingSqft: s, stories, windows: w, roof, driveway, access };
  }, [address, sqft, stories, windows, roof, driveway, access]);

  const price = useMemo(() => (house ? priceHouse(house) : null), [house]);

  const toggleAddOn = (k: string) => setAddOns((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const go = (n: number) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!house) return;
    setError("");
    setSending(true);
    const result = await submitPlanQuote({
      house,
      addOns,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      bestDay: contact.bestDay === DAYS[0] ? "" : contact.bestDay,
      billing,
      src,
    });
    setSending(false);
    if (result.success) {
      setSaved({ saved: result.saved, contactId: result.contactId });
      if (result.saved && result.contactId) go(4);
      else { setDone(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
    } else {
      setError(result.error || "Something went wrong. Give it another try, or call or text (503) 704-3755.");
    }
  };

  const chosen = ADD_ONS.filter((a) => addOns.includes(a.key));
  // What the customer pays under the billing they picked, as a short phrase.
  const priceLine = price
    ? billing === "annual"
      ? `$${fmt(price.prepaidMonthlyEquivalent)} a month on a 12-month membership, paid $${fmt(price.prepaidAnnual)} up front`
      : `$${fmt(price.memberMonthly)} a month on a 12-month membership, billed monthly`
    : "";
  const savedLine = price ? `You save $${fmt(price.savedVsAlaCarte + (billing === "annual" ? price.prepaySavesMore : 0))} this year` : "";
  const suggested = useMemo(() => (house ? suggestedAddOns(house) : []), [house]);

  // Real availability for the next 14 days, fetched once the Reserve step opens.
  useEffect(() => {
    if (step !== 4 || slotsLoaded) return;
    const now = Date.now();
    getFreeSlots(now, now + 14 * 24 * 60 * 60 * 1000)
      .then((r) => setSlotMap(r.days))
      .catch(() => setSlotMap({}))
      .finally(() => setSlotsLoaded(true));
  }, [step, slotsLoaded]);

  const dayKeys = Object.keys(slotMap).filter((k) => slotMap[k].length > 0).sort();

  const startDeposit = async () => {
    if (!saved?.contactId || !house) return;
    setDepositErr("");
    setDepositBusy(true);
    const r = await createDepositInvoice({ contactId: saved.contactId, address: house.address, name: contact.name, email: contact.email, phone: contact.phone });
    setDepositBusy(false);
    if (r.ok && r.url) setDepositUrl(r.url);
    else setDepositErr(r.error || "We couldn't open the deposit page just now.");
  };

  const pickSlot = async (iso: string) => {
    if (!saved?.contactId) return;
    setBookErr("");
    setBooking(iso);
    const r = await bookFirstVisit({ contactId: saved.contactId, name: contact.name, startISO: iso });
    setBooking("");
    if (r.ok) setBookedISO(iso);
    else setBookErr(r.error || "That time didn't go through.");
  };

  const finish = () => { setDone(true); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="plan">
      <style dangerouslySetInnerHTML={{ __html: DS }} />

      <header className="plan-header">
        <a href="https://www.rinseitoff.com" style={{ display: "inline-block" }}>
          <img src="/logo-white.png" alt="Rinse It Off" style={{ height: 36, width: "auto" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </a>
        <a className="phone" href="tel:+15037043755">(503) 704-3755</a>
      </header>

      {done && price && house && saved ? (
        <div className="plan-wrap">
          <div className="plan-card done">
            <div className="mark">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2>{depositUrl ? "One step from locked." : "Your price is reserved."}</h2>
            <div className="price-big" style={{ justifyContent: "center" }}>
              <span className="num">${fmt(billing === "annual" ? price.prepaidMonthlyEquivalent : price.memberMonthly)}</span>
              <span className="per">/mo</span>
            </div>
            <p style={{ marginBottom: 16 }}>{billing === "annual" ? `billed $${fmt(price.prepaidAnnual)} once a year` : "billed monthly"} for {house.address}. {savedLine}.</p>
            {!saved.saved ? (
              <p>Our system had trouble saving your details just now. Call or text us and we&apos;ll take the deposit by hand.</p>
            ) : depositUrl ? (
              <p>Your price locks for the full 12 months when the ${DEPOSIT_USD} deposit clears. The deposit page is in your email, and it comes off your first month.</p>
            ) : (
              <p>We&apos;ll text you within one business day to take the ${DEPOSIT_USD} deposit and set your first visit. The price locks when the deposit clears.</p>
            )}
            {saved.saved && bookedISO && <p>Your first visit is booked for {slotDate(bookedISO)} at {slotTime(bookedISO)}. We&apos;ll text you a reminder the day before.</p>}
            {saved.saved && depositUrl && !bookedISO && <p>We&apos;ll text you within one business day to set your first visit.</p>}
            <div className="tel">
              <div className="k">Questions? Call or text</div>
              <a href="tel:+15037043755">(503) 704-3755</a>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="plan-hero">
            <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
              <h1>
                Your monthly price, <span className="accent">custom to your house.</span>
              </h1>
              <p>Answer a few questions and we&apos;ll show you the price for a year of exterior care, windows included.</p>
            </div>
          </div>

          <div className="plan-wrap">
            <div className="plan-card">
              <div className="steps" aria-label={`Step ${step + 1} of 5`}>
                {STEP_NAMES.map((n, i) => (
                  <div key={n}>
                    <div className={`seg ${i === step ? "on" : i < step ? "past" : ""}`} />
                    <div className={`name ${i === step ? "on" : ""}`}>{n}</div>
                  </div>
                ))}
              </div>
              {step >= 1 && price && (
                <div className="strip">
                  You save ${fmt(price.savedVsAlaCarte)} this year<span>·</span>${fmt(price.windowsAnnualValue)} of window cleaning free<span>·</span>prepay and save ${fmt(price.prepaySavesMore)} more
                </div>
              )}

              {step === 0 && (
                <form onSubmit={(e) => { e.preventDefault(); if (house) go(1); }}>
                  <h2>First, the house.</h2>
                  <p className="lead">Rough numbers are fine.</p>

                  <div className="field">
                    <label htmlFor="address">Street address</label>
                    <input id="address" type="text" autoComplete="street-address" placeholder="1234 SE Example St, Portland" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>

                  <div className="field">
                    <label htmlFor="sqft">Living area</label>
                    <div className="unit-wrap">
                      <input id="sqft" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="1,800" value={sqft} onChange={(e) => setSqft(e.target.value.replace(/[^0-9]/g, ""))} required />
                      <span className="unit">sq ft</span>
                    </div>
                    <div className="help">A basic 3-bedroom is usually 1,500 to 2,000.</div>
                  </div>

                  <div className="field">
                    <div className="q">Stories</div>
                    <div className="choices cols-3" role="group" aria-label="Stories">
                      {([1, 2, 3] as Stories[]).map((s) => (
                        <button key={s} type="button" className={`choice center ${stories === s ? "on" : ""}`} onClick={() => setStories(s)} aria-pressed={stories === s}>
                          {s === 3 ? "3+" : s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="windows">Exterior windows</label>
                    <input id="windows" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="14" value={windows} onChange={(e) => setWindows(e.target.value.replace(/[^0-9]/g, ""))} required />
                    <div className="help">Count what you can see from outside.</div>
                  </div>

                  <div className="field">
                    <div className="q">Roof</div>
                    <div className="choices" role="group" aria-label="Roof">
                      {([
                        ["composition", "Composition shingle"],
                        ["shake-steep", "Wood shake or steep pitch"],
                        ["metal-tile", "Metal or tile"],
                      ] as [RoofType, string][]).map(([v, l]) => (
                        <button key={v} type="button" className={`choice ${roof === v ? "on" : ""}`} onClick={() => setRoof(v)} aria-pressed={roof === v}>
                          <span className="box">{roof === v && <Check />}</span>{l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <div className="q">Driveway and walkways</div>
                    <div className="choices" role="group" aria-label="Driveway and walkways">
                      {([
                        ["small", "Small", "Under 800 sq ft"],
                        ["typical", "Typical", "Two cars wide, a path to the door"],
                        ["large", "Large or long", "Three cars, a long drive, lots of paths"],
                      ] as [DrivewaySize, string, string][]).map(([v, l, sub]) => (
                        <button key={v} type="button" className={`choice ${driveway === v ? "on" : ""}`} onClick={() => setDriveway(v)} aria-pressed={driveway === v}>
                          <span className="box">{driveway === v && <Check />}</span>
                          <span>{l}<span className="sub">{sub}</span></span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <div className="q">Getting around the house</div>
                    <div className="choices" role="group" aria-label="Access">
                      {([
                        ["easy", "Easy", "We can walk all the way around"],
                        ["gated-tight", "Gated or tight side yards"],
                        ["steep-ladder", "Steep lot or hard ladder access"],
                      ] as [Access, string, string?][]).map(([v, l, sub]) => (
                        <button key={v} type="button" className={`choice ${access === v ? "on" : ""}`} onClick={() => setAccess(v)} aria-pressed={access === v}>
                          <span className="box">{access === v && <Check />}</span>
                          <span>{l}{sub && <span className="sub">{sub}</span>}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-ink" disabled={!house}>
                    Show my price
                  </button>
                  {!house && (
                    <p className="fine" style={{ textAlign: "center", marginTop: 10 }}>Address, square footage, stories and windows first.</p>
                  )}
                </form>
              )}

              {step === 1 && price && house && (
                <div>
                  <h2>Here&apos;s your number.</h2>
                  <p className="summary">
                    {house.livingSqft.toLocaleString()} sq ft · {house.stories === 3 ? "3+ stories" : house.stories === 2 ? "2 stories" : "1 story"} · {house.windows} windows · {house.roof === "shake-steep" ? "wood shake or steep" : house.roof === "metal-tile" ? "metal or tile" : "composition"} roof · {house.driveway === "large" ? "large" : house.driveway === "small" ? "small" : "typical"} driveway · {house.access === "gated-tight" ? "gated or tight" : house.access === "steep-ladder" ? "steep" : "easy"} access
                    {" "}<button type="button" className="linkish" onClick={() => go(0)}>Edit</button>
                  </p>
                  <div className="toggle" role="group" aria-label="Billing">
                    <button type="button" className={billing === "monthly" ? "on" : ""} onClick={() => setBilling("monthly")} aria-pressed={billing === "monthly"}>Monthly</button>
                    <button type="button" className={billing === "annual" ? "on" : ""} onClick={() => setBilling("annual")} aria-pressed={billing === "annual"}>Annual <span className="tag">save {PCT(MEMBER_PREPAID_DISCOUNT)}</span></button>
                  </div>
                  <div className="price-big">
                    <span className="num">${fmt(billing === "annual" ? price.prepaidMonthlyEquivalent : price.memberMonthly)}</span>
                    <span className="per">/mo</span>
                  </div>
                  <p className="price-for">
                    {billing === "annual"
                      ? <>12-month membership paid up front, ${fmt(price.prepaidAnnual)} for the year, save ${fmt(price.prepaySavesMore)}. For <strong>{house.address}</strong>.</>
                      : <>12-month membership, billed monthly. For <strong>{house.address}</strong>.</>}
                  </p>
                  <p className="fine" style={{ marginBottom: 14 }}>This is your starting price. Our first visit confirms it, and unusual height or access can add to it.</p>

                  <div className="saves">
                    <div className="big">${fmt(price.savedVsAlaCarte)} saved this year, including ${fmt(price.windowsAnnualValue)} of window cleaning free.</div>
                    <div className="more">Prepay the year: save another <strong>${fmt(price.prepaySavesMore)}</strong>, <strong>${fmt(price.prepaidMonthlyEquivalent)} a month</strong>.</div>
                  </div>

                  <div className="covers">
                    <ul>
                      <li>Roof and siding <span>spring</span></li>
                      <li>Driveway and walkways <span>summer</span></li>
                      <li>Gutters <span>fall</span></li>
                      <li>Walkways and steps <span>winter</span></li>
                      <li>Exterior windows, free <span>{WINDOW_VISITS_PER_YEAR} times a year</span></li>
                    </ul>
                  </div>

                  <details className="math">
                    <summary>How we got this number</summary>
                    <div style={{ marginTop: 6 }}>
                      {price.lines.map((l) => (
                        <div className="math-line" key={l.key}>
                          <span className="l">{l.label}<span className="d">{l.detail}</span></span>
                          <span className="a">${fmt(l.amount)}</span>
                        </div>
                      ))}
                      {price.storyMultiplier !== 1 && (
                        <div className="math-line">
                          <span className="l">{house.stories === 3 ? "3 stories" : "2 stories"}<span className="d">Ladder and lift time on a taller house</span></span>
                          <span className="a">${fmt(price.subtotal * (price.storyMultiplier - 1))}</span>
                        </div>
                      )}
                      {price.accessMultiplier !== 1 && (
                        <div className="math-line">
                          <span className="l">{house.access === "gated-tight" ? "Gated or tight side yards" : "Steep lot or hard ladder access"}<span className="d">Extra time to get around the house</span></span>
                          <span className="a">${fmt(price.coreAnnual - price.subtotal * price.storyMultiplier)}</span>
                        </div>
                      )}
                      <div className="math-line total">
                        <span className="l">Booked one at a time</span>
                        <span className="a">${fmt(price.coreAnnual)}</span>
                      </div>
                      <div className="math-line mint">
                        <span className="l">Member price, {PCT(MEMBER_MONTHLY_DISCOUNT)} off{price.memberMonthly === MONTHLY_FLOOR && (price.coreAnnual * (1 - MEMBER_MONTHLY_DISCOUNT)) / 12 < MONTHLY_FLOOR && <span className="d">Our smallest plan is ${MONTHLY_FLOOR} a month</span>}</span>
                        <span className="a">{price.coreAnnual - price.memberAnnual > 0 ? `-$${fmt(price.coreAnnual - price.memberAnnual)}` : "$0"}</span>
                      </div>
                      <div className="math-line">
                        <span className="l">Exterior windows<span className="d">{house.windows} windows · ${fmt(price.windowsPerVisitValue)} a visit · {WINDOW_VISITS_PER_YEAR} visits a year</span></span>
                        <span className="a"><span className="strike">${fmt(price.windowsAnnualValue)}</span><span className="free">Free with the membership</span></span>
                      </div>
                      <div className="math-line total">
                        <span className="l">Your membership year</span>
                        <span className="a">${fmt(price.memberAnnual)}</span>
                      </div>
                      <div className="math-line total">
                        <span className="l">Prepay and save {PCT(MEMBER_PREPAID_DISCOUNT)}</span>
                        <span className="a">${fmt(price.prepaidAnnual)}</span>
                      </div>
                    </div>
                  </details>

                  <div style={{ display: "grid", gap: 8, marginTop: 20 }}>
                    <button type="button" className="btn btn-ink" onClick={() => go(2)}>Next, add-ons</button>
                    <button type="button" className="btn btn-ghost" onClick={() => go(0)}>Change something about the house</button>
                  </div>
                </div>
              )}

              {step === 2 && price && (
                <div>
                  <h2>Anything else while we&apos;re there?</h2>
                  <p className="lead">Members save 10% on every add-on because the crew is already there.</p>

                  <div className="choices" role="group" aria-label="Add-ons">
                    {ADD_ONS.map((a) => {
                      const on = addOns.includes(a.key);
                      const pr = addOnPrices(a);
                      const pop = suggested.includes(a.key);
                      return (
                        <button key={a.key} type="button" className={`choice addon ${on ? "on" : ""}`} onClick={() => toggleAddOn(a.key)} aria-pressed={on}>
                          <span className="box">{on && <Check />}</span>
                          <span className="body">
                            <span className="title">{a.label}{pop && <span className="pop">Popular</span>}</span>
                            <span className="sub">
                              {pr ? (<><span className="was">{pr.list}</span><span className="now">{pr.member}</span> {pr.unit}, measured on site</>) : a.fromNote}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {chosen.length > 0 && (
                    <div className="running">
                      <strong>Added to your quote:</strong>{" "}
                      {chosen.map((a) => { const pr = addOnPrices(a); return pr ? `${a.label} (${pr.member} ${pr.unit})` : a.key === "lights" ? `${a.label} (from $599)` : a.label; }).join(", ")}. Final numbers at your first visit.
                    </div>
                  )}

                  <div style={{ display: "grid", gap: 8, marginTop: 24 }}>
                    <button type="button" className="btn btn-ink" onClick={() => go(3)}>{addOns.length ? "Next, claim my price" : "Skip this, claim my price"}</button>
                    <button type="button" className="btn btn-ghost" onClick={() => go(1)}>Back to my price</button>
                  </div>
                </div>
              )}

              {step === 3 && price && house && (
                <form onSubmit={handleSubmit}>
                  <h2>Reserve your price.</h2>
                  <p className="lead">Tell us who you are and we&apos;ll reserve {priceLine} for {house.address}{chosen.length ? `, plus ${chosen.length} add-on${chosen.length === 1 ? "" : "s"}` : ""}. {savedLine}.</p>

                  <input type="hidden" name="src" value={src} readOnly />

                  <div className="field">
                    <label htmlFor="name">Your name</label>
                    <input id="name" type="text" autoComplete="name" placeholder="Jane Smith" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(503) 555-0100" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
                    <div className="help">We text to set up visits, so a mobile number is best.</div>
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" inputMode="email" autoComplete="email" placeholder="jane@example.com" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label htmlFor="bestDay">Best day of the week for visits (optional)</label>
                    <select id="bestDay" value={contact.bestDay} onChange={(e) => setContact({ ...contact, bestDay: e.target.value })}>
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {error && <div className="error">{error}</div>}

                  <p className="fine" style={{ marginBottom: 12 }}>This is your starting price. Our first visit confirms it, and unusual height or access can add to it.</p>
                  <button type="submit" className="btn btn-ink" disabled={sending || !contact.name || !contact.phone || !contact.email}>
                    {sending ? "Reserving it" : "Reserve my price and free windows"}
                  </button>
                  <p className="consent">
                    By submitting, you agree to receive calls and texts about your quote and visits from Rinse It Off. Msg &amp; data rates may apply, frequency varies. Reply STOP to opt out, HELP for help. See our{" "}
                    <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>.
                  </p>
                  <button type="button" className="btn btn-ghost" onClick={() => go(2)} style={{ marginTop: 4 }}>Back</button>
                </form>
              )}

              {step === 4 && price && house && saved && (
                <div>
                  <h2>Your price is reserved, not locked yet.</h2>
                  <p className="lead">{priceLine} for {house.address}. {savedLine}. It locks for the full 12 months once your ${DEPOSIT_USD} deposit clears.</p>

                  <div className="reserve">
                    <h3>Lock in your price</h3>
                    <p>The ${DEPOSIT_USD} deposit locks your price and your spot on the route, and it comes off your first month.</p>
                    {depositUrl ? (
                      <>
                        <a className="btn btn-ink" href={depositUrl} target="_blank" rel="noopener noreferrer">Open the ${DEPOSIT_USD} deposit page</a>
                        <p className="fine" style={{ marginTop: 10, marginBottom: 0 }}>It&apos;s in your email too. Your price locks when it clears.</p>
                      </>
                    ) : (
                      <button type="button" className="btn btn-ink" onClick={startDeposit} disabled={depositBusy}>
                        {depositBusy ? "Setting it up" : `Lock in your price with a $${DEPOSIT_USD} deposit`}
                      </button>
                    )}
                    {depositErr && <div className="error" style={{ marginTop: 12, marginBottom: 0 }}>{depositErr}</div>}
                  </div>

                  <div className="reserve">
                    <h3>Pick your first visit (optional)</h3>
                    {bookedISO ? (
                      <div className="ok">Booked: {slotDate(bookedISO)} at {slotTime(bookedISO)}.</div>
                    ) : !slotsLoaded ? (
                      <p style={{ marginBottom: 0 }}>Checking the next two weeks.</p>
                    ) : dayKeys.length === 0 ? (
                      <p style={{ marginBottom: 0 }}>Nothing open in the next two weeks. We&apos;ll text you with the first opening.</p>
                    ) : (
                      <>
                        <p>Real openings for the next two weeks. Tap a day, then a time.</p>
                        <div className="days">
                          {dayKeys.map((k) => { const d = dayParts(k); return (
                            <button key={k} type="button" className={`day ${dayKey === k ? "on" : ""}`} onClick={() => setDayKey(k)} aria-pressed={dayKey === k}>
                              <span className="dow">{d.dow}</span><span className="dom">{d.dom}</span>
                            </button>
                          ); })}
                        </div>
                        {dayKey && (
                          <div className="times">
                            {(slotMap[dayKey] || []).map((iso) => (
                              <button key={iso} type="button" className={`time ${booking === iso ? "on" : ""}`} disabled={!!booking} onClick={() => pickSlot(iso)}>
                                {booking === iso ? "Booking" : slotTime(iso)}
                              </button>
                            ))}
                          </div>
                        )}
                        {bookErr && <div className="error" style={{ marginTop: 12, marginBottom: 0 }}>{bookErr}</div>}
                      </>
                    )}
                  </div>

                  <button type="button" className={`btn ${depositUrl ? "btn-ink" : "btn-ghost"}`} onClick={finish}>
                    {depositUrl ? "All set" : "Text me instead"}
                  </button>
                  {!depositUrl && <p className="fine" style={{ textAlign: "center", marginTop: 8 }}>We&apos;ll text you to take the deposit and set your first visit. The price isn&apos;t locked until then.</p>}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
