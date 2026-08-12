"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useStaggerReveal } from "@/lib/gsap";

/** Proof, documentary style. Opens with a full-bleed parallax band, then the
 *  evidence grid — every photo has its before and after in the same frame. */
const SHOTS = [
  {
    src: "/brand/photos/before-after-concrete.webp",
    alt: "Sidewalk half black with grime, half freshly cleaned, the surface cleaner still in frame",
    caption: "Same sidewalk, one pass — the machine is still in the shot.",
  },
  {
    src: "/brand/photos/walkway-split.webp",
    alt: "A clubhouse walkway mid-clean, cleaned slabs bright against the dark untouched ones",
    caption: "Clubhouse walkway, halfway through the job.",
  },
  {
    src: "/brand/photos/walkway-cleaner.webp",
    alt: "A curb and sidewalk showing the clean line where washing stopped",
    caption: "Curb line — grime on the left, finished work on the right.",
  },
];

export function BeforeAfter() {
  const bandRef = useRef<HTMLDivElement>(null);
  const gridRef = useStaggerReveal(0.1);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ["start end", "end start"] });
  // Reduced-motion guard: hold the parallax band still when the visitor asks for it.
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["-12%", "12%"]);

  return (
    <section id="proof" className="bg-[#F4F7F8] pb-16 md:pb-24">
      {/* full-bleed parallax band */}
      <div ref={bandRef} className="relative h-[52vh] min-h-[380px] overflow-hidden">
        <motion.div className="absolute -inset-y-[14%] inset-x-0" style={{ y }}>
          <Image
            src="/brand/photos/curb-dramatic.webp"
            alt="A long sidewalk with a crisp line between cleaned and weathered concrete"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/35" />
        <div className="container-site relative flex h-full items-end pb-10">
          <blockquote
            className="max-w-2xl text-3xl font-medium leading-tight text-white md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The line isn&apos;t an effect.
            <br />
            It&apos;s where we <span style={{ color: "#62C4EB" }}>stopped.</span>
          </blockquote>
        </div>
      </div>

      <div className="container-site mt-14 md:mt-20">
        <h2
          className="max-w-2xl text-3xl font-medium text-[#0C1215] md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The moment dirt lets go.
        </h2>
        <p className="mt-3 max-w-xl text-[#4B5C6B]">
          No staging, no stock photography. Each shot is a real Portland-metro
          job with the before and after in the same frame.
        </p>

        {/* NOTE / TODO (needs Bri): this is a STATIC side-by-side evidence grid.
            A true draggable before/after slider — plus at least one RESIDENTIAL
            job pair — still needs distinct BEFORE and AFTER photos from Bri.
            Today's shots are single-frame "same frame" splits, so we ship the
            static grid for now and upgrade once real paired photos land. */}
        <div ref={gridRef} className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {SHOTS.map((s) => (
            <figure key={s.src} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[#E4ECF1]">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <figcaption className="mt-3 text-sm text-[#4B5C6B]">{s.caption}</figcaption>
            </figure>
          ))}
        </div>

        {/* GOOGLE RATING — PLACEHOLDER, intentionally renders nothing.
            Do NOT fabricate a rating or review count. Blocked on Bri: we are
            waiting on the real numbers from the verified Google Business
            Profile. When they land, replace this comment with a live badge,
            e.g.:
              <p className="mt-8 text-sm text-[#4B5C6B]">
                <span className="font-semibold text-[#0C1215]">{rating}</span>{" "}
                on Google · {reviewCount} reviews
              </p>
        */}

        {/* Section CTA — flat water-blue soft rectangle, light-bg ring offset. */}
        <div className="mt-12 flex flex-col items-start gap-4 md:mt-14 sm:flex-row sm:items-center">
          <a
            href="/assessment"
            className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8] motion-reduce:transition-none"
          >
            Book your free 21-point property audit
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
              <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="max-w-sm text-sm text-[#4B5C6B]">
            You&apos;ll get a firm, itemized quote the same day we walk your
            property — home or commercial site.
          </p>
        </div>
      </div>
    </section>
  );
}
