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
  /** optional film; plays once, slowed, then rests on its last frame */
  film?: string;
  /** focal point, so phones crop onto the people, not the siding */
  pos: string;
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
        more than <span className="font-semibold text-white">$2,000</span>. Plans start at{" "}
        <span className="font-semibold text-white">$189 a month</span>, depending
        on the size of your home.
      </>
    ),
    cta: { label: "Get my home price", href: "/plan?src=home-hero" },
    img: "/brand/retro/hero-poster.webp",
    film: "/brand/retro/hero.mp4",
    pos: "object-[48%_40%] md:object-[60%_40%]",
    alt: "A Rinse It Off crew washing the tall windows of a mid-century house with a water-fed pole while the homeowners watch from the lawn",
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
    img: "/brand/retro/com-office.webp",
    pos: "object-[62%_50%] md:object-center",
    alt: "A Rinse It Off crew cleaning the glass front and the entry walkway of a mid-century office building",
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
    <section className="film-grain relative min-h-[100svh] w-full overflow-hidden bg-[#0C1215]">
      {/* Both scenes stay mounted so switching never shows an empty band. */}
      {SLIDES.map((s, i) => (
        <div
          key={s.key}
          className="absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <Image
            src={s.img}
            alt={i === active ? s.alt : ""}
            fill
            priority={s.priority}
            sizes="100vw"
            className={`object-cover ${s.pos}`}
          />
          {s.film && !reduce && (
            <video
              className={`absolute inset-0 h-full w-full object-cover ${s.pos}`}
              src={s.film}
              poster={s.img}
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = 0.7;
              }}
              aria-hidden
            />
          )}
        </div>
      ))}

      {/* legibility: soft top for the nav, a deep bottom for the credits */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black/85 via-black/45 to-transparent md:h-[62%]" aria-hidden />

      {/* Hal: open sky on the right on phones, over the trees on desktop */}
      <HalFlyIn className="absolute right-[2%] top-[8%] z-10 w-[30vw] max-w-[170px] md:right-[7%] md:top-[11%] md:w-[13vw] md:max-w-[220px]" />

      <div className="container-site relative z-10 flex min-h-[100svh] flex-col justify-end pb-[calc(6rem+env(safe-area-inset-bottom))] pt-24 md:pb-20 md:pt-28">
        {/* Audience switch: Futura capitals on a shared rail, the marker slides between them. */}
        <div className="mb-7 flex items-end gap-7 md:mb-9 md:gap-10" role="tablist" aria-label="Choose your property type">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => pick(i)}
              className="group relative min-h-11 pb-2.5 text-left focus-visible:outline-none"
            >
              <span
                className={[
                  "label-caps !text-[0.8rem] transition-colors duration-300 md:!text-sm motion-reduce:transition-none",
                  i === active ? "text-white" : "text-white/55 group-hover:text-white/85",
                  "group-focus-visible:text-white",
                ].join(" ")}
              >
                {s.tab}
              </span>
              <span className="absolute inset-x-0 bottom-0 h-px bg-white/30" aria-hidden />
              {i === active && (
                <motion.span
                  layoutId={reduce ? undefined : "hero-tab-marker"}
                  className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-retro-sun"
                  transition={{ duration: 0.45, ease: EASE }}
                  aria-hidden
                />
              )}
            </button>
          ))}
        </div>

        {SLIDES.map((s, i) => (
          <div key={s.key} className={i === active ? "max-w-3xl" : "hidden"}>
            <motion.p key={`${s.key}-eyebrow-${active}`} {...rise(0.05)} className="label-caps mb-4 !tracking-[0.12em] text-white/85 md:!tracking-[0.2em]">
              {s.eyebrow}
            </motion.p>

            <motion.h1
              key={`${s.key}-h1-${active}`}
              {...rise(0.12)}
              className="text-[clamp(2.6rem,7.4vw,5.6rem)] font-bold leading-[0.98] text-white [text-wrap:balance]"
            >
              {s.headline}
              <br />
              <span className="text-retro-sun">{s.accent}</span>
            </motion.h1>

            <motion.p
              key={`${s.key}-body-${active}`}
              {...rise(0.2)}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
            >
              {s.body}
            </motion.p>

            <motion.div key={`${s.key}-cta-${active}`} {...rise(0.28)} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <RetroButton href={s.cta.href} tone="white" signature>
                {s.cta.label}
              </RetroButton>
              <a
                href={PHONE_TEL}
                className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-base font-semibold text-white hover:text-retro-sun focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-retro-sun"
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
