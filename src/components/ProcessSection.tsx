"use client";
import { useEffect, useState } from "react";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";

/** Show the machine actually working (real footage), beside the four-step
 *  money path. Risk-reversal copy: nothing charges until they approve. */
const STEPS = [
  {
    n: "01",
    title: "We audit your property — free, 21 points",
    body: "We assess every surface on-site — home, storefront, or facility — and hand you a firm, itemized quote the same day.",
  },
  {
    n: "02",
    title: "Reserve your slot, lock your price",
    body: "Accept the quote and pick your day. Your price is locked, and a small deposit simply holds the date — nothing else charges yet.",
  },
  {
    n: "03",
    title: "We clean. You walk it.",
    body: "Method matched to every surface, residential or commercial. When we're done, you inspect the work before anything else happens.",
  },
  {
    n: "04",
    title: "Pay the rest only when it's right",
    body: "Balance settles after your walkthrough. Not happy with something? Our Clean Water Promise — we re-rinse anything you're not happy with, free, within 48 hours.",
  },
];

export function ProcessSection() {
  const headRef = useScrollReveal();
  const stepsRef = useStaggerReveal(0.12);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section id="process" className="bg-white py-16 md:py-24">
      <div className="container-site">
        <div ref={headRef}>
          <h2
            className="max-w-2xl text-3xl font-medium text-[#0C1215] md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            You approve the work before the balance ever charges.
          </h2>
        </div>

        <div className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-2 lg:gap-16">
          {/* real footage — the rotary cleaner mid-pass */}
          <div className="relative overflow-hidden rounded-3xl border border-[#E4ECF1] shadow-[0_30px_60px_-30px_rgba(20,45,60,0.3)]">
            <video
              src="/brand/video/surface-cleaning.mp4"
              poster="/brand/photos/surface-cleaning.webp"
              autoPlay={!reduceMotion}
              muted
              loop={!reduceMotion}
              controls={reduceMotion}
              playsInline
              className="aspect-[4/3] w-full object-cover"
              aria-label="Rotary surface cleaner removing grime in a single pass"
            />
            <span className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Actual RIO job footage
            </span>
          </div>

          <div ref={stepsRef} className="flex flex-col gap-7">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-5">
                <span
                  className="text-3xl font-medium leading-none text-[#62C4EB] md:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.n}
                </span>
                <div>
                  <h3
                    className="text-lg font-medium text-[#0C1215]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5C6B]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex md:mt-16">
          <a
            href="/assessment"
            className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
          >
            Book your free 21-point audit
          </a>
        </div>
      </div>
    </section>
  );
}
