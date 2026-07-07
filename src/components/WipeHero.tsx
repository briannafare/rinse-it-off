"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { IridescentCTA } from "./IridescentCTA";

/** Full-bleed documentary hero. The photo IS the before/after — one pass of
 *  the machine, the clean/dirty line real and in-frame. No simulated grime,
 *  no slider: the design system's signature interaction is the liquid-glass
 *  CTA floating over the clean side. */
export function WipeHero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/brand/photos/clubhouse-patio.jpg"
          alt="A white clubhouse building with its patio freshly washed, the surface cleaner still sitting on the wet concrete"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* legibility scrim only — the photo stays honest */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/20" />

      <div className="container-site relative z-10 flex h-full flex-col justify-end pb-24 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Portland wears on every surface.
            <br />
            We <span style={{ color: "#62C4EB" }}>rinse it off.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85 md:text-xl">
            164 days of rain per year — your home, storefront, roof, and
            concrete feel every one. Soft wash to hot water, the method matched
            to the surface, across the Portland metro.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <IridescentCTA href="/assessment">Get your quote</IridescentCTA>
            <a
              href="/assessment"
              className="text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Property managers: book a free 21-point audit
            </a>
          </div>
        </motion.div>
      </div>

      {/* the receipt: real job, not a mockup */}
      <p className="absolute bottom-6 right-5 z-10 hidden text-xs text-white/55 md:block lg:right-8">
        Real job, shot mid-clean — that&apos;s our surface cleaner by the porch.
      </p>
    </section>
  );
}
