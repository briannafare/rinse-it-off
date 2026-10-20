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
    <section className="relative overflow-hidden bg-retro-paper">
      <div className="mat film-grain relative flex min-h-[80vh] flex-col overflow-hidden">
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
            className="title-xl max-w-6xl font-title text-[13vw] leading-[0.92] text-[#0C1215] md:text-[clamp(3rem,4.6vw,5rem)]"
          >
            Free walkthrough.
            <br />
            <span>Firm price the same day.</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-[#0C1215]">
            We walk the property with you, note every surface that needs work, and
            leave you an itemized price you can take all of or part of. Same
            walkthrough whether it&rsquo;s your house or your building. If something we
            clean isn&rsquo;t right, we come back and re-rinse it free within 48 hours.
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-5">
            <RetroButton href="/assessment">
              Get your same-day quote
            </RetroButton>
            <a
              href="tel:+19716264146"
              className="link-plain bg-[#FBF8F2]/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D6336C]"
            >
              <Phone className="h-5 w-5" aria-hidden />
              (971) 626-4146
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
