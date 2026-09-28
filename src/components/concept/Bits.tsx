// Jet-age brand bits for the /concept page. One file: these are small and only used together.
import clsx from "clsx";
import type { ReactNode } from "react";

/** Primary button: ink pill; a three-band stripe sweeps across slowly, then a star twinkles on the top edge. */
export function RetroButton({ href, children, tone = "ink" }: { href: string; children: ReactNode; tone?: "ink" | "cream" }) {
  return (
    <a
      href={href}
      className={clsx(
        "group relative isolate inline-flex items-center rounded-full px-6 py-4 text-[15px] font-semibold leading-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-retro-sun",
        tone === "ink" ? "bg-brand-black text-white" : "bg-retro-pool text-brand-black",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-no-repeat motion-safe:animate-retro-sweep group-hover:[animation-duration:2.2s]"
        style={{
          backgroundImage:
            "linear-gradient(105deg,transparent 0 43%,#D6336C 43% 47%,#62C4EB 47% 51%,#F2B632 51% 55%,transparent 55% 100%)",
          backgroundSize: "300% 100%",
          backgroundPosition: "170% 0",
        }}
      />
      <span className="relative">{children}</span>
      <Twinkle className="pointer-events-none absolute -top-[11px] right-[14%] h-[22px] w-[22px] opacity-0 motion-safe:animate-retro-twinkle group-hover:[animation-duration:2.2s]" />
    </a>
  );
}

/** Eight-point twinkle star (never the four-point sparkle Pink's uses). */
export function Twinkle({ className, fill = "#F2B632" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path fill={fill} stroke="#0C1215" strokeWidth="1.6" strokeLinejoin="round"
        d="M20 1 L23 14 L34 6 L26 17 L39 20 L26 23 L34 34 L23 26 L20 39 L17 26 L6 34 L14 23 L1 20 L14 17 L6 6 L17 14Z" />
    </svg>
  );
}

/** Motel-sign starburst badge. */
export function Starburst({ className, top, bottom, fill = "#F2B632" }: { className?: string; top: string; bottom?: string; fill?: string }) {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 === 0 ? 96 : 80, a = (Math.PI * i) / 16 - Math.PI / 2;
    return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`${top} ${bottom ?? ""}`}>
      <polygon points={pts} fill={fill} stroke="#0C1215" strokeWidth="3" strokeLinejoin="round" />
      <text x="100" y={bottom ? 98 : 112} textAnchor="middle" fontFamily="clarendon-wide, Georgia, serif" fontWeight="700" fontSize="34" fill="#0C1215">{top}</text>
      {bottom && <text x="100" y="128" textAnchor="middle" fontFamily="prestige-elite-std, monospace" fontWeight="700" fontSize="15" fill="#0C1215">{bottom}</text>}
    </svg>
  );
}

/** 35mm slide mount around a photo, with a typed label on the mount. */
export function Slide({ src, alt, label, className, tilt = 0, children }: { src: string; alt: string; label: string; className?: string; tilt?: number; children?: ReactNode }) {
  return (
    <figure className={clsx("relative rounded-[26px] bg-retro-pool p-3 pb-10 shadow-[0_1px_0_rgba(12,18,21,.08),0_18px_40px_-12px_rgba(12,18,21,.35)] sm:p-4 sm:pb-12", className)} style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="relative overflow-hidden rounded-[16px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-full w-full object-cover" />
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(40,25,10,.35)]" />
      </div>
      <figcaption className="absolute inset-x-0 bottom-3 text-center font-typewriter text-[11px] uppercase tracking-[0.18em] text-brand-black/70 sm:bottom-4 sm:text-xs">{label}</figcaption>
      {children}
    </figure>
  );
}

/** The livery stripe: three bands, the middle one carries a scrolling line. The brand's one stripe device. */
export function Ticker({ items }: { items: string[] }) {
  const row = items.map((t) => (
    <span key={t} className="flex items-center gap-6 pr-6">
      <span>{t}</span>
      <Twinkle className="h-4 w-4 shrink-0" />
    </span>
  ));
  return (
    <div className="relative select-none" aria-label={items.join(". ")}>
      <div className="h-2.5 bg-retro-bloom" />
      <div className="overflow-hidden bg-brand-blue py-3">
        <div className="flex w-max font-typewriter text-sm font-bold uppercase tracking-[0.14em] text-brand-black motion-safe:animate-ticker">
          <div className="flex">{row}</div>
          <div className="flex" aria-hidden>{row}</div>
        </div>
      </div>
      <div className="h-2.5 bg-retro-sun" />
    </div>
  );
}

/** Small three-band tab: the stripe at card scale. */
export function StripeTab({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx("flex h-[7px] w-16 overflow-hidden rounded-full", className)}>
      <span className="flex-1 bg-retro-bloom" /><span className="flex-1 bg-brand-blue" /><span className="flex-1 bg-retro-sun" />
    </div>
  );
}

/** Formica-style scattered boomerangs + twinkles, as a background texture. */
export function boomerangPattern(opacity = 0.14) {
  const b = (x: number, y: number, r: number, c: string) =>
    `<g transform='translate(${x} ${y}) rotate(${r}) scale(.36)'><path d='M-90,-30 L-10,16 C-2,22 6,22 14,16 L76,-36 L12,2 C6,6 -2,6 -8,2Z' fill='${c}'/></g>`;
  const t = (x: number, y: number, c: string) =>
    `<path transform='translate(${x} ${y}) scale(.28)' d='M20 1 L23 14 L34 6 L26 17 L39 20 L26 23 L34 34 L23 26 L20 39 L17 26 L6 34 L14 23 L1 20 L14 17 L6 6 L17 14Z' fill='${c}'/>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='220' opacity='${opacity}'>${b(50, 50, -18, "%2362C4EB")}${b(190, 70, 24, "%23D6336C")}${b(120, 160, -6, "%230C1215")}${b(230, 190, 38, "%2362C4EB")}${t(150, 30, "%23F2B632")}${t(30, 150, "%2362C4EB")}${t(210, 120, "%23F2B632")}<circle cx='95' cy='95' r='2.4' fill='%230C1215'/><circle cx='20' cy='205' r='2.4' fill='%230C1215'/></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/</g, "%3C").replace(/>/g, "%3E").replace(/"/g, "'")}")`;
}
