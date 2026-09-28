import type { Metadata } from "next";
import { RetroButton, Starburst, Ticker, StripeTab } from "@/components/concept/Bits";
import { HalHover, HeroFilm, Reveal } from "@/components/concept/Motion";

// Concept: a modern, innovative exterior cleaning company wearing a late-60s brand.
// Modern structure, type and motion; the nostalgia lives in the photography, Hal and a few accents.
export const metadata: Metadata = {
  title: "Concept · Jet Age",
  robots: { index: false, follow: false },
  icons: { icon: "/concept/hal-mark.svg" },
};

const TICKER_TOP = [
  "Free window cleaning, four times a year",
  "Pure water, no spots",
  "Photo proof every visit",
  "48-hour re-rinse guarantee",
  "Free 21-point inspection for commercial properties",
];
const CITIES = ["Portland", "Beaverton", "Lake Oswego", "Tigard", "Hillsboro", "Gresham", "Milwaukie", "Tualatin", "West Linn", "the Willamette Valley"];

const eyebrow = "text-xs font-semibold uppercase tracking-[0.18em]";
const h2 = "font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.015em] [text-wrap:balance]";

export default function ConceptPage() {
  return (
    <div className="bg-white font-body text-brand-black">
      <link rel="stylesheet" href="https://use.typekit.net/pth7mbe.css" precedence="default" />

      {/* HERO: the film is the hero. Hal hovers over the live action. */}
      <header className="relative flex h-[92svh] min-h-[640px] max-h-[980px] flex-col overflow-hidden bg-brand-black text-white">
        <HeroFilm src="/concept/hero.mp4" poster="/concept/hero-poster.jpg" className="absolute inset-0 h-full w-full object-cover object-[60%_40%]" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <nav className="container-site relative z-20 flex w-full items-center justify-between py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/concept/logo-white.png" alt="Rinse It Off" className="h-12 w-auto" />
          <div className="hidden gap-8 text-[15px] font-medium md:flex">
            <a href="#homes" className="hover:underline">Homes</a>
            <a href="#commercial" className="hover:underline">Commercial</a>
            <a href="#how" className="hover:underline">How we clean</a>
          </div>
          <a href="#homes" className="rounded-full bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-white/25">Get my home price</a>
        </nav>

        <HalHover src="/concept/hal-hover-3q.png" alt="Hal the hummingbird, hovering and unimpressed" className="absolute left-[5%] top-[15%] z-10 hidden w-36 md:block lg:w-44" />

        <div className="container-site relative z-10 mt-auto w-full pb-14 md:pb-20">
          <p className={`${eyebrow} text-white/80`}>Exterior cleaning · Portland metro</p>
          <h1 className="mt-3 max-w-[24ch] font-display text-[clamp(2.2rem,4.3vw,4.1rem)] font-semibold leading-[1.0] tracking-[-0.018em] [text-wrap:balance]">
            People are too polite to mention your dirty windows.{" "}
            <span className="text-retro-sun">The birds aren’t.</span>
          </h1>
          <p className="mt-4 max-w-[52ch] text-lg text-white/90">
            Every home plan comes with free window cleaning, four times a year. $189–$499 a month, priced for your house.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6">
            <RetroButton href="#homes" tone="white" signature>Get my home price</RetroButton>
            <a href="#commercial" className="font-semibold underline decoration-white/50 decoration-2 underline-offset-4 hover:decoration-white">Commercial property? Book a free inspection →</a>
          </div>
        </div>
      </header>

      <Ticker items={TICKER_TOP} />

      {/* HOW WE CLEAN: the modern side of the business */}
      <section id="how" className="py-20 md:py-28">
        <div className="container-site">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
            <div>
              <StripeTab className="mb-5" />
              <p className={`${eyebrow} text-retro-muted`}>How we clean</p>
              <h2 className={`mt-3 ${h2}`}>The right method for every surface.</h2>
            </div>
            <p className="max-w-[46ch] text-lg text-retro-muted md:justify-self-end">Professional equipment and the right method for each surface, so nothing gets blasted that should be washed gently.</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["/concept/crew.jpg", "Pure water for windows", "A water-fed pole washes glass up high from the ground. The water is filtered of minerals, so it dries without spots."],
              ["/concept/com-shops.jpg", "Hot water for concrete", "Up to 3,500 PSI and hot water for gum, grease and the grey that builds up on walks and driveways."],
              ["/concept/softwash.jpg", "Soft wash for roofs and siding", "Low pressure and the right cleaning solution, so moss and algae come off without damaging the surface."],
            ].map(([src, h, p], i) => (
              <Reveal key={h} delay={i * 0.08} className="group overflow-hidden rounded-3xl bg-retro-paper">
                <div className="aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-7">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">{h}</h3>
                  <p className="mt-2 text-retro-muted">{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF: real work, not staged */}
      <section className="relative h-[70vh] max-h-[640px] min-h-[440px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/photos/before-after-concrete.webp" alt="Real Rinse It Off job: a sidewalk half black with grime and half freshly cleaned, the surface cleaner still in frame" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="container-site relative flex h-full items-end pb-12 text-white">
          <div>
            <p className={`${eyebrow} text-white/80`}>Real job · not staged</p>
            <p className="mt-3 max-w-[20ch] font-display text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em]">One pass of the surface cleaner.</p>
          </div>
        </div>
      </section>

      {/* HOME PLAN */}
      <section id="homes" className="grid bg-retro-paper md:grid-cols-2">
        <div className="relative min-h-[420px] md:min-h-[720px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/concept/plan-window.jpg" alt="A crew member cleaning a high window with a water-fed pole while the homeowner raises a glass of lemonade" className="absolute inset-0 h-full w-full object-cover" />
          <Starburst top="FREE" bottom="window cleaning" className="absolute bottom-6 right-6 w-32 rotate-6 sm:w-40" />
        </div>
        <Reveal className="flex flex-col justify-center px-5 py-16 sm:px-10 md:px-14 lg:px-20">
          <p className={`${eyebrow} text-retro-muted`}>The home plan</p>
          <h2 className={`mt-3 ${h2}`}>One plan. The outside of your house, handled.</h2>
          <p className="mt-5 max-w-[46ch] text-lg">We keep the outside of your home clean all year, on a schedule, and your window cleaning is free four times a year.</p>
          <ul className="mt-8 grid gap-4">
            {[
              "Free window cleaning four times a year, with pure water",
              "Priced by your home’s size and how hard it is to reach",
              "Roofs, siding, gutters, driveways and more as add-ons",
              "Photo proof every visit and a 48-hour re-rinse guarantee",
            ].map((t) => (
              <li key={t} className="flex gap-3.5">
                <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-blue text-[13px] font-bold">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-end gap-x-8 gap-y-4 border-t border-retro-line pt-8">
            <div>
              <p className="font-display text-4xl font-semibold tracking-[-0.02em]">$189–$499<span className="text-lg font-medium text-retro-muted"> / month</span></p>
              <p className="text-retro-muted">Priced for your house. Takes about a minute.</p>
            </div>
            <RetroButton href="#">Get my home price</RetroButton>
          </div>
        </Reveal>
      </section>

      {/* COMMERCIAL */}
      <section id="commercial" className="py-20 md:py-28">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <StripeTab className="mb-5" />
            <p className={`${eyebrow} text-retro-muted`}>For property managers, HOA boards and business owners</p>
            <h2 className={`mt-3 ${h2}`}>A free 21-point inspection of your whole property.</h2>
            <p className="mt-5 text-lg text-retro-muted">We walk the property and hand you a working treatment plan, not a list of problems. It’s yours to keep either way, with a price for the work if you want us to do it.</p>
          </Reveal>

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
            <Reveal className="overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/concept/inspection.jpg" alt="A property manager reviewing the inspection report with a crew member outside an office building" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
            <Reveal delay={0.1} className="relative">
              <div className="relative rotate-1 rounded-sm border border-retro-line bg-[#FFFDF7] p-7 shadow-[0_24px_48px_-20px_rgba(12,18,21,.45)] [background-image:repeating-linear-gradient(#FFFDF7_0_31px,#E4ECF1_31px_32px)]">
                <div className="flex items-start justify-between gap-4 border-b-2 border-brand-black pb-3">
                  <div>
                    <p className="font-typewriter text-sm font-bold uppercase tracking-[0.12em]">Property inspection</p>
                    <p className="font-typewriter text-xs text-retro-muted">21 points · photos included</p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/concept/logo-dark.png" alt="" className="h-9 w-auto" />
                </div>
                <ul className="mt-4 grid gap-[9px] font-typewriter text-[15px]">
                  {["Entrances", "Walkways", "Parking", "Trash pads", "Signs", "Siding", "Glass"].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="grid h-5 w-5 place-items-center border-2 border-brand-black text-[13px] font-bold leading-none">✓</span>
                      <span>{t}</span>
                      <span className="ml-auto text-xs text-retro-muted">photo · how to treat it</span>
                    </li>
                  ))}
                  <li className="pt-1 text-sm text-retro-muted">+ 14 more points</li>
                </ul>
              </div>
              <HalHover src="/concept/hal-clipboard.png" alt="Hal with his own clipboard" className="absolute -left-8 -top-14 w-28 sm:-left-16 sm:-top-16 sm:w-36" />
              <div className="mt-10"><RetroButton href="#">Book my free inspection</RetroButton></div>
            </Reveal>
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-3">
            {[
              ["/concept/com-office.jpg", "Building fronts and glass", "Entries, storefront glass and high windows, cleaned from the ground."],
              ["/brand/photos/walkway-split.webp", "Sidewalks and parking", "Hot-water cleaning for walks, lots and drive-throughs, early before you open."],
              ["/concept/com-apartments.jpg", "Apartments and HOAs", "Shared walkways, stairs and trash pads, scheduled around your residents."],
            ].map(([src, h, p], i) => (
              <Reveal key={h} delay={i * 0.08} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={h} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.01em]">{h}</h3>
                <p className="mt-1.5 text-retro-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-retro-line bg-retro-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Tenant complaints", "Dirty entries and trash pads are the first thing people notice."],
              ["Slip hazards", "Moss and algae on walkways get slick in the Portland rain."],
              ["Owner walkthroughs", "The property looks cared for when it counts."],
              ["Budget season", "A written plan and a price to take into your budget meeting."],
            ].map(([h, p]) => (
              <div key={h} className="bg-white p-7">
                <h3 className="font-display text-lg font-semibold">{h}</h3>
                <p className="mt-1.5 text-[15px] text-retro-muted">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISES: the one sun-yellow band */}
      <section className="bg-retro-sun py-16 md:py-20">
        <div className="container-site grid gap-10 md:grid-cols-3">
          {[
            ["Photo proof every visit", "We photograph every job before and after, so you can see what we did."],
            ["48-hour re-rinse guarantee", "If we missed something, we come back and rinse it again."],
            ["Your price in about a minute", "Homes get an instant online price."],
          ].map(([h, p]) => (
            <Reveal key={h}>
              <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.02em]">{h}</h3>
              <p className="mt-2 max-w-[34ch]">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICE AREA: full-bleed neighborhood */}
      <section className="relative min-h-[560px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/concept/neighborhood.jpg" alt="Crew cleaning a driveway on a quiet Portland street while the homeowners watch from the porch" className="absolute inset-0 h-full w-full object-cover" />
        <div className="container-site relative flex min-h-[560px] items-center py-16">
          <Reveal className="max-w-md rounded-3xl bg-white/95 p-8 shadow-[0_24px_60px_-20px_rgba(12,18,21,.5)] backdrop-blur">
            <p className={`${eyebrow} text-retro-muted`}>Where we work</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em]">Portland metro and the Willamette Valley.</h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
              {CITIES.map((c) => <li key={c} className="capitalize">{c}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-brand-blue py-20 text-center">
        <div className="container-site">
          <h2 className={`mx-auto max-w-3xl ${h2}`}>Free window cleaning, four times a year, with every home plan.</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <RetroButton href="#">Get my home price</RetroButton>
            <RetroButton href="#" tone="white">Book a free inspection</RetroButton>
          </div>
        </div>
      </section>
      <Ticker items={CITIES} />

      <footer className="bg-brand-black py-12 text-white">
        <div className="container-site grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/concept/logo-white.png" alt="Rinse It Off" className="h-14 w-auto" />
          <div>
            <p className="font-display text-2xl font-semibold">(971) 626-4146</p>
            <p className="text-white/70">Tigard, Oregon · hello@rinseitoff.com</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/concept/hal-mark-outline.svg" alt="Hal" className="h-20 w-auto" />
        </div>
      </footer>
    </div>
  );
}
