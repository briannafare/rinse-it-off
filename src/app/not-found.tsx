import type { Metadata } from "next";
import { RetroButton, Squiggle } from "@/components/retro/Bits";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Hal, unimpressed, on the one page nobody meant to visit. */
export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-retro-pool px-5 py-16 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/hal/hal-still.webp" alt="Hal the hummingbird, hovering and unimpressed" width={360} height={410} className="w-40 md:w-52" />
      <p className="label-caps mt-6 text-retro-muted">Error 404</p>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(2.4rem,7vw,4.2rem)] font-bold leading-none text-brand-black">This page isn&rsquo;t here.</h1>
      <p className="mt-4 max-w-md text-lg text-retro-muted">Hal checked twice. The rest of the site is right where we left it.</p>
      <Squiggle className="my-8" />
      <RetroButton href="/">Back to the home page</RetroButton>
    </main>
  );
}
