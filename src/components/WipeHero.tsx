"use client";
import Image from "next/image";
import { IridescentCTA } from "./IridescentCTA";
import { useWipe } from "./useWipe";

const PHOTO = "/brand/photos/walkway-cleaner.jpg";

/** The site's one signature interaction: a full-bleed documentary photo where
 *  the grime wipes away. Drag the squeegee line (or arrow keys); it wipes
 *  itself once on load. Clean side reveals from the left. */
export function WipeHero() {
  const { pos, ref, handlers } = useWipe(0.62, true);

  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden select-none" ref={ref}>
      {/* dirty layer — the "before" treatment of the same scene */}
      <div className="absolute inset-0">
        <Image
          src={PHOTO}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.4) brightness(0.55) contrast(0.92) sepia(0.28)" }}
        />
      </div>

      {/* clean layer — revealed by the wipe */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${(1 - pos) * 100}% 0 0)` }}
      >
        <Image src={PHOTO} alt="Freshly cleaned walkway, Portland OR" fill priority sizes="100vw" className="object-cover" />
        {/* soft scrim so white text stays legible on the clean side */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />
      </div>

      {/* squeegee line + handle */}
      <div
        role="slider"
        aria-label="Wipe to reveal the clean surface"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos * 100)}
        tabIndex={0}
        className="absolute inset-y-0 z-20 w-12 -ml-6 cursor-ew-resize touch-none outline-none"
        style={{ left: `${pos * 100}%` }}
        {...handlers}
      >
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl border border-white/60 bg-white/20 backdrop-blur-md shadow-lg">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
            <path d="M5 1L1 6l4 5M13 1l4 5-4 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* content — sits over the wiped-clean area */}
      <div className="container-site relative z-10 flex h-full flex-col justify-end pb-24 md:pb-28">
        <h1
          className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          We make dirty buildings{" "}
          <span style={{ color: "#62C4EB" }}>clean.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/85 md:text-xl">
          164 days of rain per year. Your building feels every one. Exterior
          cleaning for Portland homes and commercial properties — the method
          matched to the surface, every time.
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
        <p className="mt-8 text-xs uppercase tracking-wide text-white/50 md:text-sm md:normal-case md:tracking-normal">
          Drag the line — that&apos;s the actual difference we make.
        </p>
      </div>
    </section>
  );
}
