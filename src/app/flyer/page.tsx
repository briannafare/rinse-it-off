"use client";

import { useState } from "react";
import Image from "next/image";

// ─── Constants ───────────────────────────────────────────────────────────────

const COMMERCIAL_SERVICES = [
  "Building Exterior Wash",
  "Parking Lot & Concrete",
  "Storefront & Entry Cleaning",
  "Roof & Gutter Cleaning",
  "HOA / Multi-Unit Properties",
  "Recurring Maintenance Plan",
];

const RESIDENTIAL_SERVICES = [
  "House Washing",
  "Roof & Gutter Cleaning",
  "Driveway & Sidewalks",
  "Deck & Fence Restoration",
  "Window Washing",
  "Patio & Outdoor Living",
];

const TIME_SLOTS = ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function calDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function isDisabled(year: number, month: number, day: number): boolean {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today || date.getDay() === 0;
}

function formatDate(year: number, month: number, day: number): string {
  return new Date(year, month, day).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FlyerPage() {
  const today = new Date();

  // Form state
  const [propertyType, setPropertyType] = useState<"commercial" | "residential" | "">("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", message: "" });

  // Calendar state
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");

  // Submit state
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const services = propertyType === "commercial" ? COMMERCIAL_SERVICES : propertyType === "residential" ? RESIDENTIAL_SERVICES : [];
  const days = calDays(calYear, calMonth);
  const prevMonthDisabled = calYear === today.getFullYear() && calMonth === today.getMonth();
  const apptLabel = selectedDay
    ? `${formatDate(calYear, calMonth, selectedDay)}${selectedTime ? ` at ${selectedTime}` : ""}`
    : "";

  function toggleService(s: string) {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
    setSelectedDay(null); setSelectedTime("");
  }

  function nextMonth() {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
    setSelectedDay(null); setSelectedTime("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── Success state ──────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-brand-black px-6 py-5">
          <div className="max-w-2xl mx-auto">
            <Image src="/logo-white.png" alt="Rinse It Off" width={120} height={36} className="h-8 w-auto" />
          </div>
        </header>

        {/* Success body */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-md w-full text-center">
            {/* Check circle */}
            <div className="w-16 h-16 rounded-full bg-brand-mint flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0C1215" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="font-display text-3xl font-semibold text-text-primary tracking-tight mb-3">
              You&apos;re all set, {form.name.split(" ")[0] || "friend"}.
            </h1>

            {apptLabel ? (
              <>
                <p className="text-text-secondary text-base leading-relaxed mb-5">
                  We&apos;ll see you on-site for your <strong className="text-text-primary">Free Property Assessment</strong> on:
                </p>
                <div className="inline-block border-2 border-brand-mint rounded-2xl px-6 py-4 bg-surface-mint mb-5">
                  <p className="font-display font-semibold text-text-primary text-base">{apptLabel}</p>
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-8">
                  We&apos;ll also send your written quote to <strong className="text-text-secondary">{form.email || "your email"}</strong>. We&apos;ll confirm the walkthrough time by phone or text before the visit.
                </p>
              </>
            ) : (
              <p className="text-text-secondary text-base leading-relaxed mb-8">
                We received your request and will send a written quote to{" "}
                <strong className="text-text-primary">{form.email || "your email"}</strong> within a few hours. No phone call needed unless you want one.
              </p>
            )}

            {/* Contact card */}
            <div className="bg-brand-black rounded-2xl px-6 py-5 inline-block">
              <p className="text-white/50 text-xs font-medium mb-1">Questions? Call or text</p>
              <a href="tel:5037043755" className="text-brand-mint font-display font-bold text-2xl tracking-tight no-underline">
                (503) 704-3755
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ── */}
      <header className="bg-brand-black px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Image src="/logo-white.png" alt="Rinse It Off" width={120} height={36} className="h-8 w-auto" />
          <a href="tel:5037043755" className="text-brand-mint font-display font-semibold text-sm tracking-tight">
            (503) 704-3755
          </a>
        </div>
      </header>

      {/* ── Hero strip ── */}
      <div className="bg-brand-black px-6 pt-8 pb-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-brand-blue text-sm font-medium mb-3">Portland, OR · Licensed &amp; Insured</p>
          <h1 className="font-display text-display-lg font-semibold text-white leading-tight tracking-tight mb-4">
            Get a free on-site<br />
            <span className="text-brand-blue">property assessment.</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-lg">
            We walk your property, identify every surface that needs attention, and hand you a written quote. No charge, no commitment, no surprises.
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="flex-1 bg-surface-alt px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-soft-md p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate>

              {/* ── Step 1: Property type ── */}
              <div className="mb-8">
                <p className="text-xs font-medium text-text-muted mb-3">Step 1 of 3</p>
                <h2 className="font-display text-display-sm font-semibold text-text-primary mb-4">
                  What type of property?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {(["commercial", "residential"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setPropertyType(t); setSelectedServices([]); }}
                      className={[
                        "py-4 px-4 rounded-2xl border-2 text-sm font-semibold font-display transition-all duration-200 text-left",
                        propertyType === t
                          ? "border-brand-mint bg-brand-black text-white"
                          : "border-border bg-white text-text-primary hover:border-brand-blue",
                      ].join(" ")}
                    >
                      <span className="block text-base mb-0.5">
                        {t === "commercial" ? "Commercial" : "Residential"}
                      </span>
                      <span className={["text-xs font-normal", propertyType === t ? "text-white/60" : "text-text-muted"].join(" ")}>
                        {t === "commercial" ? "Office, retail, HOA, multi-unit" : "House, condo, townhome"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {propertyType && (
                <>
                  {/* ── Step 2: Services ── */}
                  <div className="mb-8">
                    <p className="text-xs font-medium text-text-muted mb-3">Step 2 of 3</p>
                    <h2 className="font-display text-display-sm font-semibold text-text-primary mb-1">
                      What needs cleaning?
                    </h2>
                    <p className="text-text-muted text-sm mb-4">Select all that apply.</p>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((s) => {
                        const active = selectedServices.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleService(s)}
                            className={[
                              "py-3 px-3.5 rounded-xl border-2 text-sm text-left transition-all duration-150 font-body",
                              active
                                ? "border-brand-mint bg-surface-mint text-text-primary font-medium"
                                : "border-border bg-white text-text-secondary hover:border-brand-blue",
                            ].join(" ")}
                          >
                            <span className={["mr-2 text-xs", active ? "text-brand-mint" : "text-border"].join(" ")}>■</span>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Step 3: Contact info ── */}
                  <div className="mb-8">
                    <p className="text-xs font-medium text-text-muted mb-3">Step 3 of 3</p>
                    <h2 className="font-display text-display-sm font-semibold text-text-primary mb-4">
                      Your contact info
                    </h2>
                    <div className="grid gap-4">
                      {[
                        { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith", required: true },
                        { key: "phone", label: "Phone Number", type: "tel", placeholder: "(503) 555-0100", required: true },
                        { key: "email", label: "Email Address", type: "email", placeholder: "jane@company.com", required: true },
                        { key: "address", label: "Property Address", type: "text", placeholder: "1234 NE Broadway, Portland, OR", required: false },
                      ].map(({ key, label, type, placeholder, required }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-text-primary mb-1.5">
                            {label}
                            {required && <span className="text-brand-mint ml-1">*</span>}
                          </label>
                          <input
                            type={type}
                            placeholder={placeholder}
                            required={required}
                            value={form[key as keyof typeof form]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-text-primary text-sm font-body placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors duration-150"
                          />
                        </div>
                      ))}

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          Anything else we should know?
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe the surfaces, any problem areas, or questions you have..."
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-text-primary text-sm font-body placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors duration-150 resize-y"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Optional: Schedule ── */}
                  <div className="mb-8">
                    <h2 className="font-display text-display-sm font-semibold text-text-primary mb-1">
                      Schedule your assessment
                    </h2>
                    <p className="text-text-muted text-sm mb-4">
                      Optional — pick a day and we&apos;ll confirm the time. Or skip and we&apos;ll reach out to find a time that works.
                    </p>

                    <div className="border-2 border-border rounded-2xl overflow-hidden">
                      {/* Month nav */}
                      <div className="bg-brand-black px-5 py-3.5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={prevMonth}
                          disabled={prevMonthDisabled}
                          className="text-white/60 disabled:text-white/20 hover:text-white transition-colors text-xl leading-none px-2 py-1"
                        >
                          ‹
                        </button>
                        <span className="font-display font-semibold text-white text-sm">
                          {MONTHS[calMonth]} {calYear}
                        </span>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="text-white/60 hover:text-white transition-colors text-xl leading-none px-2 py-1"
                        >
                          ›
                        </button>
                      </div>

                      {/* Day-of-week headers */}
                      <div className="grid grid-cols-7 bg-surface-alt border-b border-border">
                        {DOW.map((d) => (
                          <div key={d} className={["text-center py-2 text-xs font-semibold", d === "Sun" ? "text-border" : "text-text-muted"].join(" ")}>
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1 p-2 bg-surface-alt">
                        {days.map((d, i) => {
                          if (d === null) return <div key={`e${i}`} />;
                          const dis = isDisabled(calYear, calMonth, d);
                          const sel = selectedDay === d;
                          const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && d === today.getDate();
                          return (
                            <button
                              key={d}
                              type="button"
                              disabled={dis}
                              onClick={() => { setSelectedDay(d); setSelectedTime(""); }}
                              className={[
                                "aspect-square rounded-xl text-sm transition-all duration-150 font-body",
                                sel ? "bg-brand-black text-brand-mint font-semibold border-2 border-brand-mint" :
                                  dis ? "text-border cursor-not-allowed" :
                                    isToday ? "bg-surface-mint text-text-primary font-medium border-2 border-transparent hover:border-brand-blue" :
                                      "bg-white text-text-primary border-2 border-transparent hover:border-brand-blue",
                              ].join(" ")}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>

                      {/* Time slots */}
                      {selectedDay !== null && (
                        <div className="border-t border-border px-4 py-4 bg-white">
                          <p className="text-xs font-medium text-text-muted mb-3">
                            Available times — {MONTHS[calMonth]} {selectedDay}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {TIME_SLOTS.map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setSelectedTime(v)}
                                className={[
                                  "px-4 py-2 rounded-xl text-sm border-2 transition-all duration-150 font-body",
                                  selectedTime === v
                                    ? "bg-brand-black text-brand-mint border-brand-mint font-semibold"
                                    : "bg-white text-text-secondary border-border hover:border-brand-blue",
                                ].join(" ")}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Confirmation banner */}
                      {selectedDay !== null && selectedTime && (
                        <div className="border-t-2 border-brand-mint bg-surface-mint px-4 py-3 flex items-center gap-3">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <div>
                            <p className="font-display font-semibold text-text-primary text-sm">Assessment Requested</p>
                            <p className="text-text-secondary text-xs">{formatDate(calYear, calMonth, selectedDay)} at {selectedTime}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-text-muted text-xs mt-2 text-center">
                      Prefer to skip? We&apos;ll still send your written quote — scheduling is optional.
                    </p>
                  </div>

                  {/* ── Submit ── */}
                  <button
                    type="submit"
                    disabled={sending || !form.name || !form.phone || !form.email}
                    className={[
                      "w-full py-4 rounded-2xl font-display font-bold text-base transition-all duration-200",
                      sending || !form.name || !form.phone || !form.email
                        ? "bg-border text-text-muted cursor-not-allowed"
                        : "bg-brand-mint text-brand-black hover:brightness-105 shadow-glow-mint",
                    ].join(" ")}
                  >
                    {sending ? "Sending your request…" : apptLabel ? "Book My Assessment →" : "Get My Free Quote →"}
                  </button>
                  <p className="text-text-muted text-xs text-center mt-3">
                    No spam. No sales pressure. We&apos;ll respond within a few hours.
                  </p>
                </>
              )}
            </form>
          </div>

          {/* ── Trust row ── */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Licensed & Insured", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { label: "Same-Day Response", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Free Assessment", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
            ].map(({ label, icon }) => (
              <div key={label} className="bg-white rounded-2xl px-3 py-4 text-center shadow-soft border border-border-light">
                <svg className="w-5 h-5 text-brand-blue mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                <p className="text-text-secondary text-xs font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Footer note ── */}
          <p className="text-center text-text-muted text-xs mt-6">
            Rinse It Off · Portland, OR ·{" "}
            <a href="tel:5037043755" className="text-brand-blue hover:text-brand-blue-dark transition-colors">
              (503) 704-3755
            </a>{" "}
            ·{" "}
            <a href="mailto:hello@rinseitoff.com" className="text-brand-blue hover:text-brand-blue-dark transition-colors">
              hello@rinseitoff.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
