// Late-60s brand layer: the small kit every page shares (2026-10-20 briefs: a bright 1968 print ad
// on cream paper; sky is the calm ground, sun yellow marks decisions, magenta is the spark, and the
// three-stripe band is the one big brand gesture). Scale is confident: big type, big buttons, no boxes.
import clsx from "clsx";
import type { ReactNode } from "react";

/** Print button (CSS .btn-retro): 60-64px tall, 22-24px bold type, heavy ink outline, hard offset
 *  shadow, full width on phone. Sun yellow by default; "gold" = white, for use on a yellow ground.
 *  `signature` is kept for callers and no longer draws anything (the stripe is never a small mark). */
export function RetroButton({
  href,
  children,
  tone = "teal",
  signature: _signature = false,
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
        "btn-retro group relative isolate focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#0C1215]",
        tone === "teal" && "bg-[#F2B632] text-[#0C1215]",
        tone === "cream" && "bg-[#FBF8F2] text-[#0C1215]",
        tone === "gold" && "bg-white text-[#0C1215]",
        className,
      )}
    >
      <span className="relative">{children}</span>
    </a>
  );
}

/** THE stripe, defined once: three bands side by side with no gaps (magenta, sky, sun, in that
 *  order), 10-22px each, running edge to edge on the same slight tilt (CSS .stripe-band). It has no
 *  height of its own, so it sits on the seam it is placed at: the hero's lower edge and the chapter
 *  breaks. Never shrink it, never use it as a corner ornament, never split the colours. */
export function StripeBand({ className }: { className?: string }) {
  return <div aria-hidden className={clsx("stripe-band", className)} />;
}

/** Small four-point sparkle, one accent colour. */
export function Sparkle({ className, fill = "#D6336C" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path fill={fill} d="M10 0 C11 6 14 9 20 10 C14 11 11 14 10 20 C9 14 6 11 0 10 C6 9 9 6 10 0Z" />
    </svg>
  );
}

/** The big offer starburst: three stacked bursts in the stripe colours (magenta outside, then sky,
 *  then sun), ink outline, ink type, tilted -6°. For the free window cleaning offer. */
export function Starburst({ className, top, bottom }: { className?: string; top: string; bottom?: string }) {
  const burst = (outer: number, inner: number) =>
    Array.from({ length: 32 }, (_, i) => {
      const r = i % 2 === 0 ? outer : inner,
        a = (Math.PI * i) / 16 - Math.PI / 2;
      return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  return (
    <svg viewBox="0 0 200 200" className={clsx("-rotate-6", className)} role="img" aria-label={`${top} ${bottom ?? ""}`.trim()}>
      <polygon points={burst(98, 84)} fill="#D6336C" stroke="#0C1215" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <polygon points={burst(84, 72)} fill="#62C4EB" />
      <polygon points={burst(72, 61)} fill="#F2B632" />
      <text x="100" y={bottom ? 102 : 116} textAnchor="middle" style={{ fontFamily: "var(--font-title)" }} fontWeight="900" fontSize="40" fill="#0C1215">
        {top}
      </text>
      {bottom && (
        <text x="100" y="126" textAnchor="middle" style={{ fontFamily: "var(--font-text)" }} fontWeight="700" fontSize="13" fill="#0C1215">
          {bottom}
        </text>
      )}
    </svg>
  );
}

/** Hand-drawn squiggle underline in one accent colour (replaces the three-colour dash). */
export function Squiggle({ className, color = "#D6336C" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={clsx("h-3 w-28", className)} aria-hidden fill="none">
      <path d="M2 7 C 12 2, 20 11, 30 6 S 48 2, 58 7 S 76 11, 86 6 S 104 2, 118 6" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Chapter title card between sections: one huge title on its own ground, with the stripe band
 *  on its top edge as the section break. `chapter` is kept for callers but no longer printed (no
 *  small eyebrow labels). The stripe is an accent (Bri 2026-10-20), so it is off by default here. */
export function TitleCard({ title, tone = "pool", stripe = false }: { chapter?: string; title: string; tone?: "pool" | "paper" | "tealtint" | "sky"; stripe?: boolean }) {
  return (
    <div
      className={clsx(
        "relative pb-8 pt-16 text-center text-[#0C1215] md:pb-10 md:pt-20",
        tone === "pool" && "bg-retro-pool",
        tone === "paper" && "bg-retro-paper",
        (tone === "tealtint" || tone === "sky") && "bg-[#E6F5FC]",
      )}
    >
      {stripe && <StripeBand className="absolute inset-x-0 top-0" />}
      <div className="container-site">
        <p className="font-title text-[13vw] leading-[0.9] [text-wrap:balance] md:text-[clamp(3rem,4.6vw,5rem)]">{title}</p>
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
        <circle cx="100" cy="100" r="96" fill="#F2B632" stroke="#0C1215" strokeWidth="3" />
        <circle cx="100" cy="100" r="62" fill="#FBF8F2" stroke="#0C1215" strokeWidth="2.5" />
        <defs><path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <g className="origin-center motion-safe:animate-[spin_36s_linear_infinite]" style={{ transformBox: "fill-box" }}>
          <text fontFamily="futura-pt, sans-serif" fontWeight="600" fontSize="14.5" letterSpacing="2.2" fill="#0C1215">
            <textPath href={`#${id}`}>{text.toUpperCase()}</textPath>
          </text>
        </g>
        <text x="100" y="110" textAnchor="middle" style={{ fontFamily: "var(--font-title)" }} fontSize="30" fill="#0C1215">{center}</text>
      </svg>
    </div>
  );
}
