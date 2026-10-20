"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sparkle } from "@/components/retro/Bits";

/** The seasonal strip at the top of every page (inside the fixed Navbar header).
 *  ponytail: one boolean is the on/off switch; flip it after the season. */
export const PROMO_ON = true;

export function PromoBar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    try { if (sessionStorage.getItem("rio-promo-hide") === "1") setHidden(true); } catch {}
  }, []);
  if (!PROMO_ON) return null;
  return (
    <div id="promo-bar" hidden={hidden} className="relative h-9 border-b border-[#26211B]/15 bg-[#EDE2CB] text-[#26211B]">
      <p className="flex h-full items-center justify-center gap-2 px-12 text-[13px] sm:text-sm">
        <Sparkle className="h-3 w-3 shrink-0" />
        <span className="truncate">
          <span className="font-semibold text-[#26211B] sm:hidden">Holiday lights</span>
          <span className="hidden font-semibold text-[#26211B] sm:inline">Now booking holiday light installs</span>
          <span className="hidden sm:inline"> for this season.</span>
        </span>
        <a href="/#holiday" className="shrink-0 font-semibold underline decoration-[#C2542B] decoration-2 underline-offset-4 hover:text-[#2F6B66]">
          See the details
        </a>
      </p>
      <button
        type="button"
        aria-label="Hide the holiday lights announcement"
        onClick={() => { setHidden(true); try { sessionStorage.setItem("rio-promo-hide", "1"); } catch {} }}
        className="absolute right-1 top-0 flex h-9 w-11 items-center justify-center text-[#26211B]/60 hover:text-[#26211B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-retro-sun"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
