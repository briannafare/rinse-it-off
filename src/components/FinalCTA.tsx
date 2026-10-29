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
      <div className="relative md:aspect-[16/9] md:min-h-[620px]">
        <div className="mat film-grain relative aspect-[3/2] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
        <Image
          src="/brand/retro/final-van.webp"
          alt="Three Rinse It Off cleaners wrapping up beside their white-and-teal van in the wet, freshly cleaned driveway of a mid-century house, one carrying a water-fed pole"
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        </div>
        <div className="absolute inset-0 hidden bg-gradient-to-t from-[#FBF8F2]/95 via-[#FBF8F2]/55 to-transparent md:block" />

        <div className="container-site relative flex flex-col items-start justify-end pb-16 pt-10 md:absolute md:inset-x-0 md:bottom-0 md:pb-20 md:pt-0">
          <h2
            className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-[#0C1215] md:text-6xl"
          >
            The walkthrough is free.
            <br />
            <span>The report is yours either way.</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-[#0C1215]">
            You get an itemized price the same day, for a parking lot or a driveway.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <RetroButton href="/assessment?type=commercial">Book a free commercial walkthrough</RetroButton>
            <RetroButton href="/assessment?type=residential">Get a price for your first home cleaning</RetroButton>
            <a
              href="tel:+19716264146"
              className="link-plain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]"
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
