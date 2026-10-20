import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { RetroButton } from "@/components/retro/Bits";
import { ServiceFAQ } from "@/components/ServiceFAQ";
import { BUSINESS_ID, SITE_URL, breadcrumbLd, pageMeta } from "@/lib/seo";
import { PLAN_SEASONS } from "@/lib/plan-copy";
import {
  GUTTER_FAQS,
  GUTTER_H1,
  GUTTER_IMG,
  GUTTER_LEAD,
  GUTTER_META_DESCRIPTION,
  GUTTER_META_TITLE,
  GUTTER_OTHER,
  GUTTER_OTHER_TITLE,
  GUTTER_PATH,
  GUTTER_PLAN,
  GUTTER_PLAN_TITLE,
  GUTTER_WHEN,
  GUTTER_WHEN_TITLE,
} from "@/lib/gutters";

/** Gutter cleaning: a static route beside /services/[slug]. Gutters are a service, not a
 *  cleaning method, so they stay out of METHODS / SERVICES (the home page grid and the
 *  /services "Six methods" index). Copy lives in src/lib/gutters.ts. */

const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";

export const metadata: Metadata = pageMeta({
  title: GUTTER_META_TITLE,
  description: GUTTER_META_DESCRIPTION,
  path: GUTTER_PATH,
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SITE_URL}${GUTTER_PATH}#service`,
      name: GUTTER_H1,
      serviceType: "Gutter cleaning",
      description: `${GUTTER_WHEN[0]} ${GUTTER_WHEN[1]}`,
      image: `${SITE_URL}${GUTTER_IMG.src}`,
      areaServed: { "@type": "AdministrativeArea", name: "Portland, Oregon metropolitan area" },
      audience: [
        { "@type": "Audience", audienceType: "Homeowners" },
        { "@type": "Audience", audienceType: "Commercial property managers" },
      ],
      provider: { "@id": BUSINESS_ID },
      url: `${SITE_URL}${GUTTER_PATH}`,
    },
    breadcrumbLd([
      { name: "Services", path: "/services" },
      { name: GUTTER_H1, path: GUTTER_PATH },
    ]),
    {
      "@type": "FAQPage",
      mainEntity: GUTTER_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function GutterCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero: the fall illustration beside the approved October opener ── */}
      <section className="w-full overflow-hidden bg-retro-pool pt-16 md:grid md:min-h-[72svh] md:grid-cols-2 md:items-center md:pt-[72px]">
        <div className="mat relative m-3 overflow-hidden md:order-2 md:my-5 md:ml-auto md:mr-5 md:max-w-[560px]">
          <Image
            src={GUTTER_IMG.src}
            alt={GUTTER_IMG.alt}
            width={GUTTER_IMG.w}
            height={GUTTER_IMG.h}
            priority
            sizes="(min-width: 768px) 560px, 100vw"
            className="block h-auto w-full"
          />
        </div>
        <div className="px-5 pb-14 pt-8 sm:px-8 md:order-1 md:px-12 md:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <p className="label-caps mb-4 flex flex-wrap items-center gap-2 !tracking-[0.14em] text-retro-muted">
            <Link href="/services" className="rounded hover:text-brand-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]">
              Services
            </Link>
            <span aria-hidden>/</span>
            <span className="text-[#1A6E93]">Gutters</span>
          </p>
          <h1 className="text-[clamp(2.5rem,8vw,4.6rem)] leading-[0.95] text-brand-black [text-wrap:balance]">{GUTTER_H1}</h1>
          <div className="mt-5 max-w-xl space-y-4 text-lg leading-relaxed text-[#3B4247]">
            {GUTTER_LEAD.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <RetroButton href="/plan?src=gutters">See my price</RetroButton>
            <a href={PHONE_TEL} className="link-plain">
              <Phone className="h-4 w-4" aria-hidden />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* ── When we clean them ── */}
      <section className="bg-retro-paper py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.05] text-[#0C1215]">{GUTTER_WHEN_TITLE}</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-[#3B4247]">
              {GUTTER_WHEN.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The yearly plan, fall visit marked ── */}
      <section className="bg-[#E6F5FC] py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.05] text-[#0C1215]">{GUTTER_PLAN_TITLE}</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-[#3B4247]">
              {GUTTER_PLAN.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <ol className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {PLAN_SEASONS.map((s) => {
              const fall = s.name === "Fall";
              return (
                <li key={s.name} className={`frame ${fall ? "bg-[#F2B632]" : "bg-retro-paper"}`}>
                  <div className="p-4 md:p-5">
                    <p className="label-caps !tracking-[0.14em] text-[#0C1215]">{s.name}</p>
                    <h3 className="mt-1 font-title text-[1.15rem] font-black leading-tight text-[#0C1215] md:text-[1.3rem]">{s.title}</h3>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-8">
            <RetroButton href="/plan?src=gutters">See my price</RetroButton>
          </div>
        </div>
      </section>

      {/* ── Gutters on their own, or not a house ── */}
      <section className="bg-retro-paper py-16 md:py-24">
        <div className="container-site">
          <div className="frame max-w-3xl bg-retro-paper p-7 md:p-9">
            <h2 className="text-[clamp(1.6rem,3.5vw,2.3rem)] leading-[1.05] text-[#0C1215]">{GUTTER_OTHER_TITLE}</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">{GUTTER_OTHER}</p>
            <div className="mt-6">
              <RetroButton href="/assessment">Book a free walkthrough</RetroButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Questions ── */}
      <section className="bg-retro-pool py-16 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-[clamp(1.7rem,3.5vw,2.5rem)] leading-[1.05] text-[#0C1215]">About gutters</h2>
            <a href={PHONE_TEL} className="link-plain -mx-1 mt-4">
              <Phone className="h-4 w-4 text-[#1A6E93]" aria-hidden />
              {PHONE_DISPLAY}
            </a>
            <div className="mt-8">
              <p className="label-caps !tracking-[0.12em] text-retro-muted">Up on the roof</p>
              <Link
                href="/services/roof-soft-wash"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C1215] underline decoration-[#2E9BC6] decoration-2 underline-offset-[3px] transition-colors hover:text-[#1A6E93]"
              >
                Roof moss removal and soft washing
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3">
            <ServiceFAQ items={GUTTER_FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
