import type { Metadata } from "next";
import { RetroButton, Twinkle, Starburst, Slide, Ticker, StripeTab, boomerangPattern } from "@/components/concept/Bits";
import { HalHover, Reveal } from "@/components/concept/Motion";

// Concept for the jet-age brand layer. Not linked from the site and not indexed.
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
const TICKER_BOTTOM = ["Portland", "Beaverton", "Lake Oswego", "Tigard", "Hillsboro", "Gresham", "Milwaukie", "Tualatin", "West Linn", "the Willamette Valley"];

export default function ConceptPage() {
  return (
    <div className="bg-retro-paper font-body text-brand-black">
      <link rel="stylesheet" href="https://use.typekit.net/pth7mbe.css" precedence="default" />

      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-retro-line bg-white/95 backdrop-blur">
        <div className="container-site flex items-center justify-between py-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/concept/logo-dark.png" alt="Rinse It Off" className="h-11 w-auto" />
          <div className="hidden gap-8 text-[15px] md:flex">
            <a href="#homes" className="hover:underline">Homes</a>
            <a href="#commercial" className="hover:underline">Commercial</a>
            <a href="#portland" className="hover:underline">Where we work</a>
          </div>
          <RetroButton href="#homes">Get my home price</RetroButton>
        </div>
      </nav>

      {/* HERO: water blue, the crew in a slide mount, Hal flying out of the frame */}
      <header className="relative overflow-hidden bg-brand-blue">
        <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: boomerangPattern(0.12) }} />
        <div className="container-site relative grid items-center gap-10 py-14 md:grid-cols-[1fr_1.1fr] md:py-20 lg:gap-16">
          <Reveal>
            <p className="mb-5 font-typewriter text-xs font-bold uppercase tracking-[0.2em]">Exterior cleaning · Portland metro</p>
            <h1 className="font-clarendon text-[clamp(2.3rem,4.6vw,3.9rem)] font-bold leading-[1.02] [text-shadow:4px_4px_0_#F3EDE2] [text-wrap:balance]">
              People are too polite to mention your dirty windows.
              <span className="mt-2 block text-retro-bloom [text-shadow:4px_4px_0_#0C1215]">The birds aren’t.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg">
              Every home plan comes with <strong>free window cleaning four times a year</strong>, $189–$499 a month, priced for your house. Getting your price takes about a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <RetroButton href="#homes">Get my home price</RetroButton>
              <a href="#commercial" className="font-semibold underline decoration-2 underline-offset-4">Managing a property? Free inspection →</a>
            </div>
          </Reveal>

          <div className="relative pt-10 md:pt-0">
            <Slide src="/concept/crew.jpg" alt="The Rinse It Off crew posing in front of the truck while the homeowners wave from their porch" label="Rinse It Off · Portland, Ore." tilt={2} />
            <Starburst top="FREE" bottom="windows 4×/yr" className="absolute -bottom-8 -left-6 w-32 -rotate-12 sm:w-40" />
            <HalHover src="/concept/hal-hover-3q.png" alt="Hal the hummingbird, hovering and unimpressed" className="absolute -right-4 -top-16 w-40 sm:-right-10 sm:-top-24 sm:w-56 lg:w-64" flip />
          </div>
        </div>
      </header>

      <Ticker items={TICKER_TOP} />

      {/* HOME PLAN: cream, window photo in a slide, a ticket stub for the price */}
      <section id="homes" className="relative py-20 md:py-28" style={{ backgroundImage: boomerangPattern(0.08) }}>
        <div className="container-site grid items-center gap-14 md:grid-cols-2">
          <Reveal className="relative mx-auto w-full max-w-[460px]">
            <Slide src="/concept/plan-window.jpg" alt="A crew member cleaning a high window with a water-fed pole while the homeowner raises a glass of lemonade" label="Pure water · water-fed pole" tilt={-2.5} />
          </Reveal>
          <Reveal delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/concept/house.svg" alt="" className="mb-4 h-20 w-auto" />
            <StripeTab className="mb-5" />
            <p className="font-typewriter text-xs font-bold uppercase tracking-[0.2em] text-retro-muted">The home plan</p>
            <h2 className="mt-3 font-clarendon text-display-lg font-bold [text-wrap:balance]">One plan. The outside of your house, handled.</h2>
            <p className="mt-4 max-w-[48ch] text-lg">We keep the outside of your home clean all year, on a schedule. Your windows come free, four times a year.</p>
            <ul className="mt-7 grid gap-4">
              {[
                "Free window cleaning four times a year, with pure water that dries without spots",
                "Priced by your home’s size and how hard it is to reach, not a menu of packages",
                "Roofs, siding, gutters, driveways and more as add-ons",
                "Photo proof every visit and a 48-hour re-rinse guarantee",
              ].map((t) => (
                <li key={t} className="flex gap-3.5"><Twinkle className="mt-0.5 h-5 w-5 shrink-0" /><span>{t}</span></li>
              ))}
            </ul>
            {/* ticket stub */}
            <div className="mt-9 flex max-w-md items-stretch overflow-hidden rounded-xl bg-retro-sun shadow-[0_10px_24px_-10px_rgba(12,18,21,.35)]">
              <div className="flex-1 p-5">
                <p className="font-typewriter text-[11px] font-bold uppercase tracking-[0.2em]">Admit one home · home plan</p>
                <p className="mt-1 whitespace-nowrap font-clarendon text-[28px] font-bold leading-tight">$189–$499</p><p className="font-typewriter text-xs font-bold uppercase tracking-[0.16em]">a month</p>
              </div>
              <div aria-hidden className="w-0 border-l-[3px] border-dashed border-brand-black/40" />
              <div className="flex w-28 items-center justify-center p-3 text-center font-typewriter text-[11px] font-bold uppercase leading-snug tracking-[0.12em]">Priced for your house</div>
            </div>
            <div className="mt-8"><RetroButton href="#">Get my home price</RetroButton></div>
          </Reveal>
        </div>
      </section>

      {/* COMMERCIAL: white, the inspection report as a real object, Hal with his own clipboard */}
      <section id="commercial" className="border-y border-retro-line bg-white py-20 md:py-28">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/concept/building.svg" alt="" className="h-16 w-auto" />
              <p className="font-typewriter text-xs font-bold uppercase tracking-[0.2em] text-retro-muted">For property managers, HOA boards and business owners</p>
            </div>
            <h2 className="mt-4 font-clarendon text-display-lg font-bold [text-wrap:balance]">A free 21-point inspection of your whole property.</h2>
            <p className="mt-4 text-lg">We walk the property and hand you a working treatment plan, not a list of problems. It’s yours to keep either way, with a price for the work if you want us to do it.</p>
          </Reveal>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <Reveal><Slide src="/concept/inspection.jpg" alt="A property manager reviewing the inspection report with a crew member outside an office building" label="The walk-through" tilt={-1.5} /></Reveal>

            <Reveal delay={0.1} className="relative">
              {/* the report */}
              <div className="relative rotate-1 rounded-sm border border-retro-line bg-[#FFFDF7] p-7 shadow-[0_20px_40px_-18px_rgba(12,18,21,.45)] [background-image:repeating-linear-gradient(#FFFDF7_0_31px,#E4ECF1_31px_32px)]">
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

          <div className="mt-20 grid gap-10 md:grid-cols-3">
            {[
              ["/concept/com-office.jpg", "Building fronts and glass", "High glass from the ground with a water-fed pole, and entries that look new again.", "Office · glass"],
              ["/concept/com-shops.jpg", "Sidewalks and parking", "Hot water up to 3,500 PSI for gum, grease and the grey that builds up on concrete.", "Retail · walks"],
              ["/concept/com-apartments.jpg", "Apartments and HOAs", "Shared walkways, stairs and trash pads, scheduled around your residents.", "Residential · common areas"],
            ].map(([src, h, p, label], i) => (
              <Reveal key={h} delay={i * 0.08}>
                <Slide src={src} alt={h} label={label} tilt={[-1.5, 1, -0.5][i]} />
                <h3 className="mt-6 font-clarendon text-xl font-bold">{h}</h3>
                <p className="mt-1.5 text-retro-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Tenant complaints", "Dirty entries and trash pads are the first thing people notice."],
              ["Slip hazards", "Moss and algae on walkways get slick in the Portland rain."],
              ["Owner walkthroughs", "The property looks cared for when it counts."],
              ["Budget season", "A written plan and a price to take into your budget meeting."],
            ].map(([h, p]) => (
              <div key={h} className="rounded-2xl border border-retro-line bg-retro-paper p-6">
                <StripeTab className="mb-4 w-10" />
                <h3 className="font-clarendon text-lg font-bold">{h}</h3>
                <p className="mt-1.5 text-[15px] text-retro-muted">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISES: the one sun-yellow band, engraving icons */}
      <section className="bg-retro-sun py-20">
        <div className="container-site grid gap-6 md:grid-cols-3">
          {[
            ["/concept/camera.svg", "Photo proof every visit", "We photograph every job before and after, so you can see what we did."],
            ["/concept/calendar.svg", "48-hour re-rinse guarantee", "If we missed something, we come back and rinse it again."],
            ["/concept/drop.svg", "Pure water on your windows", "Water with the minerals filtered out, so glass dries without spots."],
          ].map(([icon, h, p], i) => (
            <Reveal key={h} delay={i * 0.08} className="rounded-3xl bg-retro-paper p-8 shadow-[6px_6px_0_#0C1215]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon} alt="" className="h-24 w-auto" />
              <h3 className="mt-5 font-clarendon text-xl font-bold">{h}</h3>
              <p className="mt-2 text-retro-muted">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PORTLAND: a wall of real vintage Portland postcards */}
      <section id="portland" className="overflow-hidden py-20 md:py-28">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1fr_1.25fr]">
          <Reveal>
            <StripeTab className="mb-5" />
            <p className="font-typewriter text-xs font-bold uppercase tracking-[0.2em] text-retro-muted">Where we work</p>
            <h2 className="mt-3 font-clarendon text-display-lg font-bold [text-wrap:balance]">Portland metro and the Willamette Valley.</h2>
            <p className="mt-4 max-w-[46ch] text-lg">Homes and commercial properties across the metro, from our base in Tigard.</p>
            <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 font-typewriter text-[15px]">
              {TICKER_BOTTOM.map((c) => (
                <li key={c} className="flex items-center gap-2.5"><Twinkle className="h-4 w-4 shrink-0" fill="#62C4EB" /><span className="capitalize">{c}</span></li>
              ))}
            </ul>
          </Reveal>
          <div className="relative mx-auto h-[520px] w-full max-w-[640px] sm:h-[600px]" aria-label="Vintage Portland postcards">
            {[
              ["greetings", "Greetings from Portland, Oregon", "left-[4%] top-[30%] w-[64%] -rotate-3 z-20"],
              ["mt-hood", "Mt. Hood from Portland", "right-0 top-0 w-[52%] rotate-3 z-10"],
              ["union-station", "Union Station", "left-0 top-0 w-[44%] -rotate-6 z-0"],
              ["broadway-night", "Broadway at night", "right-[2%] bottom-[4%] w-[40%] rotate-6 z-30"],
              ["motel", "A Portland motel", "left-[8%] bottom-0 w-[42%] rotate-2 z-10"],
            ].map(([f, alt, pos]) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={f} src={`/concept/pdx/${f}.jpg`} alt={`Vintage postcard: ${alt}`}
                className={`absolute border-[6px] border-white shadow-[0_14px_30px_-10px_rgba(12,18,21,.45)] transition-transform duration-500 hover:z-40 hover:rotate-0 hover:scale-105 ${pos}`} />
            ))}
          </div>
        </div>
        <p className="container-site mt-8 text-right font-typewriter text-[11px] text-retro-muted">Vintage postcards: Tichnor Brothers collection, Boston Public Library.</p>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-brand-blue py-20 text-center">
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: boomerangPattern(0.12) }} />
        <div className="container-site relative">
          <h2 className="mx-auto max-w-3xl font-clarendon text-display-lg font-bold [text-shadow:4px_4px_0_#F3EDE2] [text-wrap:balance]">Your windows, free, four times a year.</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <RetroButton href="#">Get my home price</RetroButton>
            <RetroButton href="#" tone="cream">Book a free inspection</RetroButton>
          </div>
        </div>
      </section>
      <Ticker items={TICKER_BOTTOM} />

      <footer className="bg-brand-black py-12 text-white">
        <div className="container-site grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/concept/logo-white.png" alt="Rinse It Off" className="h-14 w-auto" />
          <div>
            <p className="font-clarendon text-2xl font-bold">(971) 626-4146</p>
            <p className="text-white/70">Tigard, Oregon · hello@rinseitoff.com</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/concept/hal-mark-outline.svg" alt="Hal" className="h-20 w-auto" />
        </div>
      </footer>
    </div>
  );
}
