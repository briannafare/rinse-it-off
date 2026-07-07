"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { IridescentCTA } from "./IridescentCTA";

/** Signature hero: the surface cleaner working in front of the clubhouse,
 *  giant billows of steam rising off the wet concrete. The whole scene is
 *  mouse-reactive — the photo tilts gently and the steam drifts with the
 *  cursor, like walking past the job site. */

// puffs anchored above the machine (left of frame) and along the wet concrete
const PUFFS = [
  { left: "16%", bottom: "30%", size: 210, dur: 8.5, delay: 0.0, x: 60, op: 0.55 },
  { left: "20%", bottom: "27%", size: 150, dur: 7.2, delay: 2.1, x: -45, op: 0.5 },
  { left: "13%", bottom: "25%", size: 250, dur: 10.5, delay: 4.3, x: 80, op: 0.45 },
  { left: "24%", bottom: "31%", size: 120, dur: 6.4, delay: 1.2, x: 30, op: 0.42 },
  { left: "18%", bottom: "22%", size: 300, dur: 12.5, delay: 5.6, x: -70, op: 0.4 },
  { left: "38%", bottom: "16%", size: 180, dur: 11, delay: 3.0, x: 55, op: 0.3 },
  { left: "55%", bottom: "13%", size: 220, dur: 13, delay: 6.8, x: -60, op: 0.26 },
  { left: "70%", bottom: "15%", size: 160, dur: 9.8, delay: 1.8, x: 40, op: 0.24 },
];

export function WipeHero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0); // -1 .. 1
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  // photo tilts toward the cursor; steam drifts away from it (depth)
  const rotateY = useTransform(sx, [-1, 1], [-2.4, 2.4]);
  const rotateX = useTransform(sy, [-1, 1], [1.8, -1.8]);
  const photoX = useTransform(sx, [-1, 1], [-10, 10]);
  const steamX = useTransform(sx, [-1, 1], [26, -26]);
  const steamSkew = useTransform(sx, [-1, 1], [3, -3]);

  const onPointerMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[#0C1215]"
      style={{ perspective: 1200 }}
    >
      {/* the scene — tilts with the cursor */}
      <motion.div
        className="absolute -inset-6"
        style={{ rotateX, rotateY, x: photoX, transformStyle: "preserve-3d" }}
        initial={{ scale: 1.08, opacity: 0.6 }}
        animate={{ scale: 1.02, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/brand/photos/clubhouse-patio.jpg"
          alt="Surface cleaner working in front of a white clubhouse, the patio half-washed and steaming"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* steam — drifts opposite the cursor for parallax depth */}
      <motion.div className="absolute inset-0 z-[5]" style={{ x: steamX, skewX: steamSkew }} aria-hidden>
        {PUFFS.map((p, i) => (
          <span
            key={i}
            className="steam-puff"
            style={{
              left: p.left,
              bottom: p.bottom,
              ["--puff-size" as string]: `${p.size}px`,
              ["--puff-dur" as string]: `${p.dur}s`,
              ["--puff-delay" as string]: `${p.delay}s`,
              ["--puff-x" as string]: `${p.x}px`,
              ["--puff-op" as string]: p.op,
            }}
          />
        ))}
        {/* ground mist along the wet concrete */}
        <span className="steam-mist inset-x-0 bottom-0 h-[26%]" />
      </motion.div>

      {/* legibility scrim — under the text, over the steam */}
      <div className="absolute inset-0 z-[6] bg-gradient-to-t from-black/70 via-black/20 to-black/25" />

      <div className="container-site relative z-10 flex h-full flex-col justify-end pb-24 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
            Homes, storefronts, roofs, and concrete across the Portland metro —
            washed with the right method for the surface, quoted the same day
            you ask.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <IridescentCTA href="/assessment">Get your same-day quote</IridescentCTA>
            <a
              href="/assessment"
              className="text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Property managers: book a free 21-point audit
            </a>
          </div>
        </motion.div>
      </div>

      <p className="absolute bottom-6 right-5 z-10 hidden text-xs text-white/55 md:block lg:right-8">
        Real job, shot mid-clean — that&apos;s our surface cleaner by the porch.
      </p>
    </section>
  );
}
