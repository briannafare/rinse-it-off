// Late-60s brand layer: the small kit every page shares (restyled to the 2026-10-19 brief:
// warm paper, spruce teal, harvest gold, one burnt-orange detail per section, no gradients,
// no multi-colour dashes). Modern structure; the period feel comes from type, frames and these accents.
import clsx from "clsx";
import type { ReactNode } from "react";

/** Print button: Futura caps, 14px corners, ink outline, hard offset shadow (CSS .btn-retro).
 *  Teal by default; gold on dark bands (CSS). `signature` = a single gold shine that passes across
 *  now and then, reserved for a page's main buttons. */
export function RetroButton({
  href,
  children,
  tone = "teal",
  signature = false,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "teal" | "cream" | "gold";
  signature?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={clsx(
        "btn-retro group relative isolate inline-flex min-h-[52px] items-center justify-center gap-2 overflow-hidden px-7 py-4 leading-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-retro-sun",
        tone === "teal" && "bg-[#2F6B66] text-[#F5EDDC]",
        tone === "cream" && "bg-[#F5EDDC] text-[#26211B]",
        tone === "gold" && "bg-[#E4A33C] text-[#26211B]",
        className,
      )}
    >
      {signature && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-no-repeat motion-safe:animate-retro-sweep"
          style={{
            backgroundImage: "linear-gradient(105deg,transparent 0 44%,rgba(228,163,60,.55) 44% 52%,transparent 52% 100%)",
            backgroundSize: "300% 100%",
            backgroundPosition: "170% 0",
          }}
        />
      )}
      <span className="relative">{children}</span>
    </a>
  );
}

/** Small four-point sparkle, one accent colour. */
export function Sparkle({ className, fill = "#C2542B" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path fill={fill} d="M10 0 C11 6 14 9 20 10 C14 11 11 14 10 20 C9 14 6 11 0 10 C6 9 9 6 10 0Z" />
    </svg>
  );
}

/** Motel-sign starburst badge, for FREE and prices only: gold fill, 1.5px ink outline, tilted -6°. */
export function Starburst({ className, top, bottom }: { className?: string; top: string; bottom?: string }) {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 === 0 ? 96 : 80,
      a = (Math.PI * i) / 16 - Math.PI / 2;
    return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 200 200" className={clsx("-rotate-6", className)} role="img" aria-label={`${top} ${bottom ?? ""}`.trim()}>
      <polygon points={pts} fill="#E4A33C" stroke="#26211B" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <text x="100" y={bottom ? 100 : 114} textAnchor="middle" style={{ fontFamily: "var(--font-title)" }} fontWeight="900" fontSize="44" fill="#26211B">
        {top}
      </text>
      {bottom && (
        <text x="100" y="130" textAnchor="middle" fontFamily="futura-pt, sans-serif" fontWeight="700" fontSize="14" letterSpacing="2" fill="#26211B">
          {bottom.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

/** Hand-drawn squiggle underline in one accent colour (replaces the three-colour dash). */
export function Squiggle({ className, color = "#C2542B" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={clsx("h-3 w-28", className)} aria-hidden fill="none">
      <path d="M2 7 C 12 2, 20 11, 30 6 S 48 2, 58 7 S 76 11, 86 6 S 104 2, 118 6" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Chapter title card between sections, centered like a film card. */
export function TitleCard({ chapter, title, tone = "pool" }: { chapter: string; title: string; tone?: "pool" | "paper" | "blue" | "ink" }) {
  const dark = tone === "ink" || tone === "blue";
  return (
    <div
      className={clsx(
        "pb-8 pt-14 text-center md:pb-10 md:pt-20",
        tone === "pool" && "bg-stars bg-retro-pool text-brand-black",
        tone === "paper" && "bg-stars bg-retro-paper text-brand-black",
        tone === "blue" && "bg-brand-blue text-[#F5EDDC]",
        tone === "ink" && "bg-brand-black text-[#F5EDDC]",
      )}
    >
      <div className="container-site flex flex-col items-center">
        <p className="flex items-center gap-2 font-label text-[12px] font-bold uppercase tracking-[0.14em]">
          {chapter}
          <Sparkle className="h-3 w-3" fill={dark ? "#E4A33C" : "#C2542B"} />
        </p>
        <p className="mt-3 font-title text-[clamp(2.6rem,9vw,4.6rem)] leading-[0.95]">{title}</p>
        <Squiggle className="mt-4" color={dark ? "#E4A33C" : "#C2542B"} />
      </div>
    </div>
  );
}

/** Slowly turning round seal: text set on a circle around a small centre mark, like a 1960s
 *  sticker or service badge. Decorative; the words also appear elsewhere on the page. */
export function Seal({ text, className, center = "FREE" }: { text: string; className?: string; center?: string }) {
  const id = "seal-" + text.length;
  return (
    <div aria-hidden className={clsx("pointer-events-none select-none", className)}>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#E4A33C" stroke="#26211B" strokeWidth="3" />
        <circle cx="100" cy="100" r="62" fill="#F5EDDC" stroke="#26211B" strokeWidth="2.5" />
        <defs><path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <g className="origin-center motion-safe:animate-[spin_36s_linear_infinite]" style={{ transformBox: "fill-box" }}>
          <text fontFamily="futura-pt, sans-serif" fontWeight="600" fontSize="14.5" letterSpacing="2.2" fill="#26211B">
            <textPath href={`#${id}`}>{text.toUpperCase()}</textPath>
          </text>
        </g>
        <text x="100" y="110" textAnchor="middle" style={{ fontFamily: "var(--font-title)" }} fontSize="30" fill="#26211B">{center}</text>
      </svg>
    </div>
  );
}
