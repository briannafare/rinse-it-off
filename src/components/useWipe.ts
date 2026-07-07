"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Drag-to-wipe state shared by the hero and the before/after slider.
 *  Returns the wipe position (0..1) and handlers to wire to the container. */
export function useWipe(initial = 0.5, intro = false) {
  const [pos, setPos] = useState(intro ? 0.08 : initial);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const interacted = useRef(false);

  // one self-wipe on mount — "the moment dirt lets go" — until the user grabs it
  useEffect(() => {
    if (!intro) return;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      if (interacted.current) return;
      const k = Math.min(1, (t - start) / 1900);
      const e = 1 - Math.pow(1 - k, 3); // ease-out cubic
      setPos(0.08 + e * (initial - 0.08));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [intro, initial]);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(0.985, Math.max(0.015, (clientX - r.left) / r.width)));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    interacted.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    move(e.clientX);
  }, [move]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging.current) move(e.clientX);
  }, [move]);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { interacted.current = true; setPos(p => Math.max(0.015, p - 0.05)); }
    if (e.key === "ArrowRight") { interacted.current = true; setPos(p => Math.min(0.985, p + 0.05)); }
  }, []);

  return { pos, ref, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onKeyDown } };
}
