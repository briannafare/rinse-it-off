"use client";
import Image from "next/image";
import { Phone } from "lucide-react";

/** The closer: show them the after — a surface restored from gray to bright. */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[70vh] min-h-[480px]">
        <Image
          src="/brand/photos/surface-cleaning.webp"
          alt="A concrete surface being rinsed clean, restored from gray to bright"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1215]/85 via-black/30 to-black/10" />

        <div className="container-site relative flex h-full flex-col items-start justify-end pb-16 md:pb-20">
          <h2
            className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            This surface was gray last week.
            <br />
            <span style={{ color: "#62C4EB" }}>Yours is next.</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-white/85">
            Book your free 21-point property audit and get a firm, itemized
            quote the same day we walk your property — home or business. Backed
            by our Clean Water Promise: we re-rinse anything you&rsquo;re not
            happy with, free, within 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href="/assessment"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
            >
              Get your same-day quote
            </a>
            <a
              href="tel:+15037043755"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
            >
              <Phone className="h-4 w-4" aria-hidden />
              (503) 704-3755 — talk to the team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
