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
    caption: "One pass of the surface cleaner, with the machine still in frame."
  },
  {
    src: "/brand/photos/walkway-split.webp",
    alt: "A clubhouse walkway mid-clean, cleaned slabs bright against the dark untouched ones",
    caption: "Clubhouse walkway, halfway through the job.",
  },
  {
    src: "/brand/photos/walkway-cleaner.webp",
    alt: "A curb and sidewalk showing the clean line where washing stopped",
    caption: "Grime on the left, finished work on the right."
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
    <section id="proof" className="bg-[#E6F5FC] pb-16 md:pb-24">
      {/* full-bleed parallax band */}
      <div ref={bandRef} className="mat film-grain relative h-[70vh] min-h-[460px] overflow-hidden">
        <motion.div className="absolute -inset-y-[14%] inset-x-0" style={{ y }}>
          <Image
            src="/brand/photos/curb-dramatic.webp"
            alt="A long sidewalk with a crisp line between cleaned and weathered concrete"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF8F2]/90 via-[#FBF8F2]/30 to-transparent" />
        <div className="container-site relative flex h-full items-end pb-10">
          <blockquote
            className="max-w-5xl font-title text-[12vw] leading-[0.95] text-[#0C1215] md:text-[6.5vw]"
          >
            The line isn&apos;t an effect.
            <br />
            It&apos;s where we <span>stopped.</span>
          </blockquote>
        </div>
      </div>

      <div className="container-site mt-14 md:mt-20">
        <h2 className="max-w-5xl text-[#0C1215]">
          The moment dirt lets go.
        </h2>
        <p className="mt-5 max-w-3xl text-lg text-[#3B4247]">
          No staging and no stock photos. Each of these is a real job of ours,
          shot mid-pass, so the before and the after sit in the same frame.
        </p>

        {/* NOTE / TODO (needs Bri): this is a STATIC side-by-side evidence grid.
            A true draggable before/after slider — plus at least one RESIDENTIAL
            job pair — still needs distinct BEFORE and AFTER photos from Bri.
            Today's shots are single-frame "same frame" splits, so we ship the
            static grid for now and upgrade once real paired photos land. */}
        <div ref={gridRef} className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {SHOTS.map((s) => (
            <figure key={s.src} className="group w-[85vw] shrink-0 snap-start md:w-auto">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 85vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <figcaption className="mt-4 text-lg text-[#3B4247]">{s.caption}</figcaption>
            </figure>
          ))}
        </div>

        {/* GOOGLE RATING — PLACEHOLDER, intentionally renders nothing.
            Do NOT fabricate a rating or review count. Blocked on Bri: we are
            waiting on the real numbers from the verified Google Business
            Profile. When they land, replace this comment with a live badge,
            e.g.:
              <p className="mt-8 text-sm text-[#3B4247]">
                <span className="font-semibold text-[#0C1215]">{rating}</span>{" "}
                on Google · {reviewCount} reviews
              </p>
        */}

        {/* Section CTA — flat water-blue soft rectangle, light-bg ring offset. */}
        <div className="mt-12 flex flex-col items-start gap-4 md:mt-14 sm:flex-row sm:items-center">
          <a
            href="/assessment"
            className="group btn-print bg-[#F2B632] text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF] motion-reduce:transition-none"
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
          <p className="max-w-sm text-sm text-[#3B4247]">
            You&apos;ll get a firm, itemized quote the same day we walk your
            property — home or commercial site.
          </p>
        </div>
      </div>
    </section>
  );
}
