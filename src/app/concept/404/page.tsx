import type { Metadata } from "next";
import { RetroButton, Ticker } from "@/components/concept/Bits";
import { HalHover } from "@/components/concept/Motion";

// Preview of the "page not found" screen in the jet-age look.
export const metadata: Metadata = { title: "Concept · Page not found", robots: { index: false, follow: false }, icons: { icon: "/concept/hal-mark.svg" } };

export default function NotFoundPreview() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-blue font-body text-brand-black">
      <link rel="stylesheet" href="https://use.typekit.net/pth7mbe.css" precedence="default" />
      <main className="container-site grid flex-1 items-center gap-10 py-16 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-typewriter text-xs font-bold uppercase tracking-[0.2em]">Error 404</p>
          <h1 className="mt-4 font-clarendon text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[1.02] [text-shadow:4px_4px_0_#F3EDE2]">This page isn’t here.</h1>
          <p className="mt-5 max-w-[42ch] text-lg">Hal checked every window on the block. It’s not behind any of them either.</p>
          <div className="mt-8"><RetroButton href="/concept">Back to the home page</RetroButton></div>
        </div>
        <HalHover src="/concept/hal-wings-crossed.png" alt="Hal, arms crossed, unimpressed" className="mx-auto w-56 md:w-72" />
      </main>
      <Ticker items={["Free window cleaning, four times a year", "Photo proof every visit", "48-hour re-rinse guarantee"]} />
    </div>
  );
}
