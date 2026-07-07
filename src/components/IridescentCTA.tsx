"use client";
import { useCallback, useRef } from "react";
import { ArrowRight } from "lucide-react";

/** The signature liquid-glass CTA (design system: .iri-btn). Use ONCE per view,
 *  always over content (photo/aura) — never on flat white. Cursor-reactive
 *  specular + tilt, ported from the design system's iridescent.js. */
export function IridescentCTA({
  href,
  children,
  finish = "iri-soap",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  finish?: "iri-soap" | "iri-ink";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const TILT = 12;

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const btn = ref.current;
    if (!btn || e.pointerType !== "mouse") return;
    const r = btn.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    btn.style.setProperty("--mx", `${x * 100}%`);
    btn.style.setProperty("--my", `${y * 100}%`);
    btn.style.transform = `perspective(900px) rotateX(${((y - 0.5) * -TILT).toFixed(2)}deg) rotateY(${((x - 0.5) * TILT).toFixed(2)}deg) scale(1.02)`;
  }, []);

  const onPointerLeave = useCallback(() => {
    const btn = ref.current;
    if (btn) btn.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={`iri-btn ${finish} ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className="iri-film" aria-hidden />
      <span className="iri-spec" aria-hidden />
      <span className="iri-label">{children}</span>
      <span className="iri-arrow" aria-hidden><ArrowRight /></span>
    </a>
  );
}
