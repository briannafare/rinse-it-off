// Design: Industrial-clean, brand-matched to Rinse It Off
// Colors: #0C1215 (dark navy), #4DFFA6 (mint green), #62C4EB (water blue)
// Fonts: Outfit 900 (headlines), DM Sans (body)
// Calendar step: "Free Site Diagnostic" — inline month-view + time slots, pure React state

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ServiceType = "commercial" | "residential" | "";
type ServiceItem = string;

const COMMERCIAL_SERVICES: ServiceItem[] = [
  "Building Exterior Wash",
  "Parking Lot & Concrete",
  "Storefront & Entry Cleaning",
  "Roof & Gutter Cleaning",
  "HOA / Multi-Unit Properties",
  "Recurring Maintenance Plan",
];

const RESIDENTIAL_SERVICES: ServiceItem[] = [
  "House Washing",
  "Roof & Gutter Cleaning",
  "Driveway & Sidewalks",
  "Deck & Fence Restoration",
  "Window Washing",
  "Patio & Outdoor Living",
];

const TIME_SLOTS = [
  { label: "8:00 AM", value: "8:00 AM" },
  { label: "10:00 AM", value: "10:00 AM" },
  { label: "12:00 PM", value: "12:00 PM" },
  { label: "2:00 PM", value: "2:00 PM" },
  { label: "4:00 PM", value: "4:00 PM" },
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function isDateDisabled(year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = date.getDay();
  // Disable past dates and Sundays
  return date < today || dayOfWeek === 0;
}

function formatSelectedDate(year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const [serviceType, setServiceType] = useState<ServiceType>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
    promoCode: "",
  });

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const services = serviceType === "commercial" ? COMMERCIAL_SERVICES : serviceType === "residential" ? RESIDENTIAL_SERVICES : [];

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const calDays = getCalendarDays(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
    setSelectedTime("");
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
    setSelectedTime("");
  };

  // Prevent navigating to past months
  const isPrevMonthDisabled = calYear === today.getFullYear() && calMonth === today.getMonth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const appointmentLabel = selectedDay
    ? `${formatSelectedDate(calYear, calMonth, selectedDay)}${selectedTime ? ` at ${selectedTime}` : ""}`
    : "";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* HEADER */}
      <header style={{ backgroundColor: "#0C1215" }} className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: "white", fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
              Rinse
            </span>
            <div className="flex items-center gap-1">
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: "white", fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
                it
              </span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: "#4DFFA6", fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
                Off
              </span>
              <span style={{ color: "#62C4EB", fontSize: "1.1rem" }}>●</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <a href="tel:5038303338" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#4DFFA6", fontSize: "1.1rem", textDecoration: "none", letterSpacing: "-0.01em" }}>
            (503) 830-3338
          </a>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Portland Metro · Licensed & Insured
          </div>
        </div>
      </header>

      {/* HERO STRIP */}
      <div style={{ backgroundColor: "#0C1215", paddingBottom: "2.5rem", paddingTop: "0.5rem" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div style={{ color: "#4DFFA6", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Free Quote — No Obligation
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: "white", fontSize: "clamp(2rem, 5vw, 2.8rem)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Tell us what needs cleaning.<br />
            <span style={{ color: "#4DFFA6" }}>We'll handle the rest.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto" }}>
            Fill out the form below and we'll send you a written quote — no phone call required, no pressure, same-day response.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-2xl mx-auto px-6 py-10">

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >

            {/* STEP 1: Service Type */}
            <div className="mb-8">
              <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0C1215", display: "block", marginBottom: "0.75rem" }}>
                01 — What type of property?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["commercial", "residential"] as ServiceType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setServiceType(type); setSelectedServices([]); }}
                    style={{
                      padding: "1rem",
                      border: serviceType === type ? "2px solid #4DFFA6" : "2px solid #e5e7eb",
                      borderRadius: "6px",
                      backgroundColor: serviceType === type ? "#0C1215" : "white",
                      color: serviceType === type ? "white" : "#0C1215",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textTransform: "capitalize",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {type === "commercial" ? "🏢 Commercial" : "🏠 Residential"}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Services */}
            {serviceType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0C1215", display: "block", marginBottom: "0.75rem" }}>
                  02 — What needs cleaning? <span style={{ fontWeight: 400, color: "#6b7280" }}>(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => toggleService(svc)}
                      style={{
                        padding: "0.65rem 0.85rem",
                        border: selectedServices.includes(svc) ? "2px solid #4DFFA6" : "2px solid #e5e7eb",
                        borderRadius: "6px",
                        backgroundColor: selectedServices.includes(svc) ? "#f0fff8" : "white",
                        color: "#0C1215",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: selectedServices.includes(svc) ? 600 : 400,
                        fontSize: "0.875rem",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ color: selectedServices.includes(svc) ? "#4DFFA6" : "#d1d5db", fontSize: "0.75rem" }}>■</span>
                      {svc}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Contact Info */}
            {serviceType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0C1215", display: "block", marginBottom: "0.75rem" }}>
                  03 — Your contact info
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith", required: true },
                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "(503) 555-0100", required: true },
                    { key: "email", label: "Email Address", type: "email", placeholder: "jane@company.com", required: true },
                    { key: "address", label: "Property Address", type: "text", placeholder: "1234 NE Broadway, Portland, OR", required: false },
                  ].map(({ key, label, type, placeholder, required }) => (
                    <div key={key}>
                      <label style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151", display: "block", marginBottom: "0.3rem" }}>
                        {label}{required && <span style={{ color: "#4DFFA6" }}> *</span>}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        required={required}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        style={{
                          width: "100%",
                          padding: "0.7rem 0.9rem",
                          border: "2px solid #e5e7eb",
                          borderRadius: "6px",
                          fontSize: "0.95rem",
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#0C1215",
                          outline: "none",
                          transition: "border-color 0.15s ease",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#4DFFA6")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151", display: "block", marginBottom: "0.3rem" }}>
                      Anything else we should know?
                    </label>
                    <textarea
                      placeholder="Describe the surfaces, any problem areas, or questions you have..."
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#0C1215",
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.15s ease",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#4DFFA6")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Schedule a Free Site Diagnostic */}
            {serviceType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8"
              >
                {/* Section header */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0C1215", display: "block" }}>
                    04 — Schedule a Free Site Diagnostic
                  </label>
                  <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "0.25rem" }}>
                    Optional — We'll walk the property with you, identify every surface that needs attention, and hand you a written condition report. No charge, no commitment.
                  </p>
                </div>

                {/* Calendar card */}
                <div style={{
                  border: "2px solid #e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "white",
                }}>

                  {/* Calendar header */}
                  <div style={{
                    backgroundColor: "#0C1215",
                    padding: "0.85rem 1.1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <button
                      type="button"
                      onClick={prevMonth}
                      disabled={isPrevMonthDisabled}
                      style={{
                        background: "none",
                        border: "none",
                        color: isPrevMonthDisabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                        cursor: isPrevMonthDisabled ? "not-allowed" : "pointer",
                        fontSize: "1.1rem",
                        padding: "0.2rem 0.5rem",
                        lineHeight: 1,
                      }}
                      aria-label="Previous month"
                    >
                      ‹
                    </button>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "white", fontSize: "0.95rem", letterSpacing: "0.02em" }}>
                      {MONTH_NAMES[calMonth]} {calYear}
                    </span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.7)",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        padding: "0.2rem 0.5rem",
                        lineHeight: 1,
                      }}
                      aria-label="Next month"
                    >
                      ›
                    </button>
                  </div>

                  {/* Day-of-week labels */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    borderBottom: "1px solid #f3f4f6",
                    backgroundColor: "#f9fafb",
                  }}>
                    {DAYS_OF_WEEK.map((d) => (
                      <div key={d} style={{
                        textAlign: "center",
                        padding: "0.5rem 0",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: d === "Sun" ? "#d1d5db" : "#9ca3af",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}>
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "2px",
                    padding: "0.5rem",
                    backgroundColor: "#f9fafb",
                  }}>
                    {calDays.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} />;
                      }
                      const disabled = isDateDisabled(calYear, calMonth, day);
                      const isSelected = selectedDay === day;
                      const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={disabled}
                          onClick={() => { setSelectedDay(day); setSelectedTime(""); }}
                          style={{
                            aspectRatio: "1",
                            border: isSelected ? "2px solid #4DFFA6" : "2px solid transparent",
                            borderRadius: "6px",
                            backgroundColor: isSelected ? "#0C1215" : isToday ? "#f0fff8" : "white",
                            color: isSelected ? "#4DFFA6" : disabled ? "#d1d5db" : "#0C1215",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                            fontSize: "0.85rem",
                            cursor: disabled ? "not-allowed" : "pointer",
                            transition: "all 0.12s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}
                          onMouseEnter={(e) => {
                            if (!disabled && !isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f0fff8";
                              (e.currentTarget as HTMLButtonElement).style.borderColor = "#4DFFA6";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!disabled && !isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = isToday ? "#f0fff8" : "white";
                              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                            }
                          }}
                        >
                          {day}
                          {isToday && !isSelected && (
                            <span style={{
                              position: "absolute",
                              bottom: "3px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              backgroundColor: "#4DFFA6",
                            }} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Time slot picker — appears after a date is selected */}
                  <AnimatePresence>
                    {selectedDay !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{
                          borderTop: "1px solid #e5e7eb",
                          padding: "0.85rem 1rem",
                          backgroundColor: "white",
                        }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                            Available times — {MONTH_NAMES[calMonth]} {selectedDay}
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {TIME_SLOTS.map(({ label, value }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setSelectedTime(value)}
                                style={{
                                  padding: "0.45rem 0.9rem",
                                  border: selectedTime === value ? "2px solid #4DFFA6" : "2px solid #e5e7eb",
                                  borderRadius: "5px",
                                  backgroundColor: selectedTime === value ? "#0C1215" : "white",
                                  color: selectedTime === value ? "#4DFFA6" : "#374151",
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontWeight: selectedTime === value ? 700 : 400,
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                  transition: "all 0.12s ease",
                                  letterSpacing: "0.01em",
                                }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Confirmed appointment banner */}
                  <AnimatePresence>
                    {selectedDay !== null && selectedTime && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          borderTop: "1px solid #4DFFA6",
                          backgroundColor: "#f0fff8",
                          padding: "0.75rem 1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                        }}
                      >
                        <span style={{ color: "#4DFFA6", fontWeight: 700, fontSize: "1rem" }}>✓</span>
                        <div>
                          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#0C1215" }}>
                            Site Diagnostic Requested
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#374151" }}>
                            {formatSelectedDate(calYear, calMonth, selectedDay)} at {selectedTime}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Skip note */}
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem", textAlign: "center" }}>
                  Prefer to skip? We'll still send your written quote — scheduling is optional.
                </p>
              </motion.div>
            )}

            {/* SUBMIT */}
            {serviceType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: submitting ? "#a3a3a3" : "#4DFFA6",
                    color: "#0C1215",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    border: "none",
                    borderRadius: "6px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (!submitting) (e.target as HTMLButtonElement).style.backgroundColor = "#2de89a"; }}
                  onMouseLeave={(e) => { if (!submitting) (e.target as HTMLButtonElement).style.backgroundColor = "#4DFFA6"; }}
                >
                  {submitting ? "Sending your request..." : appointmentLabel ? "Book My Site Diagnostic →" : "Get My Free Quote →"}
                </button>
                <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#9ca3af", marginTop: "0.6rem" }}>
                  No spam. No sales pressure. We'll respond within a few hours.
                </p>
              </motion.div>
            )}

          </motion.form>
        ) : (
          /* SUCCESS STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center", padding: "3rem 1rem" }}
          >
            <div style={{ width: "64px", height: "64px", backgroundColor: "#4DFFA6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.75rem" }}>
              ✓
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#0C1215", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              You're all set, {form.name.split(" ")[0] || "friend"}!
            </h2>

            {appointmentLabel ? (
              <>
                <p style={{ color: "#374151", fontSize: "1rem", lineHeight: 1.6, maxWidth: "420px", margin: "0 auto 1.25rem" }}>
                  We'll see you on-site for your <strong>Free Site Diagnostic</strong> on:
                </p>
                <div style={{
                  display: "inline-block",
                  border: "2px solid #4DFFA6",
                  borderRadius: "8px",
                  padding: "0.85rem 1.5rem",
                  backgroundColor: "#f0fff8",
                  marginBottom: "1.25rem",
                }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#0C1215", letterSpacing: "-0.01em" }}>
                    {appointmentLabel}
                  </div>
                </div>
                <p style={{ color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 2rem" }}>
                  We'll also send your written quote to <strong>{form.email}</strong>. We'll confirm the walkthrough time by phone or text before the visit.
                </p>
              </>
            ) : (
              <p style={{ color: "#374151", fontSize: "1rem", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 2rem" }}>
                We received your request and will send a written quote to <strong>{form.email}</strong> within a few hours. No phone call needed unless you want one.
              </p>
            )}

            <div style={{ backgroundColor: "#0C1215", borderRadius: "8px", padding: "1.25rem 1.5rem", display: "inline-block" }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Questions? Call or text</div>
              <a href="tel:5038303338" style={{ color: "#4DFFA6", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.4rem", textDecoration: "none", letterSpacing: "-0.02em" }}>
                (503) 830-3338
              </a>
            </div>
          </motion.div>
        )}

        {/* TRUST ROW */}
        <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "2.5rem", paddingTop: "1.5rem", display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Licensed & Insured", icon: "✓" },
            { label: "No Subcontractors", icon: "✓" },
            { label: "Same-Day Response", icon: "✓" },
            { label: "Portland Metro", icon: "✓" },
          ].map(({ label, icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", color: "#374151" }}>
              <span style={{ color: "#4DFFA6", fontWeight: 700 }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#0C1215", padding: "1.25rem 1.5rem", marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
          © 2025 Rinse It Off · Portland, OR
        </span>
        <a href="https://rinseitoff.com" style={{ color: "#4DFFA6", fontSize: "0.78rem", textDecoration: "none", fontWeight: 600 }}>
          rinseitoff.com
        </a>
      </footer>

    </div>
  );
}
