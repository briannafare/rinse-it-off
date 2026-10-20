// Late-60s brand layer: the small kit every page shares (2026-10-20 finish brief: a bright 1968
// print ad on cream paper; sky is the calm ground, sun yellow marks decisions, magenta is the spark,
// and the three-stripe mark is the through-line). Modern structure; the period feel comes from type,
// frames and these accents.
import clsx from "clsx";
import type { ReactNode } from "react";

/** Print button: Futura caps, 14px corners, ink outline, hard offset shadow (CSS .btn-retro).
 *  Sun yellow by default (yellow marks decisions); "gold" = white, for use on a yellow ground.
 *  `signature` = the three-stripe sweep passing across now and then, for a page's main buttons. */
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
        "btn-retro group relative isolate inline-flex min-h-[52px] items-center justify-center gap-2 overflow-hidden px-7 py-4 leading-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#0C1215]",
        tone === "teal" && "bg-[#F2B632] text-[#0C1215]",
        tone === "cream" && "bg-[#FBF8F2] text-[#0C1215]",
        tone === "gold" && "bg-white text-[#0C1215]",
        className,
      )}
    >
      {signature && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-no-repeat motion-safe:animate-retro-sweep"
          style={{
            backgroundImage: STRIPES,
            backgroundSize: "300% 100%",
            backgroundPosition: "170% 0",
          }}
        />
      )}
      <span className="relative">{children}</span>
    </a>
  );
}

/** The brand mark: three thin parallel stripes, always magenta, sky, yellow, on a slight diagonal,
 *  like a light sweep. Thin and crisp: never equal colour blocks, never a band. */
export const STRIPES =
  "linear-gradient(105deg,transparent 0 43%,#D6336C 43% 47%,#62C4EB 47% 51%,#F2B632 51% 55%,transparent 55% 100%)";

/** The mark as an element (CSS .stripes keeps each stripe 4px wide at any size): a divider between
 *  sections, an underline under a title, the top edge of the footer. Size it with className. */
export function Stripes({ className }: { className?: string }) {
  return <span aria-hidden className={clsx("stripes block", className)} />;
}

/** Small four-point sparkle, one accent colour. */
export function Sparkle({ className, fill = "#D6336C" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path fill={fill} d="M10 0 C11 6 14 9 20 10 C14 11 11 14 10 20 C9 14 6 11 0 10 C6 9 9 6 10 0Z" />
    </svg>
  );
}

/** Motel-sign starburst badge, for FREE and prices only: magenta spark, white type, ink outline, tilted -6°. */
export function Starburst({ className, top, bottom }: { className?: string; top: string; bottom?: string }) {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 === 0 ? 96 : 80,
      a = (Math.PI * i) / 16 - Math.PI / 2;
    return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 200 200" className={clsx("-rotate-6", className)} role="img" aria-label={`${top} ${bottom ?? ""}`.trim()}>
      <polygon points={pts} fill="#D6336C" stroke="#0C1215" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <text x="100" y={bottom ? 100 : 114} textAnchor="middle" style={{ fontFamily: "var(--font-title)" }} fontWeight="900" fontSize="44" fill="#FFFFFF">
        {top}
      </text>
      {bottom && (
        <text x="100" y="130" textAnchor="middle" fontFamily="futura-pt, sans-serif" fontWeight="700" fontSize="14" letterSpacing="2" fill="#FFFFFF">
          {bottom.toUpperCase()}
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

/** Chapter title card between sections, centered like a film card. */
export function TitleCard({ chapter, title, tone = "pool" }: { chapter: string; title: string; tone?: "pool" | "paper" | "blue" | "ink" | "tealtint" | "sky" }) {
  const dark = tone === "ink" || tone === "blue";
  return (
    <div
      className={clsx(
        "pb-8 pt-14 text-center md:pb-10 md:pt-20",
        tone === "pool" && "bg-stars bg-retro-pool text-brand-black",
        tone === "paper" && "bg-stars bg-retro-paper text-brand-black",
        tone === "blue" && "bg-brand-blue text-[#0C1215]",
        tone === "ink" && "bg-brand-black text-[#0C1215]",
        tone === "tealtint" && "bg-stars bg-[#E6F5FC] text-[#0C1215]",
        tone === "sky" && "bg-stars bg-[#E6F5FC] text-[#0C1215]",
      )}
    >
      <div className="container-site flex flex-col items-center">
        <p className="flex items-center gap-2 font-label text-[12px] font-bold uppercase tracking-[0.14em]">
          {chapter}
          <Sparkle className="h-3 w-3" fill={dark ? "#F2B632" : "#D6336C"} />
        </p>
        <p className="mt-3 font-title text-[clamp(2.6rem,9vw,4.6rem)] leading-[0.95]">{title}</p>
        <Stripes className="mt-5 h-8 w-24" />
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
