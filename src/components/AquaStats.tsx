"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Numbers that count up as they enter the viewport, floating on a water aura. */
type Stat =
  | { value: number; suffix: string; label: string; note: string }
  | { text: string; label: string; note: string };

const STATS: Stat[] = [
  { value: 164, suffix: "", label: "days of rain a year in Portland", note: "Moss never takes a season off." },
  { value: 48, suffix: "hr", label: "re-rinse guarantee", note: "Tell us within 24 hours; we redo it free within 48." },
  { value: 21, suffix: "-pt", label: "free property audit", note: "Photo-documented, board-ready." },
  { text: "same-day", label: "quote", note: "A firm number the day we walk your property." },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  // ponytail: null means "not counting" and renders the real number. The roll-up is
  // an enhancement — when the observer never fires (iOS Safari did exactly this) the
  // stat still reads 164, never a false 0. Same reason the server HTML is correct.
  const [n, setN] = useState<number | null>(null);
  // Only roll up from 0 for a stat the visitor scrolls down to. If it was already
  // on screen at mount, the final number is the honest thing to show.
  const startsOffscreen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    startsOffscreen.current = !!el && el.getBoundingClientRect().top > window.innerHeight;
  }, []);

  useEffect(() => {
    if (!inView || reduced || target <= 1) return;
    if (!startsOffscreen.current) return;
    const start = performance.now();
    const dur = 1400;
    let raf: number;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setN(null); // hand the final value back to the plain render
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {n ?? target}
      <span className="text-[#62C4EB]">{suffix}</span>
    </span>
  );
}

export function AquaStats() {
  const reduced = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* water aura */}
      <div
        className="aura-blob left-[-8%] top-[-30%] h-[420px] w-[420px] bg-[#EDF7FC]"
        style={reduced ? { animation: "none" } : undefined}
        aria-hidden
      />
      <div
        className="aura-blob right-[-6%] bottom-[-40%] h-[380px] w-[380px] bg-[#E6F4FC]"
        style={reduced ? { animation: "none" } : { animationDelay: "-8s" }}
        aria-hidden
      />

      <div className="container-site relative grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div
              className="text-5xl font-medium tracking-tight text-[#0C1215] md:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {"text" in s ? (
                <span className="tabular-nums">{s.text}</span>
              ) : (
                <CountUp target={s.value} suffix={s.suffix} />
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-[#0C1215]">{s.label}</p>
            <p className="mt-1 text-sm text-[#4B5C6B]">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
