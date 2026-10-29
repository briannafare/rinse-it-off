import type { Metadata } from "next";
import { OG, breadcrumbLd, pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, ArrowRight, ArrowUpRight, Check, Droplets, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { METHODS } from "@/lib/methods";
import { SERVICES } from "@/lib/services";
import { AREAS, getAreaBySlug, getNearbyAreas, type Area } from "@/lib/areas";
import { getAreaFacts } from "@/lib/area-facts";

const BASE_URL = "https://rinseitoff.com";
const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";

// Each method card links to its service page (area pages linked to no service page before).
const SLUG_BY_KEY: Record<string, string> = Object.fromEntries(SERVICES.map((s) => [s.key, s.slug]));

// ── Local imagery only (all present in /public/brand/photos). Round 10 of the
// rebrand overwrote several of these files with new art; the alts describe the
// current files, so check them again whenever a file is swapped. ──────────────
const HERO_PHOTOS = [
  // generated and real alternate (brief 2026-10-19, 4e); every file carries the same warm print grade
  { src: "/brand/retro/siding.webp", alt: "A Rinse It Off cleaner soft-washing the wood siding of a mid-century house from the lawn" },
  { src: "/brand/retro/deck.webp", alt: "A freshly washed cedar deck and railing behind a mid-century house, water still on the boards" },
  { src: "/brand/photos/walkway-split.webp", alt: "A walkway mid-clean, the finished half bright against the dark, dirty half" },
  { src: "/brand/retro/patio.webp", alt: "A clean concrete patio with 1960s outdoor furniture and an umbrella, still wet from washing" },
  { src: "/brand/photos/work/driveway-after.webp", alt: "A residential driveway in the trees, washed clean" },
] as const;

// ── Copy variation — anti-thin-content ───────────────────────────────────────
// A stable hash of the slug picks each line, so every page is genuinely
// different (yet deterministic across builds). Copy is woven with the area
// name, type, and nearby names so no two pages read as clones.
function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function pick<T>(arr: readonly T[], seed: number): T {
  // seed can be negative (signed >> shifts of a 32-bit hash), which would give a
  // negative index -> undefined -> "x is not a function" when the element is a
  // function. Normalize to a safe non-negative index.
  const i = ((Math.trunc(seed) % arr.length) + arr.length) % arr.length;
  return arr[i];
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

const HERO_LEADS = [
  (n: string) => `Portland's rain keeps ${n} green — and keeps moss, algae, and grime working on your roof, siding, and concrete all year.`,
  (n: string) => `In ${n}, the same damp Northwest weather that feeds the moss is exactly what we're built to clean off — the right way, surface by surface.`,
  (n: string) => `Roofs, siding, walkways, and storefronts in ${n} all weather the wet season differently. We read each one before a drop of water hits it.`,
  (n: string) => `From shaded ${n} rooftops to street-facing concrete, we match the method to the surface instead of blasting everything the same.`,
] as const;

const OPENERS = [
  (n: string) => `In ${n}, the same Northwest weather that keeps everything green also keeps a slow film of moss and algae creeping across roofs, siding, walkways, and concrete.`,
  (n: string) => `Exterior surfaces around ${n} take a beating from Portland's damp climate — north-facing walls, shaded walkways, and shingle roofs all grow the same green haze.`,
  (n: string) => `Across ${n}, the wet season does its quiet damage: black streaks down the roof, a slick green layer on the driveway, and grime settling into the siding.`,
  (n: string) => `With Portland getting measurable rain on about 157 days a year, ${n} gets plenty of the steady moisture that moss, algae, and mildew need to take hold.`,
] as const;

const METHOD_LINES = [
  "We start every job the same way — a free 21-point walkthrough — then match the right pressure, temperature, and chemistry to each surface instead of blasting everything the same.",
  "Rather than point one pressure setting at every surface, we assess the property first and match the method: soft wash for roofs and siding, hot water for grease, pure water for glass.",
  "Our whole approach is method-matching. We look at what each surface actually needs, then use the gentlest process that still gets it fully clean — no stripped shingles, no etched concrete.",
  "Pressure is a tool, not a default. We walk the property, note every surface, and match soft washing, hot water, or a pure-water rinse to the material in front of us.",
] as const;

const CITY_LINES = [
  (n: string) => `${n} is part of the Portland metro we cover for both homeowners and businesses — single-family houses, storefronts, HOAs, and multi-building properties alike.`,
  (n: string) => `We serve ${n} for residential and commercial work: house washing and roof soft-washing for homes, plus building exteriors, parking lots, and storefronts for local businesses.`,
  (n: string) => `Whether it's a ${n} home, a retail strip, or a facility with a greasy trash pad, we bring the same method-matched crew and the same honest quote.`,
] as const;

const NEIGHBORHOOD_LINES = [
  (n: string) => `${n} is one of the Portland neighborhoods we know well — a mix of established homes, mature trees, and shaded lots that hold moisture and grow moss fast.`,
  (n: string) => `As a close-knit Portland neighborhood, ${n} has the kind of older siding, painted trim, and asphalt-shingle roofs that need a gentle, method-matched hand — not a blaster.`,
  (n: string) => `${n} homes and small businesses see the full Portland green-up: mossy roofs, algae on the north side, and mildew on the fence. We treat each at the source.`,
] as const;

const NEARBY_LINES = [
  (n: string, near: string) => `We're regularly working in ${n} and nearby ${near}, so getting on the schedule usually doesn't take long.`,
  (n: string, near: string) => `Because we already serve ${near} right alongside ${n}, routing a crew to your address is easy.`,
  (n: string, near: string) => `${n} sits right next to ${near} on our route, which keeps scheduling and follow-up visits simple.`,
] as const;

const PROMISE_LINES = [
  "And every job is backed by our Clean Water Promise: if there's any spot you're not happy with, we re-rinse it free within 48 hours.",
  "Every visit is covered by our Clean Water Promise — anything you're not happy with, we come back and re-rinse it free within 48 hours.",
] as const;

type IntroCopy = { hero: string; paragraphs: string[] };

function buildIntro(area: Area): IntroCopy {
  const seed = hashSlug(area.slug);
  // The "157 days" opener (last in OPENERS, NOAA 1991-2020 normals for Portland
  // airport) would contradict the sourced
  // rain-day counts on pages that state their own, so those pages skip it.
  const openers = getAreaFacts(area.slug).some((f) => /\bdays\b/.test(f.text)) ? OPENERS.slice(0, -1) : OPENERS;
  const near = joinNames(getNearbyAreas(area).slice(0, 3).map((a) => a.name));

  const typeLine =
    area.type === "city"
      ? pick(CITY_LINES, seed >> 2)(area.name)
      : pick(NEIGHBORHOOD_LINES, seed >> 2)(area.name);

  const p1 = `${pick(openers, seed)(area.name)} ${pick(METHOD_LINES, seed >> 1)}`;
  const p2 = `${typeLine} ${near ? pick(NEARBY_LINES, seed >> 3)(area.name, near) + " " : ""}${pick(PROMISE_LINES, seed >> 4)}`;

  return { hero: pick(HERO_LEADS, seed)(area.name), paragraphs: [p1, p2] };
}

// ── Static generation ────────────────────────────────────────────────────────
export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

/** "Beaverton, OR" for a city, "Sellwood-Moreland, Portland" for a neighborhood.
 *  (The old "Beaverton, Portland OR" put every suburb inside Portland.) */
function placeSuffix(area: Area): string {
  return area.type === "city" ? "OR" : "Portland";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return { title: "Service Area Not Found" };

  // Under 60 characters with " | Rinse It Off"; long neighborhood names drop the suffix.
  const full = `Pressure Washing in ${area.name}, ${placeSuffix(area)}`;
  const title = full.length > 45 ? `Pressure Washing in ${area.name}` : full;
  const description = `Pressure washing, soft washing and window cleaning for homes and businesses in ${area.name}. Insured, with a 48-hour re-rinse guarantee.`;

  return pageMeta({ title, description, path: `/areas/${area.slug}`, image: OG.areas });
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const intro = buildIntro(area);
  const facts = getAreaFacts(area.slug);
  const nearby = getNearbyAreas(area);
  const hero = pick(HERO_PHOTOS, hashSlug(area.slug));

  // One business entity site-wide (the root layout's #business). Each area page
  // describes the service offered in that place instead of a second business
  // with a different @id and a Portland address, which split the entity 67 ways.
  const place =
    area.type === "city"
      ? { "@type": "City", name: area.name, containedInPlace: { "@type": "State", name: "Oregon" } }
      : { "@type": "Place", name: `${area.name}, Portland`, containedInPlace: { "@type": "City", name: "Portland" } };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${BASE_URL}/areas/${area.slug}#service`,
        name: `Exterior cleaning in ${area.name}`,
        serviceType: "Exterior cleaning",
        description: `Pressure washing, soft washing, roof moss removal, hot-water degreasing and pure-water window cleaning for homes and commercial properties in ${area.name}, ${area.type === "city" ? "Oregon" : "Portland, Oregon"}.`,
        url: `${BASE_URL}/areas/${area.slug}`,
        image: `${BASE_URL}${hero.src}`,
        provider: { "@id": `${BASE_URL}/#business` },
        areaServed: place,
      },
      breadcrumbLd([
        { name: "Service Areas", path: "/areas" },
        { name: area.name, path: `/areas/${area.slug}` },
      ]),
    ],
  };

  const typeLabel = area.type === "city" ? "Portland metro" : "Portland neighborhood";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* ── Hero — dark image band (matches CinematicHero language) ─────── */}
        <section className="w-full overflow-hidden bg-retro-pool pt-16 md:grid md:min-h-[76svh] md:grid-cols-2 md:pt-[72px]">
          <div className="mat film-grain relative m-3 aspect-[3/2] overflow-hidden md:order-2 md:my-5 md:ml-0 md:mr-5 md:self-center">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
          </div>

          <div className="flex flex-col justify-center px-5 pb-14 pt-8 sm:px-8 md:order-1 md:px-12 md:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 label-caps !tracking-[0.12em] text-retro-muted">
                <MapPin className="h-4 w-4 text-[#1A6E93]" aria-hidden />
                {typeLabel} · Residential &amp; commercial
              </p>
              <h1
                className="text-[clamp(2.2rem,6.5vw,4rem)] leading-[0.98] text-brand-black [text-wrap:balance]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Pressure Washing &amp; Exterior Cleaning in{" "}
                <span className="title-accent text-[#1A6E93]">{area.name}</span>, {placeSuffix(area)}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#3B4247]">{intro.hero}</p>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href="/assessment"
                  className="group inline-flex items-center gap-2 rounded-[14px] btn-print bg-[#F2B632] px-6 py-3.5 font-semibold text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-retro-pool"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Get your free walkthrough
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                </a>
                <a
                  href={PHONE_TEL}
                  className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-sm font-semibold text-brand-black hover:text-[#1A6E93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-retro-pool"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {PHONE_DISPLAY}
                </a>
              </div>

              <p className="mt-8 text-sm text-[#3B4247]">
                Insured · Free 21-point walkthrough · Firm, itemized quote the same day we walk your property.
              </p>
            </div>
          </div>
        </section>

        {/* ── Localized intro — the substantive, area-specific body ────────── */}
        <section className="bg-retro-paper py-16 md:py-24">
          <div className="container-site max-w-3xl">
            <h2
              className="mt-3 text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Why {area.name} surfaces need a matched method — not raw pressure.
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-[#3B4247]">
              {intro.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {facts.length > 0 && (
              <div className="mt-8">
                <h3
                  className="text-xl font-semibold text-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  About {area.name}
                </h3>
                <ul className="mt-3 space-y-3 text-lg leading-relaxed text-[#3B4247]">
                  {facts.map((f) => (
                    <li key={f.text} className="flex gap-3">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-[#1A6E93]" aria-hidden />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <a
                href="/assessment?type=residential"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#E6F5FC] px-5 py-3 font-semibold text-[#0C1215] transition-colors hover:bg-[#DDF0FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Home in {area.name}? Start a house-wash quote
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="/assessment?type=commercial"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-5 py-3 font-semibold text-[#0C1215] ring-1 ring-retro-line transition-colors hover:ring-[#1A6E93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Business or property manager? Book a free commercial walkthrough
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* ── Method-matching services ─────────────────────────────────────── */}
        <section className="bg-retro-pool py-16 md:py-24">
          <div className="container-site">
            <header className="max-w-2xl">
              <h2
                className="text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                How we&apos;d approach a {area.name} property
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
                Six methods, one crew. On your free walkthrough we walk {area.name} with you and note
                which of these each surface actually needs.
              </p>
            </header>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
              {METHODS.map((m, i) => (
                <article
                  key={m.key}
                  className="group relative overflow-hidden rounded-[4px] bg-white ring-1 ring-retro-line transition-all duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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
                    <h3 className="mt-1 text-lg font-semibold text-[#0C1215]" style={{ fontFamily: "var(--font-display)" }}>
                      {SLUG_BY_KEY[m.key] ? (
                        <Link
                          href={`/services/${SLUG_BY_KEY[m.key]}`}
                          className="rounded after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]"
                        >
                          {m.surface}
                        </Link>
                      ) : (
                        m.surface
                      )}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#3B4247]">{m.what}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Real before/after mention ────────────────────────────────────── */}
        <section className="bg-retro-paper py-16 md:py-24">
          <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <figure className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-retro-line">
                <Image
                  src="/brand/photos/before-after-concrete.webp"
                  alt="A Portland-metro sidewalk half black with grime, half freshly surface-cleaned, the machine still in frame"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute bottom-4 left-4 rounded-lg bg-[#FBF8F2]/75 px-3 py-1.5 text-sm font-medium text-[#0C1215] backdrop-blur-sm">
                  Real RIO job · before / after in one frame
                </span>
              </div>
            </figure>
            <div className="order-1 lg:order-2">
              <h2
                className="mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.1] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                The moment dirt lets go.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
                This is a real Portland-metro sidewalk — the same slab, one pass of the surface
                cleaner, with the machine still in the shot. No staging, no stock photo. That crisp
                line is simply where we stopped, and it&apos;s the kind of finish we bring to driveways,
                walkways, and lots in {area.name}.
              </p>
              <a
                href="/assessment"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F2B632] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                See what your surfaces could look like
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* ── Clean Water Promise strip ────────────────────────────────────── */}
        <section className="bg-retro-pool py-14 md:py-16">
          <div className="container-site flex flex-col gap-6 rounded-[4px] bg-white p-8 ring-1 ring-retro-line md:flex-row md:items-center md:justify-between md:p-10">
            <div className="flex items-start gap-4">
              <Droplets className="mt-0.5 h-8 w-8 flex-shrink-0 text-[#1A6E93]" aria-hidden />
              <div>
                <h2 className="text-xl font-semibold text-[#0C1215]" style={{ fontFamily: "var(--font-display)" }}>
                  The Clean Water Promise in {area.name}
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#3B4247]">
                  Any spot you&apos;re not happy with, we re-rinse it free within 48 hours. No debate, no
                  fine print — the same promise on every home and every building we clean.
                </p>
              </div>
            </div>
            <ul className="flex flex-shrink-0 flex-col gap-2">
              {["Insured", "Free 21-point walkthrough", "Same-day itemized quote"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium text-[#0C1215]">
                  <Check className="h-4 w-4 text-[#1A6E93]" strokeWidth={3} aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Nearby areas — internal linking ──────────────────────────────── */}
        {nearby.length > 0 && (
          <section className="bg-retro-paper py-16 md:py-20">
            <div className="container-site">
              <h2
                className="text-[clamp(1.4rem,3vw,2rem)] leading-[1.1] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                We also clean near {area.name}
              </h2>
              <p className="mt-3 max-w-xl text-[#3B4247]">
                Same method-matched crew, same Clean Water Promise across the Portland metro.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {nearby.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/areas/${a.slug}`}
                      className="group flex min-h-[44px] items-center justify-between gap-2 rounded-xl bg-retro-pool px-5 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#E6F5FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {a.name}
                      <ArrowUpRight className="h-4 w-4 text-[#7A8186] transition-colors group-hover:text-[#1A6E93]" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-[#3B4247]">
                <Link
                  href="/areas"
                  className="rounded font-semibold text-[#0C1215] underline decoration-[#2E9BC6] decoration-2 underline-offset-4 hover:text-[#3B4247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  See every Portland-metro area we serve
                </Link>
              </p>
              <p className="mt-3 text-sm text-[#3B4247]">
                Own a house in {area.name}?{" "}
                <Link
                  href="/plan"
                  className="rounded font-semibold text-[#0C1215] underline decoration-[#2E9BC6] decoration-2 underline-offset-4 hover:text-[#3B4247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  See the yearly plan price for it
                </Link>{" "}
                or read{" "}
                <Link
                  href="/blog/how-often-wash-a-portland-house"
                  className="rounded font-semibold text-[#0C1215] underline decoration-[#2E9BC6] decoration-2 underline-offset-4 hover:text-[#3B4247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  how often a Portland house needs washing
                </Link>
                .
              </p>
            </div>
          </section>
        )}

        {/* ── Final CTA — dark closing band ────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="relative h-[62vh] min-h-[440px]">
            <Image
              src="/brand/photos/patio-umbrellas.webp"
              alt="A clean aggregate concrete patio with tables and umbrellas after a wash"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FBF8F2]/95 via-[#FBF8F2]/60 to-transparent" aria-hidden />
            <div className="container-site relative flex h-full flex-col items-start justify-end pb-16 md:pb-20">
              <h2
                className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-[#0C1215] md:text-6xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready for a cleaner exterior in {area.name}?
              </h2>
              <p className="mt-4 max-w-lg text-lg text-[#0C1215]/85">
                Book your free 21-point walkthrough and get a firm, itemized quote the same day we
                walk your property — home or business. Backed by our Clean Water Promise.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a
                  href="/assessment"
                  className="inline-flex items-center gap-2 rounded-[14px] btn-print bg-[#F2B632] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB] motion-reduce:transition-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Get your same-day quote
                </a>
                <a
                  href={PHONE_TEL}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#0C1215]/85 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB] motion-reduce:transition-none"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {PHONE_DISPLAY} — talk to the team
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
