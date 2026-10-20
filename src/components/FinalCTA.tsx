"use client";
import Image from "next/image";
import { Phone } from "lucide-react";
import { RetroButton } from "@/components/retro/Bits";

/** The closer. Show a finished job and say plainly what happens next.
 *  The old version ran "This surface was gray last week. Yours is next." over an
 *  AI shot of a still-gray parking lot: the promise read as a threat and the photo
 *  contradicted it. Real photo of a real finished patio, and copy that names the
 *  next step instead of reaching for a line. */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-retro-paper p-3 md:p-5">
      <div className="mat streak-r relative flex min-h-[70vh] flex-col overflow-hidden" style={{ "--streak-y": "10%", "--streak-len": "40%" } as React.CSSProperties}>
        <Image
          src="/brand/retro/final-truck.webp"
          alt="A Rinse It Off crew gearing up beside their work truck on a leafy street of mid-century houses"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF8F2]/95 via-[#FBF8F2]/55 to-transparent" />

        <div className="container-site relative flex flex-1 flex-col items-start justify-end pb-16 pt-28 md:pb-20">
          <h2
            className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-[#0C1215] md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Free walkthrough.
            <br />
            <span>Firm price the same day.</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-[#0C1215]/85">
            We walk the property with you, note every surface that needs work, and
            leave you an itemized price you can take all of or part of. Same
            walkthrough whether it&rsquo;s your house or your building. If something we
            clean isn&rsquo;t right, we come back and re-rinse it free within 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <RetroButton href="/assessment" signature>
              Get your same-day quote
            </RetroButton>
            <a
              href="tel:+19716264146"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#0C1215]/85 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB] motion-reduce:transition-none"
            >
              <Phone className="h-4 w-4" aria-hidden />
              (971) 626-4146
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
