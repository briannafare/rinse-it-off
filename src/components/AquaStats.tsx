"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Numbers that count up as they enter the viewport, floating on a water aura. */
const STATS = [
  { value: 164, suffix: "", label: "days of rain a year in Portland", note: "Moss never takes a season off." },
  { value: 48, suffix: "hr", label: "re-rinse guarantee", note: "Anything you're not happy with, redone free." },
  { value: 21, suffix: "-pt", label: "free property audit", note: "Photo-documented, board-ready." },
  { value: 1, suffix: " day", label: "to a firm quote", note: "Ask today, know today." },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf: number;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      <span className="text-[#62C4EB]">{suffix}</span>
    </span>
  );
}

export function AquaStats() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* water aura */}
      <div className="aura-blob left-[-8%] top-[-30%] h-[420px] w-[420px] bg-[#EDF7FC]" aria-hidden />
      <div className="aura-blob right-[-6%] bottom-[-40%] h-[380px] w-[380px] bg-[#F0FFF6]" style={{ animationDelay: "-8s" }} aria-hidden />

      <div className="container-site relative grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div
              className="text-5xl font-medium tracking-tight text-[#0C1215] md:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <CountUp target={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm font-medium text-[#0C1215]">{s.label}</p>
            <p className="mt-1 text-sm text-[#8C9AA5]">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
