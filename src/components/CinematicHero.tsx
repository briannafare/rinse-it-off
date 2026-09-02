"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";

/** Full-bleed rotating hero: one slide for homes, one for businesses.
 *
 *  The old headline was "Every surface gets its own method." Method-matching is
 *  what the crew is trained to explain on a walkthrough, but as a headline it
 *  never says what RIO actually does or what the visitor gets, so each slide now
 *  leads with the real offer: four included window cleanings for homes, the
 *  21-point audit and its report for properties.
 *
 *  The slide tabs are labelled "Homes" and "Businesses" on purpose. They rotate
 *  the hero and they tell both audiences the site is for them, in the first
 *  screen, without a second section.
 *
 *  Slide 0 renders visible from the server and the copy animates POSITION only.
 *  Nothing here may depend on JS to become visible (see src/lib/gsap.ts for the
 *  bug this rule exists to prevent). */

const EASE = [0.22, 1, 0.36, 1] as const;
const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";
const ROTATE_MS = 8000;

type Slide = {
  key: string;
  tab: string;
  eyebrow: string;
  headline: string;
  accent: string;
  body: React.ReactNode;
  cta: { label: string; href: string };
  footnote: string;
  img: string;
  alt: string;
  priority: boolean;
};

const SLIDES: Slide[] = [
  {
    key: "home",
    tab: "Homes",
    eyebrow: "For your home · Portland metro",
    headline: "We clean your home's exterior every season.",
    accent: "Windows included, four times a year.",
    body: (
      <>
        Roof, siding, driveway, gutters and walkways, on a seasonal schedule. The four
        window cleanings are included, and on their own they&apos;d run over{" "}
        <span className="text-white">$2,000 a year</span>.
      </>
    ),
    cta: { label: "Get my home price", href: "/assessment?type=residential" },
    footnote: "$189 to $499 a month depending on the size of your home · Licensed & insured",
    img: "/brand/photos/house-wash-hero.webp",
    alt: "A technician soft-washing the siding of a two-story Portland home from the lawn",
    priority: true,
  },
  {
    key: "commercial",
    tab: "Businesses",
    eyebrow: "For your property · Portland metro",
    headline: "A 21-point walk of your property, free.",
    accent: "Photos, findings and a firm price.",
    body: (
      <>
        Every problem area photographed in a report you can hand to ownership, an
        itemized quote you can take in stages, and a maintenance plan on your schedule.
      </>
    ),
    cta: { label: "Book the free audit", href: "/assessment?type=commercial" },
    footnote: "Free 21-point audit · Insured, certificate on request",
    img: "/brand/photos/work/surface-cleaner-steam.webp",
    alt: "A Rinse It Off technician running a surface cleaner across a walkway, steam rising and a clean path opening behind it",
    priority: false,
  },
];

export function CinematicHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  // Once someone picks a slide themselves, stop moving it under them.
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
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#0C1215]">
      {/* Both photos stay mounted so switching never shows an empty band. */}
      {SLIDES.map((s, i) => (
        <div
          key={s.key}
          className="absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <Image
            src={s.img}
            alt={i === active ? s.alt : ""}
            fill
            priority={s.priority}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* legibility scrims — dark left for copy, soft top/bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/10" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" aria-hidden />

      <div className="container-site relative z-10 flex min-h-[100svh] flex-col justify-end pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-24 md:justify-center md:pb-24 md:pt-28">
        {/* Audience switch. Also the fastest signal that RIO serves both. */}
        <div className="mb-5 flex gap-2 md:mb-7" role="tablist" aria-label="Who we're cleaning for">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => pick(i)}
              className={[
                "min-h-11 rounded-full px-5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none",
                i === active
                  ? "bg-[#62C4EB] text-[#0C1215]"
                  : "bg-white/10 text-white hover:bg-white/20",
              ].join(" ")}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.tab}
            </button>
          ))}
        </div>

        {SLIDES.map((s, i) => (
          <div key={s.key} className={i === active ? "max-w-2xl" : "hidden"}>
            <motion.p
              key={`${s.key}-eyebrow-${active}`}
              {...rise(0.05)}
              className="mb-4 text-pretty text-sm font-medium text-white/85"
            >
              {s.eyebrow}
            </motion.p>

            <motion.h1
              key={`${s.key}-h1-${active}`}
              {...rise(0.12)}
              className="max-w-3xl text-[clamp(1.9rem,4.3vw,3.4rem)] leading-[1.06] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {s.headline}
              <br />
              <span className="text-[#62C4EB]">{s.accent}</span>
            </motion.h1>

            <motion.p
              key={`${s.key}-body-${active}`}
              {...rise(0.2)}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:mt-6 md:text-lg"
            >
              {s.body}
            </motion.p>

            <motion.div
              key={`${s.key}-cta-${active}`}
              {...rise(0.28)}
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-9"
            >
              <a
                href={s.cta.href}
                className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-4 text-base font-semibold text-[#0C1215] shadow-[0_10px_28px_-8px_rgba(98,196,235,0.55)] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.cta.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a
                href={PHONE_TEL}
                className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-sm font-semibold text-white hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Phone className="h-4 w-4" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </motion.div>

            <motion.p key={`${s.key}-foot-${active}`} {...rise(0.36)} className="mt-5 text-sm text-white/85 md:mt-8">
              {s.footnote}
            </motion.p>
          </div>
        ))}
      </div>
    </section>
  );
}
