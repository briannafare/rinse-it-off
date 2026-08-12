"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { IridescentCTA } from "./IridescentCTA";

/** Hero — light clean-water canvas. The star is a REAL Portland job: a sidewalk
 *  split straight down the middle, grimy → one clean pass. It reveals with a
 *  squeegee wipe (the brand's locked "moment dirt lets go"). Confident oversized
 *  type, one accent, the iridescent CTA as the single glow. No dark hero. */

// the ONE allowed ambient gradient — the water-aura mesh, ported inline because
// the token stylesheet that defines --aura-water isn't wired into the build.
const AURA =
  "radial-gradient(120% 120% at 12% 8%, #DDF1FB 0%, transparent 52%)," +
  "radial-gradient(115% 120% at 90% 20%, #E9FBF3 0%, transparent 52%)," +
  "radial-gradient(140% 130% at 55% 105%, #EEF5FB 0%, transparent 60%)";

const EASE = [0.22, 1, 0.36, 1] as const;

export function WipeHero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: EASE },
        };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* water-aura mesh + two slow drifting brand blobs = light, alive */}
      <div className="absolute inset-0" style={{ background: AURA }} aria-hidden />
      <div className="aura-blob left-[-6%] top-[6%] h-[460px] w-[460px] bg-[#CFEBFA]" aria-hidden />
      <div
        className="aura-blob right-[8%] bottom-[-14%] h-[380px] w-[380px] bg-[#DBFCEC]"
        style={{ animationDelay: "-7s" }}
        aria-hidden
      />

      <div className="container-site relative grid min-h-[100svh] grid-cols-1 items-center gap-12 pb-16 pt-28 md:grid-cols-[1.04fr_0.96fr] md:gap-14 md:pb-20 md:pt-32">
        {/* ── LEFT: the language leads ── */}
        <div className="min-w-0 max-w-xl">
          <motion.p
            {...rise(0.05)}
            className="mb-5 text-sm font-medium text-[#5A6B78]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Homes · roofs · concrete · storefronts — across the Portland metro
          </motion.p>

          <motion.h1
            {...rise(0.12)}
            className="text-[clamp(2.7rem,6.6vw,5.2rem)] leading-[0.96] tracking-[-0.035em] text-[#0C1215]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Portland wears on everything.
            <br />
            We <span className="text-[#3AA8D4]">rinse it off.</span>
          </motion.h1>

          <motion.p
            {...rise(0.22)}
            className="mt-6 max-w-md text-lg leading-relaxed text-[#4B5C6B]"
          >
            The right method for every surface — soft-wash, surface-clean, or
            hot-water — with a firm quote the <span className="text-[#0C1215]">same day you ask</span>.
            You walk the finished job before you pay a dime.
          </motion.p>

          <motion.div {...rise(0.32)} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <IridescentCTA href="/assessment" finish="iri-ink">
              Get your same-day quote
            </IridescentCTA>
            <a
              href="/assessment"
              className="text-sm font-medium text-[#3AA8D4] underline-offset-4 hover:text-[#0C1215] hover:underline"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Property managers → free 21-point audit
            </a>
          </motion.div>

          {/* trust row — no pills, hairline-separated */}
          <motion.div
            {...rise(0.42)}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#5A6B78]"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="flex" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#62C4EB] text-[#62C4EB]" />
                ))}
              </span>
              <span className="font-semibold text-[#0C1215]">5.0</span> on Google
            </span>
            <span className="h-3 w-px bg-[#D4E1E8]" aria-hidden />
            <span>Licensed &amp; insured</span>
            <span className="h-3 w-px bg-[#D4E1E8]" aria-hidden />
            <span>You approve before you pay</span>
          </motion.div>
        </div>

        {/* ── RIGHT: the star = the real clean line ── */}
        <div className="relative mx-auto w-full min-w-0 max-w-md md:mx-0 md:max-w-none">
          {/* offset water-blue block behind the photo — the one confident color block */}
          <div
            className="absolute -bottom-4 -right-4 left-8 top-8 rounded-[32px] bg-[#E1F1FB]"
            aria-hidden
          />

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="relative overflow-hidden rounded-[28px] shadow-[0_14px_48px_rgba(12,18,21,0.14)] ring-1 ring-black/5"
          >
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/brand/photos/before-after-concrete.jpg"
                alt="A Portland sidewalk cleaned in a single pass — the left half still grimy, the right half restored to clean gray concrete, with the surface cleaner at the top."
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />

              {/* squeegee glint — a single light pass across the frame (the brand's
                  "moment dirt lets go"), additive, never hides the photo */}
              {!reduce && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  initial={{ x: "-160%" }}
                  animate={{ x: "360%" }}
                  transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
                />
              )}

              {/* caption — explains the photo (clear beats clever) */}
              <div className="absolute bottom-3 right-3 max-w-[64%] rounded-2xl bg-black/45 px-4 py-2.5 backdrop-blur-md">
                <p className="text-[13px] font-medium leading-snug text-white/95">
                  Real Portland sidewalk — left: before, right: one pass.
                </p>
              </div>

              {/* floating differentiator — sits on the grimy "before" side */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
                className="absolute bottom-5 left-5 z-20 rounded-2xl bg-white px-5 py-4 shadow-[0_10px_34px_rgba(12,18,21,0.22)] ring-1 ring-black/5"
              >
                <span
                  className="text-4xl leading-none tracking-tight text-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
                >
                  $0
                </span>
                <p className="mt-1.5 max-w-[9.5rem] text-[13px] leading-snug text-[#5A6B78]">
                  until you&apos;ve walked the finished job and it&apos;s right.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
