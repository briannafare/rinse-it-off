"use client";
import Image from "next/image";
import { useWipe } from "./useWipe";

/** Proof in the same wipe language as the hero — drag to compare. */
export function BeforeAfter() {
  const { pos, ref, handlers } = useWipe(0.5);

  return (
    <section className="bg-[#F4F7F8] py-16 md:py-24">
      <div className="container-site">
        <h2
          className="max-w-2xl text-3xl font-medium text-[#0C1215] md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The moment dirt lets go.
        </h2>
        <p className="mt-3 max-w-xl text-[#4B5C6B]">
          Same concrete, same day. Drag the line yourself.
        </p>

        <div
          ref={ref}
          className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-[#E4ECF1] select-none md:mt-12"
        >
          <Image
            src="/brand/photos/before-after-concrete.jpg"
            alt="Concrete before cleaning"
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
            style={{ filter: "saturate(0.45) brightness(0.65) contrast(0.9) sepia(0.25)" }}
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${(1 - pos) * 100}% 0 0)` }}>
            <Image
              src="/brand/photos/before-after-concrete.jpg"
              alt="Concrete after cleaning by Rinse It Off"
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>

          <div
            role="slider"
            aria-label="Compare before and after"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos * 100)}
            tabIndex={0}
            className="absolute inset-y-0 z-10 w-12 -ml-6 cursor-ew-resize touch-none outline-none"
            style={{ left: `${pos * 100}%` }}
            {...handlers}
          >
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.55)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/25 backdrop-blur-md">
              <svg width="16" height="11" viewBox="0 0 18 12" fill="none" aria-hidden>
                <path d="M5 1L1 6l4 5M13 1l4 5-4 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <span className="absolute bottom-4 left-4 rounded-lg bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            After
          </span>
          <span className="absolute bottom-4 right-4 rounded-lg bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Before
          </span>
        </div>
      </div>
    </section>
  );
}
