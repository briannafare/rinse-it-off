"use client";
import { useState } from "react";
import { submitAssessmentForm, type AssessmentFormData } from "./actions";

// ─── Constants ────────────────────────────────────────────────────────────────
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
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return date < today || date.getDay() === 0;
}
function fmtDate(year: number, month: number, day: number): string {
  return new Date(year, month, day).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

// ─── Design tokens (inlined — independent of site globals) ───────────────────
const DS = `
  @import url("https://use.typekit.net/asf7gwn.css");

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:          #0C1215;
    --ink-soft:     #0E1419;
    --blue:         #62C4EB;
    --blue-deep:    #3AA8D4;
    --blue-wash:    #EDF7FC;
    --mint:         #4DFFA6;
    --mint-wash:    #f0fff8;
    --surface:      #FFFFFF;
    --surface-alt:  #F4F7F8;
    --text-primary: #0C1215;
    --text-secondary:#4B5C6B;
    --text-muted:   #8C9AA5;
    --border:       #E4ECF1;
    --border-light: #EFF4F7;
    --font-display: "neue-haas-grotesk-display", system-ui, -apple-system, sans-serif;
    --font-body:    "neue-haas-grotesk-text", system-ui, -apple-system, sans-serif;
    --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px; --r-2xl: 32px;
    --shadow-soft: 0 2px 16px rgba(12,18,21,0.05);
    --shadow-card-hover: 0 4px 12px rgba(12,18,21,0.06), 0 22px 50px rgba(12,18,21,0.09);
    --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
    --aura-water:
      radial-gradient(120% 120% at 12% 10%, #DDF1FB 0%, transparent 55%),
      radial-gradient(120% 120% at 88% 22%, #E9FBF3 0%, transparent 55%),
      radial-gradient(140% 130% at 55% 100%, #EEF5FB 0%, transparent 60%);
    --soap-cyan: rgba(120,232,255,1); --soap-mint: rgba(122,255,206,1);
    --soap-lav:  rgba(190,168,255,1); --soap-rose: rgba(255,158,214,1);
    --soap-gold: rgba(255,214,138,1);
  }

  html { -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
  body { font-family: var(--font-body); color: var(--text-primary); background: var(--surface); }
  ::selection { background: rgba(77,255,166,0.25); }

  /* ── Liquid-glass CTA ─────────────────────────────────────────────────── */
  @keyframes bp-rim {
    0%   { background-position: 0% 50%, 0% 50%; }
    100% { background-position: 0% 50%, 200% 50%; }
  }
  @keyframes bp-sweep {
    0%      { transform: translateX(-240%) skewX(-15deg); }
    55%,100%{ transform: translateX(360%)  skewX(-15deg); }
  }
  .btn-glass {
    position: relative; isolation: isolate; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    padding: 1rem 2rem; width: 100%;
    font-family: var(--font-display); font-size: 1rem; font-weight: 600;
    letter-spacing: -0.01em; line-height: 1; white-space: nowrap;
    text-decoration: none; cursor: pointer; appearance: none;
    color: var(--ink); text-shadow: 0 1px 0 rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.8);
    border-radius: 999px;
    -webkit-backdrop-filter: blur(6px) saturate(1.5) brightness(1.1);
            backdrop-filter: blur(6px) saturate(1.5) brightness(1.1);
    background:
      radial-gradient(95% 70% at 50% -12%, rgba(255,255,255,0.9), rgba(255,255,255,0.28) 40%, transparent 68%),
      radial-gradient(40% 56% at 22% 30%, rgba(122,255,206,0.16), transparent 64%),
      radial-gradient(44% 60% at 80% 26%, rgba(255,214,138,0.13), transparent 64%),
      radial-gradient(46% 64% at 80% 80%, rgba(190,168,255,0.16), transparent 66%),
      linear-gradient(180deg, rgba(255,255,255,0.20), rgba(238,248,255,0.12));
    background-color: rgba(255,255,255,0.16);
    box-shadow:
      inset 0 2px 2px rgba(255,255,255,1),
      inset 0 0 0 1px rgba(255,255,255,0.30),
      inset 0 10px 18px -10px rgba(255,255,255,0.9),
      inset 0 -16px 26px -12px rgba(40,80,110,0.30),
      inset 0 -2px 3px rgba(255,255,255,0.6),
      0 6px 14px -4px rgba(20,45,60,0.16),
      0 20px 38px -14px rgba(20,45,60,0.20),
      14px 22px 40px -20px rgba(150,210,255,0.26);
    transition: transform 0.3s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo);
  }
  .btn-glass::before {
    content: ""; position: absolute; inset: 0; z-index: 1; border-radius: inherit; padding: 1.5px;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,0.18) 28%, transparent 55%, rgba(255,255,255,0.5) 100%),
      linear-gradient(110deg,
        rgba(150,235,255,0.6) 0%, rgba(150,255,210,0.4) 18%, rgba(190,168,255,0.45) 40%,
        rgba(255,170,210,0.4) 60%, rgba(255,214,150,0.45) 80%, rgba(150,235,255,0.5) 100%);
    background-size: 100% 100%, 200% 100%;
    background-blend-mode: screen;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    opacity: 0.7;
    animation: bp-rim 16s linear infinite;
  }
  .btn-glass::after {
    content: ""; position: absolute; top: -40%; bottom: -40%; left: 0; width: 38%;
    z-index: 1; pointer-events: none;
    background: linear-gradient(100deg, transparent 0%,
      rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.85) 50%,
      rgba(255,255,255,0.45) 60%, transparent 100%);
    filter: blur(5px); mix-blend-mode: screen;
    transform: translateX(-240%) skewX(-15deg);
    animation: bp-sweep 7s cubic-bezier(0.55, 0, 0.3, 1) infinite;
  }
  .btn-glass:hover::after { animation-duration: 2.8s; }
  .btn-glass > * { position: relative; z-index: 2; }
  .btn-glass:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow:
      inset 0 2px 2px rgba(255,255,255,1),
      inset 0 0 0 1px rgba(255,255,255,0.42),
      inset 0 10px 18px -10px rgba(255,255,255,1),
      inset 0 -16px 28px -12px rgba(40,80,110,0.34),
      inset 0 -2px 3px rgba(255,255,255,0.7),
      0 10px 20px -4px rgba(20,45,60,0.20),
      0 28px 50px -14px rgba(20,45,60,0.26),
      18px 28px 50px -20px rgba(150,210,255,0.34);
  }
  .btn-glass:disabled {
    opacity: 0.5; cursor: not-allowed; transform: none;
    animation: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-glass::before, .btn-glass::after { animation: none; }
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const today = new Date();
  const [propertyType, setPropertyType] = useState<"commercial" | "residential" | "">("");
  const [services, setServices] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", message: "" });
  const [cy, setCy] = useState(today.getFullYear());
  const [cm, setCm] = useState(today.getMonth());
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const serviceList = propertyType === "commercial" ? COMMERCIAL_SERVICES : propertyType === "residential" ? RESIDENTIAL_SERVICES : [];
  const toggleService = (s: string) => setServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const days = calDays(cy, cm);
  const prevDisabled = cy === today.getFullYear() && cm === today.getMonth();
  const prevMonth = () => { if (cm === 0) { setCy(cy - 1); setCm(11); } else setCm(cm - 1); setDay(null); setTime(""); };
  const nextMonth = () => { if (cm === 11) { setCy(cy + 1); setCm(0); } else setCm(cm + 1); setDay(null); setTime(""); };
  const apptLabel = day ? `${fmtDate(cy, cm, day)}${time ? ` at ${time}` : ""}` : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const payload: AssessmentFormData = {
      propertyType,
      services,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      message: form.message,
      appointmentDate: day ? fmtDate(cy, cm, day) : undefined,
      appointmentTime: time || undefined,
    };
    const result = await submitAssessmentForm(payload);
    setSending(false);
    if (result.success) {
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (sent) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: DS }} />
        <div style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "var(--mint)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", color: "var(--ink)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.75rem, 5vw, 2.5rem)", color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.05 }}>
            We&apos;ll be in touch, {form.name.split(" ")[0] || "there"}.
          </h2>
          {apptLabel ? (
            <>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", fontSize: "1.0625rem", lineHeight: 1.6, maxWidth: 440, margin: "0 auto 24px" }}>
                Your free site assessment has been requested for:
              </p>
              <div style={{ display: "inline-block", border: "2px solid var(--mint)", borderRadius: "var(--r-lg)", padding: "14px 28px", background: "var(--mint-wash)", marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.0625rem", color: "var(--ink)" }}>{apptLabel}</div>
              </div>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: 400, margin: "0 auto 36px" }}>
                We&apos;ll confirm by phone or text before the visit{form.email ? `. Confirmation will be sent to ${form.email}` : ""}.
              </p>
            </>
          ) : (
            <p style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", fontSize: "1.0625rem", lineHeight: 1.6, maxWidth: 420, margin: "0 auto 36px" }}>
              We received your request and will be in touch within a few hours to schedule your free on-site walkthrough{form.email ? ` — confirmation to ${form.email}` : ""}.
            </p>
          )}
          <div style={{ background: "var(--ink)", borderRadius: "var(--r-lg)", padding: "20px 32px", display: "inline-block" }}>
            <div style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.55)", fontSize: "0.8125rem", letterSpacing: "0.04em", marginBottom: 6 }}>Questions? Call or text</div>
            <a href="tel:5037768367" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--mint)", textDecoration: "none", letterSpacing: "-0.02em" }}>(503) 776-8367</a>
          </div>
        </div>
      </>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DS }} />

      {/* Header */}
      <header style={{ background: "var(--ink)", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <a href="https://www.rinseitoff.com" style={{ display: "inline-block" }}><img src="/logo-white.png" alt="Rinse It Off" style={{ height: 36, width: "auto" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /></a>
        <a href="tel:5037768367" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--mint)", textDecoration: "none", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          (503) 776-8367
        </a>
      </header>

      {/* Hero strip */}
      <div style={{ background: "var(--aura-water)", backgroundColor: "var(--surface-alt, #F4F7F8)", padding: "40px 24px 36px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: 12 }}>Portland, OR · Licensed &amp; Insured</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 6vw, 3rem)", color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: 16 }}>
            Get a free on-site<br /><span style={{ color: "var(--blue)", fontWeight: 500 }}>property assessment.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", fontSize: "1.0625rem", lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
            We come to you, walk the property, and put together a detailed assessment of what needs attention. No charge, no commitment.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px 64px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-light)", borderRadius: "var(--r-2xl)", padding: "clamp(24px, 5vw, 40px)", boxShadow: "var(--shadow-soft)" }}>
          <form onSubmit={handleSubmit}>

            {/* Step 1 — Property type */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: 10 }}>What type of property?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(["commercial", "residential"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => { setPropertyType(t); setServices([]); }}
                    style={{
                      padding: "14px 16px", border: propertyType === t ? "2px solid var(--mint)" : "2px solid var(--border)",
                      borderRadius: "var(--r-md)", background: propertyType === t ? "var(--ink)" : "var(--surface)",
                      color: propertyType === t ? "#fff" : "var(--ink)",
                      fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9375rem",
                      textTransform: "capitalize", cursor: "pointer", transition: "all 0.15s",
                    }}>
                    {t === "commercial" ? "Commercial" : "Residential"}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Services */}
            {propertyType && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: 10 }}>
                  What needs cleaning? <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(select all that apply)</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {serviceList.map((s) => {
                    const on = services.includes(s);
                    return (
                      <button key={s} type="button" onClick={() => toggleService(s)}
                        style={{
                          padding: "10px 13px", border: on ? "2px solid var(--mint)" : "2px solid var(--border)",
                          borderRadius: "var(--r-sm)", background: on ? "var(--mint-wash)" : "var(--surface)",
                          color: "var(--ink)", fontFamily: "var(--font-body)", fontWeight: on ? 600 : 400,
                          fontSize: "0.875rem", textAlign: "left", cursor: "pointer", transition: "all 0.15s",
                          display: "flex", alignItems: "center", gap: 8,
                        }}>
                        <span style={{ width: 14, height: 14, borderRadius: 3, border: on ? "none" : "2px solid var(--border)", background: on ? "var(--mint)" : "transparent", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                          {on && <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3"/></svg>}
                        </span>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3 — Contact info */}
            {propertyType && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: 10 }}>Your contact info</div>
                <div style={{ display: "grid", gap: 12 }}>
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith", required: true },
                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "(503) 555-0100", required: true },
                    { key: "email", label: "Email Address", type: "email", placeholder: "jane@company.com", required: false },
                    { key: "address", label: "Property Address", type: "text", placeholder: "1234 NE Broadway, Portland, OR", required: false },
                  ].map(({ key, label, type, placeholder, required }) => (
                    <div key={key}>
                      <label style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                        {label}{required && <span style={{ color: "var(--blue)" }}> *</span>}
                      </label>
                      <input
                        type={type} placeholder={placeholder} required={required}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        style={{
                          width: "100%", padding: "11px 14px", border: "2px solid var(--border)",
                          borderRadius: "var(--r-sm)", fontSize: "0.9375rem",
                          fontFamily: "var(--font-body)", color: "var(--ink)", outline: "none",
                          transition: "border-color 0.15s", background: "var(--surface)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Anything else we should know?</label>
                    <textarea
                      placeholder="Describe the surfaces, any problem areas, or questions you have..."
                      rows={3} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{
                        width: "100%", padding: "11px 14px", border: "2px solid var(--border)",
                        borderRadius: "var(--r-sm)", fontSize: "0.9375rem",
                        fontFamily: "var(--font-body)", color: "var(--ink)", outline: "none",
                        transition: "border-color 0.15s", resize: "vertical", background: "var(--surface)",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Calendar */}
            {propertyType && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)", marginBottom: 4 }}>Schedule your walkthrough</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }}>
                  Optional — pick a time that works and we'll come to you.
                </p>
                <div style={{ border: "2px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--surface)" }}>
                  {/* Calendar header */}
                  <div style={{ background: "var(--ink)", padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button type="button" onClick={prevMonth} disabled={prevDisabled}
                      style={{ background: "none", border: "none", color: prevDisabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)", cursor: prevDisabled ? "not-allowed" : "pointer", fontSize: 20, lineHeight: 1, padding: "0 8px" }}>‹</button>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#fff", fontSize: "0.9375rem" }}>{MONTHS[cm]} {cy}</span>
                    <button type="button" onClick={nextMonth}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 8px" }}>›</button>
                  </div>
                  {/* Day-of-week row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid var(--border-light)", background: "var(--surface-alt)" }}>
                    {DOW.map((d) => (
                      <div key={d} style={{ textAlign: "center", padding: "8px 0", fontSize: "0.75rem", fontWeight: 600, fontFamily: "var(--font-body)", color: d === "Sun" ? "var(--border)" : "var(--text-muted)", letterSpacing: "0.04em" }}>{d}</div>
                    ))}
                  </div>
                  {/* Day grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, padding: 8, background: "var(--surface-alt)" }}>
                    {days.map((d, i) => {
                      if (d === null) return <div key={"e" + i} />;
                      const dis = isDisabled(cy, cm, d);
                      const sel = day === d;
                      const isToday = cy === today.getFullYear() && cm === today.getMonth() && d === today.getDate();
                      return (
                        <button key={d} type="button" disabled={dis} onClick={() => { setDay(d); setTime(""); }}
                          style={{
                            aspectRatio: "1", border: sel ? "2px solid var(--mint)" : "2px solid transparent",
                            borderRadius: "var(--r-sm)",
                            background: sel ? "var(--ink)" : isToday ? "var(--mint-wash)" : "var(--surface)",
                            color: sel ? "var(--mint)" : dis ? "var(--border)" : "var(--ink)",
                            fontFamily: "var(--font-body)", fontWeight: sel ? 700 : isToday ? 600 : 400,
                            fontSize: "0.875rem", cursor: dis ? "not-allowed" : "pointer", transition: "all 0.12s",
                          }}
                          onMouseEnter={(e) => { if (!dis && !sel) { (e.currentTarget as HTMLButtonElement).style.background = "var(--mint-wash)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--mint)"; } }}
                          onMouseLeave={(e) => { if (!dis && !sel) { (e.currentTarget as HTMLButtonElement).style.background = isToday ? "var(--mint-wash)" : "var(--surface)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent"; } }}>
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  {/* Time slots */}
                  {day !== null && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "13px 16px", background: "var(--surface)" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", marginBottom: 10 }}>
                        Available times — {MONTHS[cm]} {day}
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {TIME_SLOTS.map((v) => (
                          <button key={v} type="button" onClick={() => setTime(v)}
                            style={{
                              padding: "7px 14px", border: time === v ? "2px solid var(--mint)" : "2px solid var(--border)",
                              borderRadius: "var(--r-sm)", background: time === v ? "var(--ink)" : "var(--surface)",
                              color: time === v ? "var(--mint)" : "var(--text-secondary)",
                              fontFamily: "var(--font-body)", fontWeight: time === v ? 700 : 400,
                              fontSize: "0.875rem", cursor: "pointer", transition: "all 0.12s",
                            }}>{v}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Confirmed slot */}
                  {day !== null && time && (
                    <div style={{ borderTop: "2px solid var(--mint)", background: "var(--mint-wash)", padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "var(--ink)" }}>Assessment Requested</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{fmtDate(cy, cm, day)} at {time}</div>
                      </div>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
                  Prefer to skip? We&apos;ll still send your written quote — scheduling is optional.
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--r-sm)", padding: "12px 16px", marginBottom: 16, fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {/* Submit — liquid glass CTA over the aura */}
            {propertyType && (
              <div style={{ background: "var(--aura-water)", backgroundColor: "var(--blue-wash, #EDF7FC)", borderRadius: "var(--r-xl)", padding: "24px", marginTop: 8 }}>
                <button type="submit" disabled={sending || !form.name || !form.phone} className="btn-glass">
                  <span>{sending ? "Sending your request..." : apptLabel ? "Request My Free Assessment" : "Request My Free Assessment"}</span>
                  {!sending && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  )}
                </button>
                <p style={{ fontFamily: "var(--font-body)", textAlign: "center", fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 12 }}>
                  No spam. No sales pressure. We respond within a few hours to schedule your walkthrough.
                </p>
              </div>
            )}

          </form>
        </div>

        {/* Trust row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px, 4vw, 36px)", flexWrap: "wrap", marginTop: 28 }}>
          {["Licensed & Insured", "Same-Day Response", "Free Assessment"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {t}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
