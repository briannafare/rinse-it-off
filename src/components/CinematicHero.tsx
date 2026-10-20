"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { HalFlyIn } from "@/components/retro/HalFlyIn";
import { RetroButton, Seal, StripeBand } from "@/components/retro/Bits";

/** Full-bleed rotating hero: one slide for homes, one for properties.
 *
 *  THE HEADLINE STATES THE GIVEAWAY. Free window cleaning is the offer, so the
 *  headline says "Free window cleaning," not "windows included" and not any other
 *  phrasing that makes a free thing sound like a footnote. Two earlier versions
 *  failed this: "Every surface gets its own method" (sales training, not a
 *  benefit) and "Windows included, four times a year" (hedged the giveaway).
 *  Rule: ~/brain/systems/voice-principles.md 4e-0. Cleverness may ADD to meaning,
 *  never stand in front of it.
 *
 *  NO TINY DISCLAIMER TEXT. Price, inclusions and terms are why people buy, so
 *  they sit in the body copy at body size. There is no small grey sub-line here
 *  and none should be added (voice-principles 4e-0-i).
 *
 *  Slide 0 renders visible from the server and copy animates POSITION only.
 *  Nothing may depend on JS to become visible (see src/lib/gsap.ts).
 *
 *  SCALE (2026-10-20): the photo runs edge to edge, full screen on a phone and 92vh on
 *  desktop, unboxed. The headline (15vw phone, 8.5vw desktop) and the main button sit over its
 *  sky on a pale cream wash (never a dark overlay). The photo's lower edge is cut on the stripe
 *  band's tilt and the band runs along it. The body copy follows below the photo, full size.
 *  Hal flies in once and stays put when the slides change. */

const EASE = [0.22, 1, 0.36, 1] as const;
const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";
const ROTATE_MS = 9000;

type Slide = {
  key: string;
  tab: string;
  eyebrow: string;
  headline: string;
  accent: string;
  body: React.ReactNode;
  cta: { label: string; href: string };
  img: string;
  /** focal point, so phones crop onto the people, not the siding */
  pos: string;
  alt: string;
  priority: boolean;
};

const SLIDES: Slide[] = [
  {
    key: "home",
    tab: "For your home",
    eyebrow: "Exterior cleaning for homes and businesses",
    headline: "Free window cleaning,",
    accent: "four times a year.",
    body: (
      <>
        It comes with the seasonal plan that keeps your roof, siding, driveway, gutters
        and walkways clean all year. Those four window visits on their own would cost you
        more than <span className="font-semibold text-brand-black">$2,000</span>. Plans start at{" "}
        <span className="font-semibold text-brand-black">$189 a month</span>, depending
        on the size of your home.
      </>
    ),
    cta: { label: "Get my home price", href: "/plan?src=home-hero" },
    img: "/brand/retro/hero-home.webp",
    pos: "object-[46%_38%] md:object-[40%_40%]",
    alt: "Two Rinse It Off cleaners at a mid-century house with a wall of tall windows, one washing the high glass from the ground with a water-fed pole",
    priority: true,
  },
  {
    key: "commercial",
    tab: "For your business",
    eyebrow: "Exterior cleaning for homes and businesses",
    headline: "A free 21-point inspection",
    accent: "of your whole property.",
    body: (
      <>
        We photograph every problem area and hand you the report to give ownership, an
        itemized price you can take in stages, and a maintenance plan on your schedule.
        Storefronts, offices, HOAs, multifamily and clubhouses.
      </>
    ),
    cta: { label: "Book my free inspection", href: "/assessment?type=commercial" },
    img: "/brand/retro/hero-biz.webp",
    pos: "object-[38%_50%] md:object-[45%_50%]",
    alt: "Two Rinse It Off cleaners at a mid-century storefront at golden hour, one running a surface cleaner across the entry walk, one rinsing the glass",
    priority: false,
  },
];

export function CinematicHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  // Once someone picks a side themselves, stop moving it under them.
  const [held, setHeld] = useState(false);

  const pick = useCallback((i: number) => {
    setActive(i);
    setHeld(true);
  }, []);

  useEffect(() => {
    if (held || reduce) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        setActive((i) => (i + 1) % SLIDES.length);
      }
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [held, reduce]);

  const rise = (d: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { y: 18 },
          animate: { y: 0 },
          transition: { duration: 0.6, delay: d, ease: EASE },
        };

  const CLIP = { clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 3.5vw), 0 100%)" };

  return (
    <section className="relative w-full bg-retro-paper">
      <div className="relative">
      <div className="mat film-grain relative h-[100svh] min-h-[640px] w-full overflow-hidden md:h-[92vh] md:min-h-[720px]" style={CLIP}>
        {SLIDES.map((s, i) => (
          <div
            key={s.key}
            className="absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Image src={s.img} alt={i === active ? s.alt : ""} fill priority={s.priority} sizes="100vw" className={`object-cover ${s.pos}`} />
          </div>
        ))}
        {/* a pale cream wash over the sky so ink type reads; light, never a dark overlay */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#FBF8F2]/90 via-[#FBF8F2]/55 via-45% to-transparent to-75% md:bg-gradient-to-r md:from-[#FBF8F2]/92 md:via-[#FBF8F2]/50 md:via-40% md:to-transparent md:to-65%" />

        <div className="relative z-10 flex h-full flex-col px-4 pt-[112px] sm:px-8 md:px-12 md:pt-[176px] lg:pl-[max(3rem,calc((100vw-90rem)/2+3rem))]">
          <div className="mb-4 flex gap-2 md:mb-7" role="tablist" aria-label="Who is this for?">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => pick(i)}
                className={[
                  "min-h-11 whitespace-nowrap rounded-full border-[3px] border-[#0C1215] px-3 text-sm font-bold md:min-h-14 md:px-6 md:text-xl transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D6336C] motion-reduce:transition-none",
                  i === active ? "bg-[#0C1215] text-[#FBF8F2]" : "bg-[#FBF8F2]/80 text-[#0C1215] hover:bg-white",
                ].join(" ")}
              >
                {s.tab}
              </button>
            ))}
          </div>

          {SLIDES.map((s, i) => (
            <div key={s.key} className={i === active ? "max-w-[92vw] md:max-w-[62vw]" : "hidden"}>
              {(() => {
                // one h1 on the page: the other slide's headline is a plain paragraph
                const H = i === active ? motion.h1 : motion.p;
                return (
                  <H
                    key={`${s.key}-h1-${active}`}
                    {...rise(0.08)}
                    className="font-title text-[15vw] leading-[0.9] text-brand-black [text-wrap:balance] md:text-[8.5vw] md:leading-[0.88]"
                  >
                    {s.headline} <span className="offer-accent">{s.accent}</span>
                  </H>
                );
              })()}

              <motion.div key={`${s.key}-cta-${active}`} {...rise(0.2)} className="mt-6 flex flex-col gap-3 md:mt-10 md:flex-row md:items-center md:gap-5">
                <RetroButton href={s.cta.href}>{s.cta.label}</RetroButton>
                <a href={PHONE_TEL} className="btn-ghost !hidden bg-[#FBF8F2]/85 md:!inline-flex focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D6336C]">
                  <Phone className="h-5 w-5" aria-hidden />
                  {PHONE_DISPLAY}
                </a>
              </motion.div>
            </div>
          ))}
        </div>

        <Seal text="Free window cleaning ★ four times a year ★ " className="absolute bottom-[calc(3.5vw+28px)] right-10 z-10 hidden w-36 -rotate-6 md:block" />
        {/* Hal: settles over the open sky, never on a person or on the headline. */}
        <HalFlyIn className="pointer-events-none absolute bottom-[74px] left-[4%] z-20 w-[20vw] max-w-[110px] md:bottom-auto md:left-auto md:right-[6%] md:top-[19%] md:w-[11vw] md:max-w-[200px]" />
      </div>
      {/* the stripe band along the photo's tilted lower edge (the centre of the cut sits 1.75vw up) */}
      <StripeBand className="absolute inset-x-0 bottom-[1.75vw]" />
      </div>

      {SLIDES.map((s, i) => (
        <div key={s.key} className={i === active ? "container-site pb-14 pt-10 md:pb-20 md:pt-14" : "hidden"}>
          <motion.p key={`${s.key}-body-${active}`} {...rise(0.1)} className="max-w-4xl text-xl leading-relaxed text-[#3B4247]">
            {s.body}
          </motion.p>
        </div>
      ))}
    </section>
  );
}
