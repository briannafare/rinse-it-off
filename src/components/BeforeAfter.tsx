"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStaggerReveal } from "@/lib/gsap";

/** Proof, documentary style. Opens with a full-bleed parallax band, then the
 *  evidence grid — every photo has its before and after in the same frame. */
const SHOTS = [
  {
    src: "/brand/photos/before-after-concrete.jpg",
    alt: "Sidewalk half black with grime, half freshly cleaned, the surface cleaner still in frame",
    caption: "Same sidewalk, one pass — the machine is still in the shot.",
  },
  {
    src: "/brand/photos/walkway-split.jpg",
    alt: "A clubhouse walkway mid-clean, cleaned slabs bright against the dark untouched ones",
    caption: "Clubhouse walkway, halfway through the job.",
  },
  {
    src: "/brand/photos/walkway-cleaner.jpg",
    alt: "A curb and sidewalk showing the clean line where washing stopped",
    caption: "Curb line — grime on the left, finished work on the right.",
  },
];

export function BeforeAfter() {
  const bandRef = useRef<HTMLDivElement>(null);
  const gridRef = useStaggerReveal(0.1);
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section id="proof" className="bg-[#F4F7F8] pb-16 md:pb-24">
      {/* full-bleed parallax band */}
      <div ref={bandRef} className="relative h-[52vh] min-h-[380px] overflow-hidden">
        <motion.div className="absolute -inset-y-[14%] inset-x-0" style={{ y }}>
          <Image
            src="/brand/photos/curb-dramatic.jpg"
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

        <div ref={gridRef} className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {SHOTS.map((s) => (
            <figure key={s.src} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[#E4ECF1]">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-3 text-sm text-[#4B5C6B]">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
