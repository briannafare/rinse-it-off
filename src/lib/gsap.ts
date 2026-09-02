"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Scroll reveals for the marketing pages.
 *
 *  These animate POSITION ONLY, never opacity. Both hooks used to open with
 *  `opacity: 0` and restore it when ScrollTrigger fired, which meant anything
 *  that stopped ScrollTrigger from firing left real content permanently
 *  invisible: the two funnel doors, the before/after grid, the promise cards.
 *  Server HTML renders it all visible, so the bug only appeared after hydration
 *  and only for some visitors, which is the worst kind to catch.
 *
 *  Same rule CinematicHero follows. A reveal that fails should cost the
 *  animation, never the content. Don't reintroduce opacity here. */

/** Fade-up on scroll for a single element */
export function useScrollReveal(options?: { y?: number; delay?: number; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { y: 0 });
      return;
    }
    gsap.fromTo(el,
      { y: options?.y ?? 60 },
      {
        y: 0,
        duration: options?.duration ?? 1,
        delay: options?.delay ?? 0,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
    return () => { ScrollTrigger.getAll().forEach(t => { if (t.trigger === el) t.kill(); }); };
  }, []);
  return ref;
}

/** Staggered reveal for children */
export function useStaggerReveal(stagger = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const children = ref.current.children;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(children, { y: 0 });
      return;
    }
    gsap.fromTo(children,
      { y: 50 },
      {
        y: 0, duration: 0.8, stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      }
    );
    return () => { ScrollTrigger.getAll().forEach(t => { if (t.trigger === ref.current) t.kill(); }); };
  }, [stagger]);
  return ref;
}
