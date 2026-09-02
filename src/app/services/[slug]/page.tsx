import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone, Check, ShieldCheck, Droplets } from "lucide-react";
import { SERVICES, SERVICE_SLUGS, getService } from "@/lib/services";
import { ServiceFAQ } from "@/components/ServiceFAQ";

const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";
const BASE_URL = "https://rinseitoff.com";

type Params = { slug: string };

/** Pre-render one page per service at build time. */
export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
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

  const description = `${service.method} for ${service.surface.toLowerCase()} — the method-matched way we clean it, residential & commercial, across the Portland metro. Free 21-point property audit, insured, backed by our Clean Water Promise.`;

  return {
    title: service.h1,
    description,
    alternates: { canonical: `${BASE_URL}/services/${service.slug}` },
    openGraph: {
      title: `${service.h1} | Rinse It Off Portland`,
      description,
      type: "website",
      url: `${BASE_URL}/services/${service.slug}`,
      images: [{ url: service.img }],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  // Structured data — Service + FAQPage, no pricing.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.h1,
        serviceType: service.method,
        description: service.intro,
        areaServed: { "@type": "City", name: "Portland" },
        provider: { "@id": `${BASE_URL}/#business` },
        url: `${BASE_URL}/services/${service.slug}`,
      },
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

      {/* ── Cinematic hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[78svh] w-full overflow-hidden bg-[#0C1215]">
        <Image
          src={service.img}
          alt={service.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/5"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
          aria-hidden
        />

        <div className="container-site relative z-10 flex min-h-[78svh] flex-col justify-end pb-[calc(5rem+env(safe-area-inset-bottom))] pt-28 md:justify-center md:pb-24">
          <div className="max-w-2xl">
            <p className="mb-4 flex flex-wrap items-center gap-2 text-sm font-medium text-white/80">
              <Link
                href="/services"
                className="rounded transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
              >
                Services
              </Link>
              <span aria-hidden className="text-white/40">
                /
              </span>
              <span className="text-[#62C4EB]">{service.method}</span>
            </p>

            <h1
              className="text-[clamp(2.1rem,6vw,4.6rem)] leading-[0.98] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {service.h1}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{service.what}</p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/assessment"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-4 text-base font-semibold text-[#0C1215] shadow-[0_10px_28px_-8px_rgba(98,196,235,0.55)] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Get your free assessment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
              </Link>
              <a
                href={PHONE_TEL}
                className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-sm font-semibold text-white transition-colors hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Phone className="h-4 w-4" aria-hidden />
                {PHONE_DISPLAY}
              </a>
            </div>

            <p className="mt-8 text-sm text-white/80">
              Residential &amp; commercial · Insured · Free 21-point property assessment
            </p>
          </div>
        </div>
      </section>

      {/* ── Method explanation + what's included ────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2
              className="mt-3 text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              How we clean {service.surface.toLowerCase()}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#4B5C6B]">{service.intro}</p>

            {/* When you need it */}
            <div className="mt-8 rounded-2xl border border-[#E4ECF1] bg-[#EDF7FC] p-6">
              <h3
                className="flex items-center gap-2 text-base font-semibold text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Droplets className="h-4 w-4 text-[#3AA8D4]" aria-hidden />
                When you need it
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{service.whenYouNeedIt}</p>
            </div>
          </div>

          {/* What's included card */}
          <div className="lg:pt-2">
            <div className="rounded-3xl border border-[#E4ECF1] bg-[#F8FBFE] p-6 shadow-soft md:p-8">
              <h3
                className="text-lg font-semibold text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What this covers
              </h3>
              <ul className="mt-5 space-y-4">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-lg bg-[#62C4EB]">
                      <Check className="h-3.5 w-3.5 text-[#0C1215]" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-[#4B5C6B]">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-t border-[#E4ECF1] pt-6">
                <p className="text-sm leading-relaxed text-[#4B5C6B]">
                  Every job starts with a free 21-point property audit — we walk the property and
                  hand you a firm, itemized quote the same day, no guesswork.
                </p>
                <Link
                  href="/assessment"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0C1215] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d2830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FBFE] motion-reduce:transition-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Book your free audit
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof + Clean Water Promise ─────────────────────────────── */}
      <section className="bg-[#F4F7F8] py-16 md:py-24">
        <div className="container-site grid gap-5 md:grid-cols-2 md:gap-6">
          <div className="rounded-3xl border border-[#E4ECF1] bg-white p-6 shadow-soft md:p-8">
            <Droplets className="h-6 w-6 text-[#62C4EB]" aria-hidden />
            <h2
              className="mt-4 text-xl font-semibold text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Real work, real lines
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">
              No staging and no stock photography — every photo on this site is a real
              Portland-metro job, with the before and after in the same frame. The line where the
              surface changes is simply where we stopped.
            </p>
            <Link
              href="/#proof"
              className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-[#0C1215] transition-colors hover:text-[#3AA8D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
            >
              See the proof
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="rounded-3xl border border-[#E4ECF1] bg-white p-6 shadow-soft md:p-8">
            <ShieldCheck className="h-6 w-6 text-[#62C4EB]" aria-hidden />
            <h2
              className="mt-4 text-xl font-semibold text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Clean Water Promise
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">
              If there&apos;s any spot you&apos;re not happy with, we re-rinse it free within 48
              hours. No debate, no fine print — we&apos;d rather come back and make it right than
              leave you looking at a streak.
            </p>
            <p className="mt-4 text-sm font-medium text-[#0C1215]">Insured · Portland metro</p>
          </div>
        </div>
      </section>

      {/* ── Mini FAQ ────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <h2
              className="mt-3 text-[clamp(1.7rem,3.5vw,2.5rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              About {service.surface.toLowerCase()}
            </h2>
            <p className="mt-4 text-[#4B5C6B]">
              Straight answers on how we approach this surface. Anything we didn&apos;t cover?
            </p>
            <a
              href={PHONE_TEL}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#0C1215] transition-colors hover:text-[#3AA8D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
            >
              <Phone className="h-4 w-4 text-[#62C4EB]" aria-hidden />
              {PHONE_DISPLAY}
            </a>
          </div>
          <div className="lg:col-span-3">
            <ServiceFAQ items={service.faqs} />
          </div>
        </div>
      </section>

      {/* ── Explore the other methods ───────────────────────────────── */}
      <section className="bg-[#F4F7F8] py-16 md:py-24">
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
                className="group flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-[#E4ECF1] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(20,45,60,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
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
                  <p className="text-xs font-semibold text-[#8C9AA5]">{o.method}</p>
                  <p
                    className="truncate text-sm font-semibold text-[#0C1215]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {o.surface}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#3AA8D4] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
              </Link>
            ))}
          </div>
          <Link
            href="/services"
            className="mt-8 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-[#0C1215] transition-colors hover:text-[#3AA8D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8] motion-reduce:transition-none"
          >
            View all services
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* ── Final dual CTA ──────────────────────────────────────────── */}
      <section className="bg-[#0C1215] py-16 md:py-24">
        <div className="container-site">
          <h2
            className="max-w-2xl text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.03] tracking-[-0.025em] text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Let&apos;s match the right method to your{" "}
            <span className="text-[#62C4EB]">property.</span>
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
            Book your free 21-point property audit and get a firm, itemized quote the same day we
            walk your property — home or business. Backed by our Clean Water Promise.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/assessment"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get your free assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
            </Link>
            <Link
              href="/assessment?type=residential"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get a home quote
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/70">
            Managing a property or portfolio?{" "}
            <Link
              href="/assessment?type=commercial"
              className="rounded font-semibold text-white underline decoration-[#62C4EB] decoration-2 underline-offset-4 transition-colors hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
            >
              Book a free commercial property audit
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
