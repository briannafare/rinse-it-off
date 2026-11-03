import type { Metadata } from "next";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import Image from "next/image";
import { RetroButton } from "@/components/retro/Bits";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone, Check, ShieldCheck, Droplets } from "lucide-react";
import { SERVICES, SERVICE_SLUGS, getService } from "@/lib/services";
import { ServiceFAQ } from "@/components/ServiceFAQ";
import { getAiPage, visibleHere } from "@/lib/ai-pages";

const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";
const BASE_URL = "https://rinseitoff.com";

type Params = { slug: string };

/** Pre-render one page per service at build time. */
export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

/** Answer pages that go deeper on each method (internal links both ways:
 *  the answer pages link back through the footer and their own copy). */
const RELATED_ANSWERS: Record<string, string[]> = {
  "roof-soft-wash": ["/blog/roof-moss-removal-cost-and-method", "/blog/soft-wash-vs-pressure-wash"],
  "house-washing": ["/blog/house-washing-cost-portland", "/blog/how-often-wash-a-portland-house", "/blog/soft-wash-vs-pressure-wash"],
  "concrete-surface-cleaning": ["/blog/how-often-wash-a-portland-house", "/compare/rinse-it-off-vs-diy-rented-pressure-washer"],
  "pure-water-window-cleaning": ["/compare/subscription-vs-one-off-pressure-washing", "/blog/how-often-wash-a-portland-house"],
  "hot-water-degreasing": ["/commercial/hiring-a-pressure-washing-company"],
  "brick-masonry-washing": ["/blog/soft-wash-vs-pressure-wash", "/compare/rinse-it-off-vs-diy-rented-pressure-washer"],
};

/** Search titles: the method plus the words people type, under 60 characters
 *  once the layout adds " | Rinse It Off". The page h1 stays as written. */
const SEO_TITLES: Record<string, string> = {
  "roof-soft-wash": "Roof Moss Removal & Soft Washing, Portland",
  "house-washing": "House Washing & Siding Soft Wash, Portland",
  "concrete-surface-cleaning": "Driveway & Concrete Cleaning, Portland OR",
  "pure-water-window-cleaning": "Pure-Water Window Cleaning, Portland OR",
  "hot-water-degreasing": "Hot-Water Degreasing & Trash Pads, Portland",
  "brick-masonry-washing": "Brick & Masonry Washing, Portland OR",
};

function serviceDescription(service: { method: string; surface: string }) {
  return `${service.method} for ${service.surface.toLowerCase()} at Portland-area homes and businesses. Insured, with a 48-hour re-rinse guarantee.`;
}

/** Per-service metadata. */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found" };
  return pageMeta({
    title: SEO_TITLES[service.slug] ?? `${service.h1}, Portland OR`,
    description: serviceDescription(service),
    path: `/services/${service.slug}`,
    image: { url: `/og/service-${service.slug}.jpg`, alt: service.alt },
  });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const related = (RELATED_ANSWERS[service.slug] ?? [])
    .map((path) => getAiPage(path))
    .filter((p): p is NonNullable<typeof p> => !!p && visibleHere(p));

  // Structured data — Service + FAQPage, no pricing.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${BASE_URL}/services/${service.slug}#service`,
        name: service.h1,
        serviceType: service.method,
        description: service.intro,
        image: `${BASE_URL}/og/service-${service.slug}.jpg`,
        areaServed: { "@type": "AdministrativeArea", name: "Portland, Oregon metropolitan area" },
        audience: [
          { "@type": "Audience", audienceType: "Homeowners" },
          { "@type": "Audience", audienceType: "Commercial property managers" },
        ],
        provider: { "@id": `${BASE_URL}/#business` },
        url: `${BASE_URL}/services/${service.slug}`,
      },
      breadcrumbLd([
        { name: "Services", path: "/services" },
        { name: service.h1, path: `/services/${service.slug}` },
      ]),
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero: the photograph beside a flat cream title block (late-60s layer) ── */}
      <section className="w-full overflow-hidden bg-retro-pool pt-16 md:grid md:min-h-[78svh] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:pt-[72px]">
        <div className="mat film-grain relative m-3 aspect-[3/2] overflow-hidden md:order-2 md:my-5 md:ml-0 md:mr-5 md:self-center">
          <Image src={service.img} alt={service.alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-center" />
        </div>
        <div className="flex flex-col justify-center px-5 pb-14 pt-8 sm:px-8 md:order-1 md:px-12 md:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <p className="label-caps mb-4 flex flex-wrap items-center gap-2 !tracking-[0.14em] text-retro-muted">
            <Link href="/services" className="rounded hover:text-brand-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]">
              Services
            </Link>
            <span aria-hidden>/</span>
            <span className="text-[#1A6E93]">{service.method}</span>
          </p>
          <h1 className="text-[clamp(2.5rem,8vw,4.6rem)] leading-[0.95] text-brand-black [text-wrap:balance]">{service.h1}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#3B4247]">{service.what}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <RetroButton href="/assessment" signature>Get your free walkthrough</RetroButton>
            <a href={PHONE_TEL} className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-base font-semibold text-brand-black hover:text-[#1A6E93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]">
              <Phone className="h-4 w-4" aria-hidden />
              {PHONE_DISPLAY}
            </a>
          </div>
          <p className="label-caps mt-8 !tracking-[0.12em] text-retro-muted">Residential &amp; commercial · Insured · Free 21-point property assessment</p>
        </div>
      </section>

      {/* ── Method explanation + what's included ────────────────────── */}
      <section className="bg-retro-paper py-16 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2
              className="mt-3 text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              How we clean {service.surface.toLowerCase()}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#3B4247]">{service.intro}</p>

            {/* When you need it */}
            <div className="mt-8 rounded-[4px] border border-retro-line bg-[#E6F5FC] p-6">
              <h3
                className="flex items-center gap-2 text-base font-semibold text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Droplets className="h-4 w-4 text-[#1A6E93]" aria-hidden />
                When you need it
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3B4247]">{service.whenYouNeedIt}</p>
            </div>
          </div>

          {/* What's included card */}
          <div className="lg:pt-2">
            <div className="rounded-[4px] border border-retro-line bg-retro-paper p-6 md:p-8">
              <h3
                className="text-lg font-semibold text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What this covers
              </h3>
              <ul className="mt-5 space-y-4">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-lg bg-[#2E9BC6]">
                      <Check className="h-3.5 w-3.5 text-[#0C1215]" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-[#3B4247]">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-t border-retro-line pt-6">
                <p className="text-sm leading-relaxed text-[#3B4247]">
                  Every job starts with a free 21-point walkthrough — we walk the property and
                  hand you a firm, itemized quote the same day, no guesswork.
                </p>
                <Link
                  href="/assessment"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F2B632] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF8F2] motion-reduce:transition-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Book your free walkthrough
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof + Clean Water Promise ─────────────────────────────── */}
      <section className="bg-retro-pool py-16 md:py-24">
        <div className="container-site grid gap-5 md:grid-cols-2 md:gap-6">
          <div className="rounded-[4px] border border-retro-line bg-white p-6 md:p-8">
            <Droplets className="h-6 w-6 text-[#1A6E93]" aria-hidden />
            <h2
              className="mt-4 text-xl font-semibold text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Real work, real lines
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3B4247]">
              The before-and-after photos in our proof section are real jobs, with
              the before and after in the same frame. The line where the surface changes is where
              we stopped.
            </p>
            <Link
              href="/#proof"
              className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-[#0C1215] transition-colors hover:text-[#1A6E93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
            >
              See the proof
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="rounded-[4px] border border-retro-line bg-white p-6 md:p-8">
            <ShieldCheck className="h-6 w-6 text-[#1A6E93]" aria-hidden />
            <h2
              className="mt-4 text-xl font-semibold text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Clean Water Promise
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3B4247]">
              If there&apos;s any spot you&apos;re not happy with, we re-rinse it free within 48
              hours. No debate, no fine print — we&apos;d rather come back and make it right than
              leave you looking at a streak.
            </p>
            <p className="mt-4 text-sm font-medium text-[#0C1215]">Insured · Portland metro</p>
          </div>
        </div>
      </section>

      {/* ── Mini FAQ ────────────────────────────────────────────────── */}
      <section className="bg-retro-paper py-16 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <h2
              className="mt-3 text-[clamp(1.7rem,3.5vw,2.5rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              About {service.surface.toLowerCase()}
            </h2>
            <p className="mt-4 text-[#3B4247]">
              Straight answers on how we approach this surface. Anything we didn&apos;t cover?
            </p>
            <a
              href={PHONE_TEL}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#0C1215] transition-colors hover:text-[#1A6E93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
            >
              <Phone className="h-4 w-4 text-[#1A6E93]" aria-hidden />
              {PHONE_DISPLAY}
            </a>
            {related.length ? (
              <div className="mt-8">
                <p className="label-caps !tracking-[0.12em] text-retro-muted">Related answers</p>
                <ul className="mt-3 space-y-2">
                  {related.map((r) => (
                    <li key={r.path}>
                      <Link
                        href={r.path}
                        className="text-sm font-semibold text-[#0C1215] underline decoration-[#2E9BC6] decoration-2 underline-offset-[3px] transition-colors hover:text-[#1A6E93]"
                      >
                        {r.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-3">
            <ServiceFAQ items={service.faqs} />
          </div>
        </div>
      </section>

      {/* ── Explore the other methods ───────────────────────────────── */}
      <section className="bg-retro-pool py-16 md:py-24">
        <div className="container-site">
          <h2
            className="text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Explore the other methods
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.key}
                href={`/services/${o.slug}`}
                className="group flex items-center gap-4 rounded-[4px] bg-white p-3 ring-1 ring-retro-line transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={o.img}
                    alt={o.alt}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-xs font-semibold text-[#7A8186]">{o.method}</p>
                  <p
                    className="truncate text-sm font-semibold text-[#0C1215]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {o.surface}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#1A6E93] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
              </Link>
            ))}
          </div>
          <Link
            href="/services"
            className="mt-8 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-[#0C1215] transition-colors hover:text-[#1A6E93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF] motion-reduce:transition-none"
          >
            View all services
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* ── Final dual CTA ──────────────────────────────────────────── */}
      <section className="bg-[#62C4EB] py-16 md:py-24">
        <div className="container-site">
          <h2
            className="max-w-2xl text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.03] tracking-[-0.025em] text-[#0C1215]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Let&apos;s match the right method to your{" "}
            <span>property.</span>
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#0C1215]/80">
            Book your free 21-point walkthrough and get a firm, itemized quote the same day we
            walk your property — home or business. Backed by our Clean Water Promise.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/assessment"
              className="group inline-flex items-center gap-2 rounded-[14px] btn-print bg-[#F2B632] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB] motion-reduce:transition-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get your free walkthrough
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
            </Link>
            <Link
              href="/assessment?type=residential"
              className="inline-flex items-center gap-2 rounded-xl border border-[#0C1215]/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB] motion-reduce:transition-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get a home quote
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#0C1215]/70">
            Managing a property or portfolio?{" "}
            <Link
              href="/assessment?type=commercial"
              className="rounded font-semibold text-[#0C1215] underline decoration-[#2E9BC6] decoration-2 underline-offset-4 transition-colors hover:text-[#1A6E93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB]"
            >
              Book a free commercial walkthrough
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
