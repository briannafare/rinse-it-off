"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Fade-up on scroll for a single element */
export function useScrollReveal(options?: { y?: number; delay?: number; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.fromTo(el,
      { y: options?.y ?? 60, opacity: 0 },
      {
        y: 0, opacity: 1,
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
    gsap.fromTo(children,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      }
    );
  }, []);
  return ref;
}
