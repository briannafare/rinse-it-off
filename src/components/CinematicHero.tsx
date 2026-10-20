"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { HalFlyIn } from "@/components/retro/HalFlyIn";
import { RetroButton } from "@/components/retro/Bits";

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
 *  LATE-60s LAYER (2026-10-19): staged photographs framed like a film still, the title
 *  set like opening credits, and Hal flying in once. Hal is the only one in this
 *  viewport; he stays put when the slides change. */

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
    eyebrow: "Exterior cleaning across the Portland metro",
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
    img: "/brand/retro/r6-07-pnw-glasswall-wfp.webp",
    pos: "object-[46%_38%] md:object-[40%_40%]",
    alt: "Two Rinse It Off cleaners washing the tall windows of a mid-century Portland house from the ground with a water-fed pole",
    priority: true,
  },
  {
    key: "commercial",
    tab: "For your business",
    eyebrow: "Exterior cleaning across the Portland metro",
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
    img: "/brand/retro/r6-12-com-shopping-center.webp",
    pos: "object-[38%_50%] md:object-[45%_50%]",
    alt: "A Rinse It Off cleaner running a surface cleaner along a shopping-center walkway, the service truck parked at the curb",
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

  return (
    <section className="relative w-full overflow-hidden bg-retro-pool md:grid md:min-h-[100svh] md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      {/* The photograph: full width on top on phones, the right half bleeding off the edge on desktop. */}
      <div className="film-grain relative h-[50svh] min-h-[340px] md:order-2 md:h-auto">
        {SLIDES.map((s, i) => (
          <div
            key={s.key}
            className="absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Image src={s.img} alt={i === active ? s.alt : ""} fill priority={s.priority} sizes="(min-width: 768px) 55vw, 100vw" className={`object-cover ${s.pos}`} />
          </div>
        ))}
        {/* only so the white nav reads over the photo on phones */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent md:hidden" aria-hidden />
      </div>

      {/* Hal: settles on the seam between the photo and the cream, never on a person. */}
      <HalFlyIn className="pointer-events-none absolute right-[2%] top-[calc(50svh-64px)] z-20 w-[30vw] max-w-[140px] md:left-[calc(46%-130px)] md:right-auto md:top-[13%] md:w-[13vw] md:max-w-[210px]" />

      {/* The title block: flat cream, like the page of a 1967 magazine ad. */}
      <div className="relative z-10 flex flex-col justify-center px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-8 sm:px-8 md:order-1 md:px-12 md:pb-16 md:pt-28 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-14">
        <div className="mb-6 flex items-end gap-6 md:mb-8" role="tablist" aria-label="Who is this for?">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => pick(i)}
              className="group relative min-h-11 pb-2 text-left focus-visible:outline-none"
            >
              <span
                className={[
                  "label-caps !tracking-[0.14em] transition-colors duration-300 motion-reduce:transition-none",
                  i === active ? "text-brand-black" : "text-brand-black/45 group-hover:text-brand-black/75",
                ].join(" ")}
              >
                {s.tab}
              </span>
              {i === active && (
                <motion.span
                  layoutId={reduce ? undefined : "hero-tab-marker"}
                  className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-brand-blue"
                  transition={{ duration: 0.45, ease: EASE }}
                  aria-hidden
                />
              )}
            </button>
          ))}
        </div>

        {SLIDES.map((s, i) => (
          <div key={s.key} className={i === active ? "" : "hidden"}>
            <motion.h1
              key={`${s.key}-h1-${active}`}
              {...rise(0.08)}
              className="text-[clamp(2.7rem,10.5vw,5.4rem)] leading-[0.95] text-brand-black [text-wrap:balance] md:text-[clamp(3rem,5.4vw,5.6rem)]"
            >
              {s.headline} <span className="text-[#2E9BC6]">{s.accent}</span>
            </motion.h1>

            <motion.p key={`${s.key}-body-${active}`} {...rise(0.16)} className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-[#3B4650] md:text-lg">
              {s.body}
            </motion.p>

            <motion.div key={`${s.key}-cta-${active}`} {...rise(0.24)} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <RetroButton href={s.cta.href} signature>
                {s.cta.label}
              </RetroButton>
              <a
                href={PHONE_TEL}
                className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-base font-semibold text-brand-black hover:text-[#2E9BC6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </motion.div>
            <p className="label-caps mt-8 !tracking-[0.14em] text-retro-muted">{s.eyebrow}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
