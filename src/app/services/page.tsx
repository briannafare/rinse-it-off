import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Our Services | Exterior Cleaning Methods",
  description:
    "Six matched methods, one for every surface — roof soft washing, concrete surface cleaning, hot-water degreasing, pure-water window cleaning, brick & masonry washing, and high-reach building facade washing across the Portland metro. Residential & commercial. Insured.",
  alternates: { canonical: "https://rinseitoff.com/services" },
};

const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";

export default function ServicesIndexPage() {
  return (
    <>
      {/* ── Header band ─────────────────────────────────────────────── */}
      <section className="bg-[#0C1215] pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container-site">
          <p className="flex items-center gap-2 text-sm font-medium text-white/80">
            <span className="inline-block h-2 w-2 rounded-[3px] bg-[#62C4EB]" aria-hidden />
            The method-matching system
          </p>
          <h1
            className="mt-4 max-w-3xl text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.02] tracking-[-0.03em] text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Six methods. The right one for every surface.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Pressure is a tool, not a default. We assess your property first, then match the
            right pressure, temperature and chemistry to each surface — home or commercial
            building — so it comes clean without being worn down.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/assessment"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get your free assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
            </Link>
            <a
              href={PHONE_TEL}
              className="-mx-2 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-white transition-colors hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* ── Service grid ────────────────────────────────────────────── */}
      <section className="bg-[#F4F7F8] py-16 md:py-24">
        <div className="container-site">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Link
                key={s.key}
                href={`/services/${s.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[#E4ECF1] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(20,45,60,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#0C1215] backdrop-blur-sm">
                    {s.method}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold tracking-[0.08em] text-[#8C9AA5]">
                    Method {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="mt-1 text-lg font-semibold text-[#0C1215]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.surface}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{s.what}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C1215]">
                    See the method
                    <ArrowRight className="h-4 w-4 text-[#3AA8D4] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Reassurance + dual funnel */}
          <div className="mt-12 flex flex-col items-start gap-6 rounded-2xl border border-[#E4ECF1] bg-white p-6 shadow-soft md:mt-14 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#62C4EB]" aria-hidden />
              <p className="max-w-xl text-sm leading-relaxed text-[#4B5C6B]">
                <span className="font-semibold text-[#0C1215]">
                  Not sure which method your property needs?
                </span>{" "}
                That&apos;s what the free 21-point property audit is for — we walk the property,
                match the method to every surface, and hand you a firm, itemized quote the same
                day. Insured, and backed by our Clean Water Promise.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap gap-3">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Free assessment
              </Link>
              <Link
                href="/assessment?type=residential"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0C1215] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d2830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Get a home quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
