"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";
import { RetroButton, Starburst } from "@/components/retro/Bits";
import {
  PLAN_BODY,
  PLAN_CTA_NOTE,
  PLAN_EVERY_VISIT,
  PLAN_HEADLINE,
  PLAN_INCLUDED,
  PLAN_NOTE,
  PLAN_SEASONS as SEASONS,
  PLAN_VALUE,
} from "@/lib/plan-copy";

/** The yearly plan, sold: what happens each season (each with its own 1960s illustration),
 *  the free window cleaning, what else comes with it, the honest value math, then the price.
 *  Copy and the numbers' sources live in src/lib/plan-copy.ts. Two ways in: the instant price
 *  at /plan, or a conversation at /contact. */
export function PlanSection() {
  const ref = useStaggerReveal(0.08);
  const [free, ...windowsRest] = PLAN_EVERY_VISIT.split(". ");

  // the same left edge as the page container, so the phone slider lines up with the type
  const EDGE = "px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]";

  return (
    <section id="plan" className="bg-[#E6F5FC] pb-20 md:pb-28">
      <div ref={ref}>
        <header className="container-site mx-auto max-w-5xl text-center">
          <h2 className="text-[#0C1215] [text-wrap:balance]">{PLAN_HEADLINE}</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#0C1215]">{PLAN_BODY}</p>
        </header>

        {/* The four visits: big unboxed panels, a slider on phone (85vw), two across on desktop */}
        <ol className={`mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-16 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-14 md:overflow-visible [&::-webkit-scrollbar]:hidden ${EDGE} scroll-pl-4`}>
          {SEASONS.map((s) => (
            <li key={s.name} className="w-[85vw] shrink-0 snap-start md:w-auto">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={s.img} alt={`Illustration: ${s.title.toLowerCase()} cleaning in ${s.name.toLowerCase()}`} fill sizes="(min-width: 768px) 50vw, 85vw" className="object-cover" />
              </div>
              <h3 className="mt-5 text-[#0C1215]">{s.name}: {s.title}</h3>
              <p className="mt-2 text-lg leading-snug text-[#3B4247]">{s.work}</p>
            </li>
          ))}
        </ol>

        {/* Free window cleaning, every visit: the big offer moment */}
        <div className="relative mt-16 grid bg-[#F2B632] text-[#0C1215] md:mt-24 md:grid-cols-[1.35fr_1fr]">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[560px]">
            <Image src="/brand/retro/mi-glass.webp" alt="Illustration: a cleaner washing a tall picture window from the ground with a water-fed pole" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          </div>
          <div className="relative px-4 pb-12 pt-24 sm:px-8 md:px-12 md:pb-16 md:pt-52">
            <Starburst top="FREE" bottom="window cleaning" className="absolute -top-24 right-3 w-48 rotate-6 md:-top-20 md:right-8 md:w-64" />
            <h3 className="text-[#0C1215]">{free}.</h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#0C1215]">{windowsRest.join(". ")}</p>
          </div>
        </div>

        {/* What else comes with it, the value, and the price: colour grounds, no boxes */}
        <div className="container-site mt-16 grid gap-12 md:mt-24 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-[#0C1215]">Also included</h3>
            <ul className="mt-6 grid gap-4">
              {PLAN_INCLUDED.map((x) => (
                <li key={x} className="flex gap-3 text-lg text-[#0C1215]">
                  <Check className="mt-1 h-6 w-6 shrink-0 text-[#1A6E93]" aria-hidden />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="-mx-4 bg-[#62C4EB] px-4 py-10 text-[#0C1215] sm:-mx-6 sm:px-6 md:mx-0 md:px-10 md:py-12">
            <h3 className="text-[#0C1215]">What it&rsquo;s worth</h3>
            <p className="mt-4 text-lg leading-relaxed">{PLAN_VALUE}</p>
            <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
              <RetroButton href="/plan?src=home">See my price</RetroButton>
              <a href="/contact" className="btn-ghost focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0C1215]">
                Talk to us first
              </a>
            </div>
            <p className="mt-5 text-base text-[#0C1215]">{PLAN_CTA_NOTE}</p>
            <p className="mt-1 text-base text-[#0C1215]">{PLAN_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
