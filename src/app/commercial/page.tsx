import type { Metadata } from "next";
import Image from "next/image";
import {
  Phone,
  ArrowRight,
  Check,
  Droplets,
  Building2,
  Users,
  Warehouse,
  Store,
  ShieldCheck,
  BadgeCheck,
  CalendarClock,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { METHODS, type Method } from "@/lib/methods";

export const metadata: Metadata = {
  title: "Commercial & Property Manager Exterior Cleaning",
  description:
    "Rinse It Off cleans commercial properties across the Portland metro — parking lots, trash pads, storefronts, siding and roofs. Start with a free 21-point property audit and a firm, itemized quote the same day we walk your property. Insured, with recurring maintenance plans.",
};

const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";
const ASSESS_HREF = "/assessment?type=commercial";

/** Commercial surfaces first: lead with lots, trash pads, siding and storefronts.
 *  Copy is reused verbatim from the shared method-matching data (training material). */
const COMMERCIAL_METHODS: Method[] = ["flatwork", "grease", "siding", "glass", "masonry", "roof"]
  .map((k) => METHODS.find((m) => m.key === k))
  .filter((m): m is Method => m !== undefined);

const AUDIT_POINTS = [
  "Every surface walked and photo-documented",
  "The right method matched to each surface — no over-pressuring",
  "A board-ready report you can hand to ownership",
  "A firm, itemized quote the same day we walk your property",
];

const AUDIENCES: { icon: typeof Building2; title: string; body: string }[] = [
  {
    icon: Building2,
    title: "Property managers",
    body: "One vendor for the whole portfolio, scheduled around your tenants, with photo reports you can forward straight to ownership.",
  },
  {
    icon: Users,
    title: "HOAs & community boards",
    body: "Common areas, clubhouses, sidewalks and monument signage kept consistent — with documentation ready for the board packet.",
  },
  {
    icon: Warehouse,
    title: "Facilities & operations",
    body: "Loading docks, trash pads and drive-throughs degreased on a schedule that keeps sites safe and inspection-ready.",
  },
  {
    icon: Store,
    title: "Retail & multifamily",
    body: "Storefronts, walkways and building faces that stay presentable — because curb appeal is the first thing a customer or resident sees.",
  },
];

const TRUST: { icon: typeof ShieldCheck; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Fully insured",
    body: "We carry full general liability and workers’ compensation coverage, and we’re glad to share proof before we start — ready whenever your team asks.",
  },
  {
    icon: BadgeCheck,
    title: "Method-matched, always",
    body: "Soft wash on siding and roofs, hot water on grease, high-volume flow on masonry. We match the method to the material, every time.",
  },
  {
    icon: CalendarClock,
    title: "Recurring maintenance plans",
    body: "Monthly, quarterly and seasonal plans keep moss, algae and grime from ever getting a foothold. Set the schedule once — we handle the rest.",
  },
];

export default function CommercialPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO — cinematic commercial band (static, matches CinematicHero at rest) ── */}
        <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#0C1215]">
          <Image
            src="/brand/photos/work/lot-steam-wide.webp"
            alt="A Rinse It Off technician surface cleaning a commercial parking lot on an overcast morning"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/5" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" aria-hidden />

          <div className="container-site relative z-10 flex min-h-[100svh] flex-col justify-end pb-[calc(6rem+env(safe-area-inset-bottom))] pt-28 md:justify-center md:pb-24">
            <div className="max-w-2xl">
              <p className="mb-4 text-pretty text-sm font-medium text-white/85">
                Commercial &amp; property management &middot; Portland metro
              </p>

              <h1
                className="text-[clamp(2.3rem,7vw,5.6rem)] leading-[0.95] tracking-[-0.035em] text-white"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Every commercial surface
                <br />
                <span className="text-[#62C4EB]">gets its own method.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
                From parking lots and trash pads to storefronts, siding and roofs, we assess
                your property first — then match the right{" "}
                <span className="text-white">pressure, temperature, and chemistry</span> to each
                surface. It starts with a free 21-point property audit.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={ASSESS_HREF}
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-base font-semibold text-[#0C1215] shadow-[0_10px_28px_-8px_rgba(98,196,235,0.55)] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Book your free property audit
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    aria-hidden
                  />
                </a>
                <a
                  href={PHONE_TEL}
                  className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-sm font-semibold text-white hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {PHONE_DISPLAY}
                </a>
              </div>

              <p className="mt-8 text-sm text-white/85">
                Insured &middot; Free 21-point property audit &middot; Recurring maintenance plans.
              </p>
            </div>
          </div>
        </section>

        {/* ── THE WEDGE — free 21-point property audit ── */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                The free 21-point property audit.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#4B5C6B]">
                Before we quote a dollar, we walk your property and document every surface that needs
                attention &mdash; photographed, point by point. You get a board-ready report and a
                firm, itemized quote the same day we walk your property. No guessing, no surprise
                line items.
              </p>

              <ul className="mt-7 space-y-3">
                {AUDIT_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[#0C1215]">
                    <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-lg bg-[#EDF7FC]">
                      <Check className="h-3.5 w-3.5 text-[#0C1215]" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#EDF7FC] p-4">
                <Droplets className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#62C4EB]" aria-hidden />
                <p className="text-sm leading-relaxed text-[#4B5C6B]">
                  <span className="font-semibold text-[#0C1215]">
                    About 164 rainy days a year in Portland
                  </span>{" "}
                  keep moss, algae and grime coming back. The audit is where we map what your property
                  needs to stay ahead of it &mdash; at no charge.
                </p>
              </div>

              <div className="mt-8">
                <a
                  href={ASSESS_HREF}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Book your free property audit
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    aria-hidden
                  />
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-[#E4ECF1] shadow-[0_24px_48px_-20px_rgba(20,45,60,0.22)]">
              <Image
                src="/brand/photos/window-purewater.webp"
                alt="A technician cleaning a tall commercial glass storefront with a water-fed pole"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── METHOD-MATCHING — commercial surfaces ── */}
        <section id="services" className="bg-[#F4F7F8] py-16 md:py-24">
          <div className="container-site">
            <header className="max-w-2xl">
              <h2
                className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                The right method for every commercial surface.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#4B5C6B]">
                Pressure is a tool, not a default. Lots, trash pads, siding, storefronts, masonry and
                roofs &mdash; each gets the method its material calls for, so it comes clean without
                being worn down.
              </p>
            </header>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
              {COMMERCIAL_METHODS.map((m) => (
                <article
                  key={m.key}
                  className="group overflow-hidden rounded-2xl bg-white ring-1 ring-[#E4ECF1] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(20,45,60,0.22)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={m.img}
                      alt={m.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-[#0C1215] backdrop-blur-sm">
                      {m.method}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3
                      className="mt-1 text-lg font-semibold text-[#0C1215]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {m.surface}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{m.what}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={ASSESS_HREF}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0C1215] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d2830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8] motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Get your free property audit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <span className="text-sm text-[#5A6B78]">
                Not sure which your property needs? That&apos;s what the audit is for.
              </span>
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-site">
            <header className="max-w-2xl">
              <h2
                className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Built for the people who answer for the property.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#4B5C6B]">
                Portfolios, communities and facilities across the Portland metro &mdash; one crew, one
                schedule, documentation you can forward up the chain.
              </p>
            </header>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
              {AUDIENCES.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-[#E4ECF1] bg-[#FAFCFD] p-7 transition-colors duration-300 hover:border-[#62C4EB]/40 hover:bg-white motion-reduce:transition-none"
                >
                  <a.icon className="h-6 w-6 text-[#62C4EB]" aria-hidden />
                  <h3
                    className="mt-5 text-lg font-medium text-[#0C1215]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST ── */}
        <section className="relative overflow-hidden bg-[#F4F7F8] py-16 md:py-24">
          <div className="aura-blob left-[-10%] top-[-35%] h-[500px] w-[500px] bg-[#62C4EB]/12 motion-reduce:animate-none" aria-hidden />
          <div
            className="aura-blob right-[-8%] bottom-[-45%] h-[440px] w-[440px] bg-[#62C4EB]/10 motion-reduce:animate-none"
            style={{ animationDelay: "-7s" }}
            aria-hidden
          />

          <div className="container-site relative">
            <div className="max-w-2xl">
              <h2
                className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                No surprises, no padding, no fine print.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3 md:mt-14">
              {TRUST.map((t) => (
                <div
                  key={t.title}
                  className="group rounded-2xl border border-[#E4ECF1] bg-white p-7 transition-colors duration-300 hover:border-[#62C4EB]/40 motion-reduce:transition-none"
                >
                  <t.icon className="h-6 w-6 text-[#62C4EB]" aria-hidden />
                  <h3
                    className="mt-5 text-lg font-medium text-[#0C1215]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative overflow-hidden">
          <div className="relative h-[70vh] min-h-[480px]">
            <Image
              src="/brand/photos/work/lot-steam-wide.webp"
              alt="A commercial parking lot being surface-cleaned on an overcast morning"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1215]/85 via-black/30 to-black/10" aria-hidden />

            <div className="container-site relative flex h-full flex-col items-start justify-end pb-16 md:pb-20">
              <h2
                className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Start with the walk-through.
                <br />
                <span style={{ color: "#62C4EB" }}>The quote comes same-day.</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg text-white/85">
                Book your free 21-point property audit and get a firm, itemized quote the same day we
                walk your property. Backed by our Clean Water Promise: we re-rinse anything you&rsquo;re
                not happy with, free, within 48 hours.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a
                  href={ASSESS_HREF}
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Book your free property audit
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    aria-hidden
                  />
                </a>
                <a
                  href={PHONE_TEL}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {PHONE_DISPLAY} &mdash; talk to the team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
