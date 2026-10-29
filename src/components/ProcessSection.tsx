"use client";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { RetroButton } from "@/components/retro/Bits";

/** Block 4: how a quote works, beside real footage. Copy: SuperMe website panel, 2026-10-28/29. */
const STEPS = [
  {
    n: "01",
    title: "Pick a time, or skip it",
    body: "Pick a walkthrough time, or skip it and ask for a written quote.",
  },
  {
    n: "02",
    title: "We write it down",
    body: "We photograph what we find and write down how to treat each item. Hand the report to your own crew if you like.",
  },
  {
    n: "03",
    title: "You get a price the same day",
    body: "You get an itemized price the same day. Take all of it or part of it.",
  },
  {
    n: "04",
    title: "For homes: the plan, if you want it",
    body: "When we're done, we show you the photos and what's due next season. Join the plan within a week and $350 comes off.",
  },
];

export function ProcessSection() {
  const headRef = useScrollReveal();
  const stepsRef = useStaggerReveal(0.12);
  const [reduceMotion, setReduceMotion] = useState(false);
  // The 1.4 MB clip loads only when the section nears the screen. It used to
  // download with the page and compete with the hero photo on phones.
  const videoBox = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  // the source is set late, so the element has to be told to load and play it
  useEffect(() => {
    const v = video.current;
    if (!near || !v) return;
    v.load();
    if (!reduceMotion) v.play().catch(() => {});
  }, [near, reduceMotion]);

  useEffect(() => {
    const el = videoBox.current;
    if (!el || near) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section id="process" className="bg-retro-paper py-16 md:py-24">
      <div className="container-site">
        <div ref={headRef}>
          <h2
            className="max-w-2xl text-3xl font-medium text-[#0C1215] md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Getting a price takes one visit, or none.
          </h2>
        </div>

        <div className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          {/* real footage — the rotary cleaner mid-pass */}
          <div ref={videoBox} className="frame relative mx-auto w-full max-w-[360px] overflow-hidden">
            <video
              ref={video}
              src={near ? "/brand/video/surface-cleaning.mp4" : undefined}
              preload="none"
              poster={near ? "/brand/photos/work/surface-cleaning-poster.webp" : undefined}
              autoPlay={!reduceMotion}
              muted
              loop={!reduceMotion}
              controls={reduceMotion}
              playsInline
              className="aspect-[9/16] w-full object-cover"
              aria-label="Rotary surface cleaner removing grime in a single pass"
            />
            <span className="absolute bottom-4 left-4 rounded-[10px] border-2 border-[#0C1215] bg-[#FBF8F2] px-3 py-1.5 font-label text-[12px] font-bold uppercase tracking-[0.1em] text-[#0C1215]">
              Real job footage
            </span>
          </div>

          <div ref={stepsRef} className="flex flex-col gap-7">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-5">
                <span
                  className="font-label text-lg font-bold leading-snug text-[#1A6E93]"
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
                  <p className="mt-1 text-sm leading-relaxed text-[#3B4247]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row md:mt-16">
          <RetroButton href="/assessment?type=commercial">Book a free commercial walkthrough</RetroButton>
          <RetroButton href="/assessment?type=residential">Get a price for your first home cleaning</RetroButton>
        </div>
      </div>
    </section>
  );
}
