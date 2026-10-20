import type { Metadata } from "next";
import { OG, breadcrumbLd, pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { RetroButton } from "@/components/retro/Bits";
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
import {
  AUDIENCES as AUDIENCE_COPY,
  AUDIT_LEAD,
  AUDIT_POINTS,
  COMMERCIAL_CTA_BODY,
  COMMERCIAL_META_DESCRIPTION,
  COMMERCIAL_METHOD_KEYS,
  TRUST as TRUST_COPY,
} from "@/lib/commercial";

// The canonical was missing here, so the root layout's home-page canonical
// leaked in and told Google /commercial was a copy of the home page.
export const metadata: Metadata = pageMeta({
  title: "Commercial Pressure Washing in Portland, OR",
  description:
    "Parking lots, trash pads, storefronts, siding and roofs for Portland-area property managers, HOAs and businesses. Starts with a free 21-point inspection.",
  path: "/commercial",
  image: OG.commercial,
});

const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";
const ASSESS_HREF = "/assessment?type=commercial";

/** Commercial surfaces first: lead with lots, trash pads, siding and storefronts.
 *  Copy is reused verbatim from the shared method-matching data (training material). */
const COMMERCIAL_METHODS: Method[] = COMMERCIAL_METHOD_KEYS
  .map((k) => METHODS.find((m) => m.key === k))
  .filter((m): m is Method => m !== undefined);

const AUDIENCE_ICONS = { managers: Building2, hoa: Users, facilities: Warehouse, retail: Store } as const;
const AUDIENCES: { icon: typeof Building2; title: string; body: string }[] = AUDIENCE_COPY.map((a) => ({
  icon: AUDIENCE_ICONS[a.key as keyof typeof AUDIENCE_ICONS],
  title: a.title,
  body: a.body,
}));

const TRUST_ICONS = { insured: ShieldCheck, method: BadgeCheck, recurring: CalendarClock } as const;
const TRUST: { icon: typeof ShieldCheck; title: string; body: string }[] = TRUST_COPY.map((t) => ({
  icon: TRUST_ICONS[t.key as keyof typeof TRUST_ICONS],
  title: t.title,
  body: t.body,
}));

const BASE_URL = "https://rinseitoff.com";

// Service markup only. FAQPage was removed because its questions are not printed on this page.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${BASE_URL}/commercial#service`,
      name: "Commercial exterior cleaning",
      serviceType: "Commercial exterior cleaning",
      description: COMMERCIAL_META_DESCRIPTION,
      url: `${BASE_URL}/commercial`,
      provider: { "@id": `${BASE_URL}/#business` },
      image: `${BASE_URL}${OG.commercial.url}`,
      areaServed: { "@type": "AdministrativeArea", name: "Portland, Oregon metropolitan area" },
      audience: AUDIENCE_COPY.map((a) => ({ "@type": "Audience", audienceType: a.title })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Commercial surfaces and methods",
        itemListElement: COMMERCIAL_METHODS.map((m) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `${m.surface}: ${m.method}`, description: m.what },
        })),
      },
    },
    breadcrumbLd([{ name: "Commercial", path: "/commercial" }]),
  ],
};

export default function CommercialPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* ── HERO: the photograph beside a flat cream title block; Hal with his clipboard at the seam ── */}
        <section className="relative w-full overflow-hidden bg-retro-pool pt-16 md:grid md:min-h-[100svh] md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:pt-[72px]">
          <div className="mat film-grain relative m-3 h-[46svh] min-h-[300px] overflow-hidden md:order-2 md:my-5 md:ml-0 md:mr-5 md:h-auto">
            <Image
              src="/brand/retro/com-hero.webp"
              alt="A Rinse It Off crew of three at a mid-century office building: one on a short ladder at the canopy, one washing the tall entry glass with a water-fed pole, one coiling a hose by the work truck"
              fill
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover object-[55%_50%]"
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/hal/hal-clipboard.webp"
            alt=""
            aria-hidden
            width={600}
            height={600}
            className="pointer-events-none absolute right-[3%] top-[calc(46svh+8px)] z-10 w-[26vw] max-w-[120px] drop-shadow-[4px_10px_8px_rgba(40,30,20,.25)] md:left-[calc(46%-150px)] md:right-auto md:top-[16%] md:w-[11vw] md:max-w-[170px]"
          />
          <div className="relative flex flex-col justify-center px-5 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-8 sm:px-8 md:order-1 md:px-12 md:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <p className="label-caps mb-4 max-w-[70%] !tracking-[0.14em] text-retro-muted md:max-w-none">Commercial &amp; property management</p>
            <h1 className="text-[clamp(2.6rem,9vw,5.2rem)] leading-[0.95] text-brand-black [text-wrap:balance]">
              Every commercial surface <span className="title-accent text-[#2F6B66]">gets its own method.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3E5A5D]">
              From parking lots and trash pads to storefronts, siding and roofs, we assess
              your property first — then match the right{" "}
              <span className="font-semibold text-brand-black">pressure, temperature, and chemistry</span> to each
              surface. It starts with a free 21-point property audit.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <RetroButton href={ASSESS_HREF} signature>Book your free property audit</RetroButton>
              <a
                href={PHONE_TEL}
                className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-base font-semibold text-brand-black hover:text-[#2F6B66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66]"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </div>
            <p className="label-caps mt-8 !tracking-[0.12em] text-retro-muted">Insured &middot; Free 21-point property audit &middot; Recurring maintenance plans</p>
          </div>
        </section>

        {/* ── THE WEDGE — free 21-point property audit ── */}
        <section className="bg-retro-paper py-16 md:py-24">
          <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#102E32]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                The free 21-point property audit.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#3E5A5D]">
                {AUDIT_LEAD}
              </p>

              <ul className="mt-7 space-y-3">
                {AUDIT_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[#102E32]">
                    <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-lg bg-[#D7EFE9]">
                      <Check className="h-3.5 w-3.5 text-[#102E32]" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-start gap-3 rounded-[4px] bg-[#D7EFE9] p-4">
                <Droplets className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2F6B66]" aria-hidden />
                <p className="text-sm leading-relaxed text-[#3E5A5D]">
                  <span className="font-semibold text-[#102E32]">
                    About 157 days of rain a year in Portland
                  </span>{" "}
                  keep moss, algae and grime coming back. The audit is where we map what your property
                  needs to stay ahead of it &mdash; at no charge.
                </p>
              </div>

              <div className="mt-8">
                <a
                  href={ASSESS_HREF}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-[14px] btn-print bg-[#2F6B66] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#12433F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
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

            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] ring-1 ring-retro-line">
              <Image
                src="/brand/retro/glass-detail.webp"
                alt="Close-up of a cleaner guiding a water-fed pole brush across a tall window, pure water sheeting down the glass"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── METHOD-MATCHING — commercial surfaces ── */}
        <section id="services" className="bg-retro-pool py-16 md:py-24">
          <div className="container-site">
            <header className="max-w-2xl">
              <h2
                className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#102E32]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                The right method for every commercial surface.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#3E5A5D]">
                Pressure is a tool, not a default. Lots, trash pads, siding, storefronts, masonry and
                roofs &mdash; each gets the method its material calls for, so it comes clean without
                being worn down.
              </p>
            </header>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
              {COMMERCIAL_METHODS.map((m) => (
                <article
                  key={m.key}
                  className="group overflow-hidden rounded-[4px] bg-white ring-1 ring-retro-line transition-all duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={m.img}
                      alt={m.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-[#102E32] backdrop-blur-sm">
                      {m.method}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3
                      className="mt-1 text-lg font-semibold text-[#102E32]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {m.surface}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#3E5A5D]">{m.what}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={ASSESS_HREF}
                className="inline-flex items-center gap-2 rounded-full bg-[#12433F] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#12433F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF] motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Get your free property audit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <span className="text-sm text-[#5A7275]">
                Not sure which your property needs? That&apos;s what the audit is for.
              </span>
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section className="bg-retro-paper py-16 md:py-24">
          <div className="container-site">
            <header className="max-w-2xl">
              <h2
                className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#102E32]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Built for the people who answer for the property.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#3E5A5D]">
                Portfolios, communities and facilities across the Portland metro &mdash; one crew, one
                schedule, documentation you can forward up the chain.
              </p>
            </header>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
              {AUDIENCES.map((a) => (
                <div
                  key={a.title}
                  className="rounded-[4px] border border-retro-line bg-retro-paper p-7 transition-colors duration-300 hover:border-[#2F6B66]/40 hover:bg-white motion-reduce:transition-none"
                >
                  <a.icon className="h-6 w-6 text-[#2F6B66]" aria-hidden />
                  <h3
                    className="mt-5 text-lg font-medium text-[#102E32]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3E5A5D]">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST ── */}
        <section className="relative overflow-hidden bg-retro-pool py-16 md:py-24">
          <div className="aura-blob left-[-10%] top-[-35%] h-[500px] w-[500px] bg-[#2F6B66]/12 motion-reduce:animate-none" aria-hidden />
          <div
            className="aura-blob right-[-8%] bottom-[-45%] h-[440px] w-[440px] bg-[#2F6B66]/10 motion-reduce:animate-none"
            style={{ animationDelay: "-7s" }}
            aria-hidden
          />

          <div className="container-site relative">
            <div className="max-w-2xl">
              <h2
                className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#102E32]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                No surprises, no padding, no fine print.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3 md:mt-14">
              {TRUST.map((t) => (
                <div
                  key={t.title}
                  className="group rounded-[4px] border border-retro-line bg-white p-7 transition-colors duration-300 hover:border-[#2F6B66]/40 motion-reduce:transition-none"
                >
                  <t.icon className="h-6 w-6 text-[#2F6B66]" aria-hidden />
                  <h3
                    className="mt-5 text-lg font-medium text-[#102E32]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3E5A5D]">{t.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#3E5A5D]">
              Comparing contractors for a board or an owner? Here&apos;s{" "}
              <Link
                href="/commercial/hiring-a-pressure-washing-company"
                className="font-semibold text-[#102E32] underline decoration-[#2F6B66] decoration-2 underline-offset-4 hover:text-[#2F6B66]"
              >
                what to check before you hire a pressure washing company
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative overflow-hidden">
          <div className="relative h-[70vh] min-h-[480px]">
            <Image
              src="/brand/retro/com-apartments.webp"
              alt="Two Rinse It Off cleaners washing the walkways and stair landings of a 1960s garden apartment complex"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102E32]/85 via-black/30 to-black/10" aria-hidden />

            <div className="container-site relative flex h-full flex-col items-start justify-end pb-16 md:pb-20">
              <h2
                className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Start with the walk-through.
                <br />
                <span>The quote comes same-day.</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg text-white/85">
                {COMMERCIAL_CTA_BODY}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a
                  href={ASSESS_HREF}
                  className="group inline-flex items-center gap-2 rounded-[14px] btn-print bg-[#2F6B66] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#12433F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#102E32] motion-reduce:transition-none"
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
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#102E32] motion-reduce:transition-none"
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
