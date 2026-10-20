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

const BULBS = ["#62C4EB", "#D6336C", "#62C4EB", "#D6336C"]; // sky and magenta bulbs

export function HolidayLights() {
  return (
    <section id="holiday" className="relative scroll-mt-28 overflow-hidden bg-[#F2B632] text-[#0C1215]">
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

      <div className="pb-20 pt-10 md:pb-28">
        <div className="mat film-grain relative aspect-[4/3] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src="/brand/retro/holiday-install.webp"
            alt="Two Rinse It Off crew members adding the last strand of big colored bulbs to a mid-century house covered in holiday lights, light-up carolers in the yard and a family watching from the lawn"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="container-site mt-12 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-16">
          <div>
          <h2 className="[text-wrap:balance]">
            We put up your holiday lights, take them down after the season, and you never climb a ladder.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#0C1215]/85">
            Every December someone on the block spends a Saturday on a ladder with a tangle of lights, half of them
            out. This year it doesn&rsquo;t have to be you. We plan the layout with you, cut pro-grade lights to fit your
            roofline, and have them glowing before Thanksgiving. After the holidays we take them down and store them
            for next year.
          </p>
          </div>
          <div>
          <ul className="grid gap-4 text-lg">
            {INCLUDED.map((x) => (
              <li key={x} className="flex gap-3">
                <Check className="mt-1 h-6 w-6 shrink-0 text-[#0C1215]" aria-hidden />
                <span>{x}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-xl text-lg text-[#0C1215]/85">
            Every house is different, so we price lights by the foot after that visit. Install dates before
            Thanksgiving go first, so the sooner you book the visit, the more dates you can pick from.
          </p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
            <RetroButton href="/assessment?type=residential&src=holiday-lights" tone="gold">
              Book my lights visit
            </RetroButton>
            <a href="tel:+19716264146" className="btn-ghost focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0C1215]">
              <Phone className="h-5 w-5" aria-hidden />
              Call or text (971) 626-4146
            </a>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
