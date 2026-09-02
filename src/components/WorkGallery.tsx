"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

/** Recent work, straight off the truck. Horizontal scroll-snap slideshow —
 *  native scrolling on touch, arrows + gentle auto-advance on desktop.
 *  ponytail: no carousel lib; CSS scroll-snap + scrollBy is the whole engine. */
const SHOTS = [
  { src: "surface-cleaner-steam", alt: "Technician guiding a surface cleaner through a cloud of steam on a clubhouse walkway", caption: "Hot-water surface cleaning, clubhouse walkway." },
  { src: "driveway-before", alt: "Residential driveway covered in moss and grit in front of a cedar garage", caption: "Moss and grit on a driveway apron, before we started." },
  { src: "driveway-after", alt: "A residential driveway in the trees, washed clean and still wet", caption: "A driveway under the firs, finished." },
  { src: "clubhouse-entry", alt: "Clubhouse porte-cochère with freshly cleaned concrete and a hose still on the ground", caption: "Clubhouse entry, concrete just finished." },
  { src: "lot-steam-wide", alt: "Wide view of a parking lot with a technician surface cleaning under low clouds", caption: "Parking lot, early morning pass." },
  { src: "proshop-driveway", alt: "Curving driveway past a pro shop with the cleaned section still wet", caption: "Cart path and driveway by the pro shop." },
  { src: "tech-cone", alt: "Technician washing a curb edge behind an orange traffic cone", caption: "Curb and gutter line, coned off while we work." },
  { src: "curb-gleam", alt: "Close view of a wet, freshly cleaned concrete curb and walkway", caption: "Curb detail after rinse." },
  { src: "event-floor", alt: "Black event flooring rinsed and gleaming inside a temporary structure", caption: "Event flooring, LIV Golf Portland build-out." },
  { src: "event-path", alt: "Asphalt walkway lined with event signage being rinsed down", caption: "Spectator path, same event." },
  { src: "concrete-closeup", alt: "Close-up of concrete where two clean arcs meet untouched grime", caption: "Where the surface cleaner has and hasn't been." },
];

export function WorkGallery() {
  const track = useRef<HTMLDivElement>(null);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const w = el.firstElementChild?.clientWidth ?? el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * (w + 20), behavior: "smooth" });
  };

  // Auto-advance every 5s; pauses on hover/focus and honors reduced motion.
  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let paused = false;
    const on = () => (paused = true), off = () => (paused = false);
    el.addEventListener("pointerenter", on); el.addEventListener("pointerleave", off);
    el.addEventListener("focusin", on); el.addEventListener("focusout", off);
    const id = setInterval(() => { if (!paused && document.visibilityState === "visible") step(1); }, 5000);
    return () => { clearInterval(id); el.removeEventListener("pointerenter", on); el.removeEventListener("pointerleave", off); el.removeEventListener("focusin", on); el.removeEventListener("focusout", off); };
  }, []);

  return (
    <section id="work" className="bg-white py-16 md:py-24">
      <div className="container-site flex items-end justify-between gap-6">
        <header className="max-w-2xl">
          <h2
            className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Straight off the truck.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#4B5C6B]">
            Phone photos from real jobs around the Portland metro. Driveways and homes,
            clubhouses, parking lots and event grounds.
          </p>
        </header>
        <div className="hidden shrink-0 gap-2 md:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => step(d)}
              aria-label={d === 1 ? "Next photo" : "Previous photo"}
              className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-[#E4ECF1] transition-colors hover:bg-[#F4F7F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB]"
            >
              <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className={`h-4 w-4 ${d === -1 ? "rotate-180" : ""}`}>
                <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={track}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pl-[max(1.25rem,calc((100vw-80rem)/2+2rem))] pr-5 scroll-pl-[max(1.25rem,calc((100vw-80rem)/2+2rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Photos of recent jobs"
      >
        {SHOTS.map((s, i) => (
          <figure key={s.src} className="w-[82vw] shrink-0 snap-start sm:w-[420px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#E4ECF1] bg-[#F4F7F8]">
              <Image
                src={`/brand/photos/work/${s.src}.webp`}
                alt={s.alt}
                fill
                sizes="(min-width: 640px) 420px, 82vw"
                priority={i < 2}
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-[#4B5C6B]">{s.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
