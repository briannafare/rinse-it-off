"use client";
import Image from "next/image";
import { Phone } from "lucide-react";

/** The closer. Show a finished job and say plainly what happens next.
 *  The old version ran "This surface was gray last week. Yours is next." over an
 *  AI shot of a still-gray parking lot: the promise read as a threat and the photo
 *  contradicted it. Real photo of a real finished patio, and copy that names the
 *  next step instead of reaching for a line. */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[70vh] min-h-[480px]">
        <Image
          src="/brand/photos/patio-umbrellas.webp"
          alt="A clean aggregate concrete patio with tables and umbrellas after a wash"
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
            Free walkthrough.
            <br />
            <span style={{ color: "#62C4EB" }}>Firm price the same day.</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-white/85">
            We walk the property with you, note every surface that needs work, and
            leave you an itemized price you can take all of or part of. Same
            walkthrough whether it&rsquo;s your house or your building. If something we
            clean isn&rsquo;t right, tell us within 24 hours and we&rsquo;ll re-rinse it free
            within 48.
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
              (503) 704-3755
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
