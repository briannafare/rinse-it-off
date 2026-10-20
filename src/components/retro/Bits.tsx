// Late-60s brand layer: the small kit every page shares. Modern structure; the nostalgia
// comes from the photos, Hal, the title face and these few accents. Used sparingly:
// the signature button only on the main buttons, the stripe once per title card.
import clsx from "clsx";
import type { ReactNode } from "react";

/** Pill button. `signature` = the slow stripe sweep + twinkle, reserved for a page's main button. */
export function RetroButton({
  href,
  children,
  tone = "ink",
  signature = false,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "white" | "blue";
  signature?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={clsx(
        "group relative isolate inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold leading-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-retro-sun motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        tone === "ink" && "bg-brand-black text-white",
        tone === "white" && "bg-white text-brand-black",
        tone === "blue" && "bg-brand-blue text-brand-black",
        className,
      )}
    >
      {signature && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-no-repeat motion-safe:animate-retro-sweep"
          style={{
            backgroundImage:
              "linear-gradient(105deg,transparent 0 43%,#D6336C 43% 47%,#62C4EB 47% 51%,#F2B632 51% 55%,transparent 55% 100%)",
            backgroundSize: "300% 100%",
            backgroundPosition: "170% 0",
          }}
        />
      )}
      <span className="relative">{children}</span>
      {signature && (
        <Twinkle className="pointer-events-none absolute -top-[11px] right-[14%] h-[22px] w-[22px] opacity-0 motion-safe:animate-retro-twinkle" />
      )}
    </a>
  );
}

/** Eight-point twinkle star (never the four-point sparkle Pink's uses). */
export function Twinkle({ className, fill = "#F2B632" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path
        fill={fill}
        stroke="#0C1215"
        strokeWidth="1.6"
        strokeLinejoin="round"
        d="M20 1 L23 14 L34 6 L26 17 L39 20 L26 23 L34 34 L23 26 L20 39 L17 26 L6 34 L14 23 L1 20 L14 17 L6 6 L17 14Z"
      />
    </svg>
  );
}

/** Motel-sign starburst badge, for FREE and prices only. */
export function Starburst({ className, top, bottom }: { className?: string; top: string; bottom?: string }) {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 === 0 ? 96 : 80,
      a = (Math.PI * i) / 16 - Math.PI / 2;
    return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`${top} ${bottom ?? ""}`.trim()}>
      <polygon points={pts} fill="#F2B632" stroke="#0C1215" strokeWidth="3" strokeLinejoin="round" />
      <text x="100" y={bottom ? 100 : 114} textAnchor="middle" style={{ fontFamily: "var(--font-title)", fontVariationSettings: '"SOFT" 100, "opsz" 144' }} fontWeight="900" fontSize="44" fill="#0C1215">
        {top}
      </text>
      {bottom && (
        <text x="100" y="130" textAnchor="middle" fontFamily="futura-pt, sans-serif" fontWeight="600" fontSize="14" letterSpacing="2" fill="#0C1215">
          {bottom.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

/** The three-band stripe at card scale. Once per title card, never a banner. */
export function StripeTab({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx("flex h-[6px] w-16 overflow-hidden rounded-full", className)}>
      <span className="flex-1 bg-retro-bloom" />
      <span className="flex-1 bg-brand-blue" />
      <span className="flex-1 bg-retro-sun" />
    </div>
  );
}

/** Chapter title card between sections, centered like a film card. */
export function TitleCard({ chapter, title, tone = "pool" }: { chapter: string; title: string; tone?: "pool" | "paper" | "blue" | "ink" }) {
  return (
    <div
      className={clsx(
        "pb-8 pt-14 text-center md:pb-10 md:pt-20",
        tone === "pool" && "bg-retro-pool text-brand-black",
        tone === "paper" && "bg-retro-paper text-brand-black",
        tone === "blue" && "bg-brand-blue text-brand-black",
        tone === "ink" && "bg-brand-black text-white",
      )}
    >
      <div className="container-site flex flex-col items-center">
        <p className={clsx("label-caps", tone === "ink" ? "text-retro-sun" : tone === "blue" ? "text-brand-black/70" : "text-retro-muted")}>{chapter}</p>
        <p className="mt-3 font-title text-[clamp(2.6rem,9vw,4.6rem)] font-black leading-[0.95]">{title}</p>
        <StripeTab className="mt-5" />
      </div>
    </div>
  );
}
