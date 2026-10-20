"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const FLY_MS = 4100; // hal-flyin.webp: 49 frames on twos (12fps), plays once

/** Hal swoops in on his rainbow trail, then hovers and judges. Two transparent animated
 *  WebPs: the fly-in ends on the exact frame the hover loop starts on, so the swap is
 *  invisible. The hover file is fetched, not mounted, before the swap: browsers share one
 *  animation clock per image URL, and a hidden copy would start the loop mid-cycle.
 *  Swapping late is harmless (he just holds the landing pose); swapping early would cut
 *  him off mid-flight, so the timer only starts once the fly-in has loaded. */
export function HalFlyIn({ className }: { className?: string }) {
  const still = useReducedMotion();
  const [landed, setLanded] = useState(false);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);

  useEffect(() => {
    if (still || loadedAt === null) return;
    fetch("/brand/hal/hal-hover.webp").catch(() => {});
    const t = setTimeout(() => setLanded(true), Math.max(0, FLY_MS - (performance.now() - loadedAt)));
    return () => clearTimeout(t);
  }, [still, loadedAt]);

  const src = still ? "/brand/hal/hal-still.webp" : landed ? "/brand/hal/hal-hover.webp" : "/brand/hal/hal-flyin.webp";

  return (
    <div className={className} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        src={src}
        alt=""
        width={360}
        height={410}
        className="h-auto w-full drop-shadow-[4px_10px_8px_rgba(40,30,20,.25)]"
        ref={(el) => {
          // the image may finish loading before React hydrates and attaches onLoad
          if (el?.complete && loadedAt === null && !landed) setLoadedAt(performance.now());
        }}
        onLoad={() => loadedAt === null && setLoadedAt(performance.now())}
      />
    </div>
  );
}
