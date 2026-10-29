"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sparkle } from "@/components/retro/Bits";

/** The seasonal strip at the top of every page (inside the fixed Navbar header). It folds away
 *  once the page scrolls, so it never sits over a headline or a button.
 *  ponytail: one boolean is the on/off switch; flip it after the season. */
export const PROMO_ON = true;

export function PromoBar({ collapsed = false }: { collapsed?: boolean }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    try { if (sessionStorage.getItem("rio-promo-hide") === "1") setHidden(true); } catch {}
  }, []);
  if (!PROMO_ON) return null;
  return (
    <div id="promo-bar" hidden={hidden} className={`relative overflow-hidden bg-[#62C4EB] text-[#0C1215] transition-[height] duration-300 motion-reduce:transition-none ${collapsed ? "h-0" : "h-9"}`}>
      <p className="flex h-9 items-center justify-center gap-2 px-12 text-sm">
        <Sparkle className="h-3 w-3 shrink-0" fill="#F2B632" />
        <span className="truncate">
          <span className="font-semibold text-[#0C1215] sm:hidden">Holiday lights</span>
          <span className="hidden font-semibold text-[#0C1215] sm:inline">Now booking holiday light installs</span>
          <span className="hidden sm:inline"> for this season.</span>
        </span>
        <a href="/holiday-lights" className="shrink-0 font-semibold underline decoration-[#F2B632] decoration-2 underline-offset-4 hover:decoration-[#D6336C]">
          See the details
        </a>
      </p>
      <button
        type="button"
        aria-label="Hide the holiday lights announcement"
        onClick={() => { setHidden(true); try { sessionStorage.setItem("rio-promo-hide", "1"); } catch {} }}
        className="absolute right-1 top-0 flex h-9 w-11 items-center justify-center text-[#0C1215]/80 hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C1215]"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
