"use client";
import { useEffect, useRef, useState } from "react";

export function useInView(threshold = 0.15, once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return { ref, isInView };
}
