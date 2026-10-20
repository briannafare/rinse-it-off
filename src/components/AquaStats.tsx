"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Numbers that count up as they enter the viewport, floating on a water aura. */
type Stat =
  | { value: number; suffix: string; label: string; note: string }
  | { text: string; label: string; note: string };

const STATS: Stat[] = [
  { value: 157, suffix: "", label: "rainy days a year, give or take", note: "Moss never takes a season off." },
  { value: 48, suffix: "hr", label: "re-rinse guarantee", note: "Anything you're not happy with, redone free." },
  { value: 21, suffix: "-pt", label: "free property audit", note: "Photo-documented, board-ready." },
  { text: "same-day", label: "quote", note: "A firm number the day we walk your property." },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  // ponytail: null means "not counting" and renders the real number. The roll-up is
  // an enhancement — when the observer never fires (iOS Safari did exactly this) the
  // stat still reads 157, never a false 0. Same reason the server HTML is correct.
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
      <span className="text-[#A51E53]">{suffix}</span>
    </span>
  );
}

export function AquaStats() {
  return (
    <section className="relative overflow-hidden bg-[#F9D8E6] py-14 text-center md:py-20">
      {/* set like the closing credits of a film, on the pink tint: magenta-deep figures, ink notes */}

      <div className="container-site relative grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="font-title text-5xl font-bold text-[#A51E53] md:text-6xl">
              {"text" in s ? (
                <span className="tabular-nums">{s.text}</span>
              ) : (
                <CountUp target={s.value} suffix={s.suffix} />
              )}
            </div>
            <p className="label-caps mt-3 text-[#102E32]">{s.label}</p>
            <p className="mx-auto mt-2 max-w-[22ch] text-sm text-[#102E32]">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
