"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";

/** Full-bleed hero. Real photo of a real job, not stock and not AI.
 *
 *  This was a 16s loop of a technician crossing the frame inside a steam cloud;
 *  it read as someone wandering rather than working, and you never saw a surface
 *  come clean. A still of the surface cleaner actually cutting its path says the
 *  same thing in one frame, and drops 4.2MB off the first load. If motion comes
 *  back here it needs footage where the clean line appears on camera. */

const EASE = [0.22, 1, 0.36, 1] as const;
const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";

export function CinematicHero() {
  const reduce = useReducedMotion();
  // Animate POSITION only, never opacity — SSR renders the copy fully visible
  // (just offset), so it can never get stuck invisible pre-hydration or if JS
  // is slow/off. Reduced-motion renders at rest.
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
      {/* Real job: hot-water surface cleaning at a Portland-area clubhouse. */}
      <Image
        src="/brand/photos/work/surface-cleaner-steam.webp"
        alt="A Rinse It Off technician running a surface cleaner across a walkway, steam rising and a clean path opening behind it"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* legibility scrims — dark left for copy, soft top/bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/5" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" aria-hidden />

      <div className="container-site relative z-10 flex min-h-[100svh] flex-col justify-end pb-[calc(6rem+env(safe-area-inset-bottom))] pt-28 md:justify-center md:pb-24">
        <div className="max-w-2xl">
          <motion.p {...rise(0.05)} className="mb-4 text-pretty text-sm font-medium text-white/85">
            Exterior cleaning for homes and businesses · Portland metro
          </motion.p>

          <motion.h1
            {...rise(0.12)}
            className="text-[clamp(2.3rem,7vw,5.6rem)] leading-[0.95] tracking-[-0.035em] text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Every surface gets
            <br />
            <span className="text-[#62C4EB]">its own method.</span>
          </motion.h1>

          <motion.p {...rise(0.2)} className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Portland&apos;s rain feeds moss and algae all year, and the fix for a cedar
            deck isn&apos;t the fix for a parking lot. We look at your property first, then
            match the{" "}
            <span className="text-white">pressure, temperature and chemistry</span> to
            each surface, so it comes clean without getting worn down.
          </motion.p>

          <motion.div {...rise(0.28)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="/assessment"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-4 text-base font-semibold text-[#0C1215] shadow-[0_10px_28px_-8px_rgba(98,196,235,0.55)] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get your free assessment
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

          <motion.p {...rise(0.36)} className="mt-8 text-sm text-white/85">
            Licensed &amp; insured · Free walkthrough · Houses and buildings both
          </motion.p>
        </div>
      </div>
    </section>
  );
}
