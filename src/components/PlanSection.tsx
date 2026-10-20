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
  PLAN_LABEL,
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

  return (
    <section id="plan" className="bg-[#D7EFE9] pb-16 md:pb-24">
      <div ref={ref} className="container-site">
        <header className="mx-auto max-w-3xl text-center">
          <p className="label-caps text-[#12433F]">{PLAN_LABEL}</p>
          <h2 className="mt-3 text-[2.1rem] leading-[1.02] text-[#12433F] [text-wrap:balance] md:text-[3rem]">{PLAN_HEADLINE}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#102E32]">{PLAN_BODY}</p>
        </header>

        {/* The four visits */}
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
          {SEASONS.map((s) => (
            <li key={s.name} className="frame grid grid-cols-[96px_1fr] gap-4 overflow-hidden bg-retro-paper p-4 sm:block sm:p-0">
              <div className="relative aspect-square overflow-hidden rounded-[10px] sm:rounded-none sm:border-b-2 sm:border-[#102E32]">
                <Image src={s.img} alt={`Illustration: ${s.title.toLowerCase()} cleaning in ${s.name.toLowerCase()}`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 96px" className="object-cover" />
              </div>
              <div className="sm:p-5">
                <p className="label-caps !tracking-[0.14em] text-[#2F6B66]">{s.name}</p>
                <h3 className="mt-1 font-title text-[1.35rem] font-black leading-tight text-[#102E32]">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-snug text-[#3E5A5D]">{s.work}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Free window cleaning, every visit */}
        <div className="frame relative mt-4 grid overflow-visible bg-[#D6336C] text-white md:grid-cols-[1fr_1.3fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-[14px] md:aspect-auto md:rounded-l-[14px] md:rounded-tr-none">
            <Image src="/brand/retro/mi-glass.webp" alt="Illustration: a cleaner washing a tall picture window from the ground with a water-fed pole" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="relative p-6 md:p-10 md:pr-44">
            <Starburst top="FREE" bottom="window cleaning" className="absolute -top-14 right-3 w-28 rotate-6 md:right-6 md:top-6 md:w-36" />
            <p className="label-caps !tracking-[0.14em] text-white">Every visit</p>
            <h3 className="mt-1 font-title text-[1.9rem] font-black leading-tight md:text-[2.3rem]">{free}.</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-white">{windowsRest.join(". ")}</p>
          </div>
        </div>

        {/* What else comes with it, the value, and the price */}
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.15fr]">
          <div className="frame bg-retro-paper p-6 md:p-8">
            <p className="label-caps !tracking-[0.14em] text-retro-muted">Also included</p>
            <ul className="mt-4 grid gap-3">
              {PLAN_INCLUDED.map((x) => (
                <li key={x} className="flex gap-3 text-[#102E32]">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="frame bg-[#62C4EB] p-6 text-[#102E32] md:p-8">
            <p className="label-caps !tracking-[0.14em] text-[#102E32]">What it&rsquo;s worth</p>
            <p className="mt-3 text-[1.05rem] leading-relaxed">{PLAN_VALUE}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <RetroButton href="/plan?src=home" signature>
                See my price
              </RetroButton>
              <a
                href="/contact"
                className="inline-flex min-h-[52px] items-center rounded-full px-6 text-[15px] font-semibold text-[#102E32] ring-2 ring-[#102E32] transition-colors hover:bg-white/40 focus-visible:outline-none focus-visible:ring-4"
              >
                Talk to us first
              </a>
            </div>
            <p className="mt-3 text-sm text-[#102E32]">{PLAN_CTA_NOTE}</p>
            <p className="mt-1 text-sm text-[#102E32]">{PLAN_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
