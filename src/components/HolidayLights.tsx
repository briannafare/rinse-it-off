import Image from "next/image";
import { Check, Phone } from "lucide-react";
import { RetroButton } from "@/components/retro/Bits";

/** Seasonal promo: holiday light installs. Linked from the strip at the top of every page
 *  (PromoBar). Truth rules: lights are priced by the foot after a site visit, so no price is
 *  printed; the package (design visit, lights cut to the roofline, installed before
 *  Thanksgiving, taken down and stored) is Bri's own, 2026-09-01. Take this section and the
 *  strip down after the season (PROMO_ON in PromoBar.tsx). */
const INCLUDED = [
  "A visit at your house to plan the design",
  "Pro-grade lights cut to fit your roofline",
  "Installed before Thanksgiving",
  "Taken down after the holidays and stored until next year",
  "Trees, wreaths and extras if you want them",
];

const BULBS = ["#F2B632", "#D6336C", "#62C4EB", "#F3EDE2"];

export function HolidayLights() {
  return (
    <section id="holiday" className="relative scroll-mt-28 overflow-hidden bg-[#0B1A2A] text-white">
      {/* a string of bulbs along the top edge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-10">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-10 w-full">
          <path d="M0 6 Q 37.5 26 75 6 T 150 6 T 225 6 T 300 6 T 375 6 T 450 6 T 525 6 T 600 6 T 675 6 T 750 6 T 825 6 T 900 6 T 975 6 T 1050 6 T 1125 6 T 1200 6" fill="none" stroke="#2a3a4a" strokeWidth="2" />
        </svg>
        <div className="absolute inset-x-0 top-[14px] flex justify-between px-[3%]">
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className="block h-3 w-2 rounded-full motion-safe:animate-[bulb_2.4s_ease-in-out_infinite]"
              style={{ background: BULBS[i % 4], boxShadow: `0 0 10px 2px ${BULBS[i % 4]}99`, animationDelay: `${(i % 5) * 0.4}s` }}
            />
          ))}
        </div>
      </div>

      <div className="container-site grid gap-8 pb-16 pt-20 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-14 md:pb-24 md:pt-24">
        <div className="frame frame-light film-grain relative aspect-[3/2] overflow-hidden md:order-2">
          <Image
            src="/brand/retro/holiday-install.webp"
            alt="Two Rinse It Off crew members adding the last strand of big colored bulbs to a mid-century house covered in holiday lights, light-up carolers in the yard and a family watching from the lawn"
            fill
            sizes="(min-width: 768px) 48vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="label-caps text-retro-sun">Holiday lights · Now booking</p>
          <h2 className="mt-3 text-[2.2rem] leading-[1] [text-wrap:balance] md:text-[3.1rem]">
            We put up your holiday lights, take them down after the season, and you never climb a ladder.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Every December someone on the block spends a Saturday on a ladder with a tangle of lights, half of them
            out. This year it doesn&rsquo;t have to be you. We plan the layout with you, cut pro-grade lights to fit your
            roofline, and have them glowing before Thanksgiving. After the holidays we take them down and store them
            for next year.
          </p>
          <ul className="mt-6 grid gap-2.5">
            {INCLUDED.map((x) => (
              <li key={x} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-retro-sun" aria-hidden />
                <span>{x}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-xl text-white/75">
            Every house is different, so we price lights by the foot after that visit. Install dates before
            Thanksgiving go first, so the sooner you book the visit, the more dates you can pick from.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <RetroButton href="/assessment?type=residential&src=holiday-lights" tone="sun" signature>
              Book my lights visit
            </RetroButton>
            <a href="tel:+19716264146" className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 font-semibold text-white hover:text-retro-sun focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-retro-sun">
              <Phone className="h-4 w-4" aria-hidden />
              Call or text (971) 626-4146
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
