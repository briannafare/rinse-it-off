"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";

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
 *  Nothing may depend on JS to become visible (see src/lib/gsap.ts). */

const EASE = [0.22, 1, 0.36, 1] as const;
const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";
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
  alt: string;
  priority: boolean;
};

const SLIDES: Slide[] = [
  {
    key: "home",
    tab: "My home",
    eyebrow: "Exterior cleaning across the Portland metro",
    headline: "Free window cleaning,",
    accent: "four times a year.",
    body: (
      <>
        It comes with the seasonal plan that keeps your roof, siding, driveway, gutters
        and walkways clean all year. Those four window visits on their own would cost you
        more than <span className="font-semibold text-white">$2,000</span>. Plans run{" "}
        <span className="font-semibold text-white">$189 to $499 a month</span>, depending
        on the size of your home.
      </>
    ),
    cta: { label: "Get my home price", href: "/assessment?type=residential" },
    img: "/brand/photos/house-wash-hero.webp",
    alt: "A technician soft-washing the siding of a two-story Portland home from the lawn",
    priority: true,
  },
  {
    key: "commercial",
    tab: "My property",
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
    img: "/brand/photos/work/surface-cleaner-steam.webp",
    alt: "A Rinse It Off technician running a surface cleaner across a walkway, steam rising and a clean path opening behind it",
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
        {/* Audience switch set as type, not buttons in boxes: the words carry it
            and one accent rule slides between them. */}
        <div
          className="mb-8 flex items-end gap-8 md:mb-10 md:gap-10"
          role="tablist"
          aria-label="Choose your property type"
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => pick(i)}
              className="group relative min-h-11 pb-2.5 text-left focus-visible:outline-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span
                className={[
                  "text-xl tracking-tight transition-colors duration-300 md:text-2xl motion-reduce:transition-none",
                  i === active ? "text-white" : "text-white/45 group-hover:text-white/80",
                  "group-focus-visible:text-white",
                ].join(" ")}
              >
                {s.tab}
              </span>
              {/* shared baseline rail, with the marker sliding to the live tab */}
              <span className="absolute inset-x-0 bottom-0 h-px bg-white/25" aria-hidden />
              {i === active && (
                <motion.span
                  layoutId={reduce ? undefined : "hero-tab-marker"}
                  className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#62C4EB]"
                  transition={{ duration: 0.45, ease: EASE }}
                  aria-hidden
                />
              )}
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
              className="max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02] tracking-[-0.035em] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {s.headline}
              <br />
              <span className="text-[#62C4EB]">{s.accent}</span>
            </motion.h1>

            <motion.p
              key={`${s.key}-body-${active}`}
              {...rise(0.2)}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
            >
              {s.body}
            </motion.p>

            <motion.div
              key={`${s.key}-cta-${active}`}
              {...rise(0.28)}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
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
                className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-base font-semibold text-white hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Phone className="h-4 w-4" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
