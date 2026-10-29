"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { HalFlyIn } from "@/components/retro/HalFlyIn";
import { RetroButton, StripeBand } from "@/components/retro/Bits";
import { AREA_LINE } from "@/lib/site";

/** One hero for both audiences (2026-10-29 copy overhaul, SuperMe website panel + Bri).
 *
 *  The old two-slide carousel hid one audience at a time, and the phone sticky bar, the hero and
 *  the page below named three different next steps. Now one screen says what we do and where,
 *  then two equal buttons in the owners' order: commercial first, homes second. The price line
 *  makes "free" believable, the plan link keeps the free windows with their price in the same
 *  sentence (it reads as a catch only when the price is missing), and the area line is the one
 *  locked wording pasted everywhere (src/lib/site.ts).
 *
 *  Everything renders visible from the server; motion moves position only. */

const EASE = [0.22, 1, 0.36, 1] as const;

export function CinematicHero() {
  const reduce = useReducedMotion();
  const rise = (d: number) =>
    reduce
      ? { initial: false as const }
      : { initial: { y: 18 }, animate: { y: 0 }, transition: { duration: 0.6, delay: d, ease: EASE } };

  const CLIP = { clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 3.5vw), 0 100%)" };

  return (
    <section className="relative w-full bg-retro-paper">
      <div className="relative">
        <div className="film-grain relative min-h-[100svh] w-full overflow-hidden md:min-h-[620px] md:aspect-[16/9]" style={CLIP}>
          <Image
            src="/brand/retro/hero-home.webp"
            alt="Two Rinse It Off cleaners at a mid-century house, one washing the high glass from the ground with a water-fed pole"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[46%_70%] md:object-[40%_40%]"
          />
          {/* a pale cream wash so ink type reads over the photo; light, never a dark overlay */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#FBF8F2]/95 via-[#FBF8F2]/85 via-60% to-[#FBF8F2]/20 md:bg-gradient-to-r md:from-[#FBF8F2]/95 md:via-[#FBF8F2]/70 md:via-45% md:to-transparent md:to-70%" />

          <div className="relative z-10 flex flex-col px-4 pb-[calc(3.5vw+64px)] pt-[104px] sm:px-8 md:px-12 md:pb-24 md:pt-[140px] lg:pl-[max(3rem,calc((100vw-90rem)/2+3rem))]">
            <div className="max-w-[92vw] md:max-w-[46vw]">
              <motion.h1
                {...rise(0.05)}
                className="font-title text-[10.5vw] leading-[0.95] text-brand-black [text-wrap:balance] md:text-[clamp(2.8rem,4.4vw,5rem)]"
              >
                Exterior cleaning for businesses and homes <span className="offer-accent">in Portland.</span>
              </motion.h1>

              <motion.div {...rise(0.15)} className="mt-6 flex max-w-md flex-col gap-3 md:mt-9">
                <RetroButton href="/assessment?type=commercial" className="w-full">Book a free commercial walkthrough</RetroButton>
                <RetroButton href="/assessment?type=residential" className="w-full">Get a price for your first home cleaning</RetroButton>
                <p className="text-center text-sm font-semibold text-[#3B4247]">
                  Commercial visits start at $750. Gutters start at $350.
                </p>
              </motion.div>

              <motion.p {...rise(0.22)} className="mt-5 max-w-md text-base leading-snug text-[#0C1215]">
                <a href="/plan?src=home-hero" className="underline decoration-[#1A6E93] decoration-2 underline-offset-4 hover:text-[#1A6E93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]">
                  Free window cleaning at every visit, four times a year, on the yearly plan.
                </a>{" "}
                From $189 a month for a small one-story home, 12 months.
              </motion.p>

              <motion.p {...rise(0.28)} className="mt-4 max-w-md text-sm leading-snug text-[#3B4247]">
                {AREA_LINE}
              </motion.p>
            </div>
          </div>

          {/* Hal stays an accent: desktop only, over open sky, clear of the headline and the buttons. */}
          <HalFlyIn className="pointer-events-none absolute right-[6%] top-[19%] z-20 hidden w-[15vw] max-w-[270px] md:block" />
        </div>
        <StripeBand className="absolute inset-x-0 bottom-[1.75vw]" />
      </div>
    </section>
  );
}
