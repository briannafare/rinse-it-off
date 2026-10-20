import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RetroButton } from "@/components/retro/Bits";
import { BUSINESS_ID, OG, SITE_URL, breadcrumbLd, pageMeta } from "@/lib/seo";
import {
  ABOUT_H1,
  ABOUT_HERO_PHOTO,
  ABOUT_HONK,
  ABOUT_INTRO,
  ABOUT_META_DESCRIPTION,
  ABOUT_META_TITLE,
  ABOUT_PRICE_HOME,
  ABOUT_PRICE_OTHER,
  ABOUT_PRICE_TITLE,
  ABOUT_PROMISES,
  ABOUT_PROMISES_TITLE,
  ABOUT_REACH,
  ABOUT_RIG,
  ABOUT_RIG_INTRO,
  ABOUT_RIG_PHOTO,
  ABOUT_RIG_TITLE,
  ABOUT_WHERE,
  ABOUT_WHERE_TITLE,
} from "@/lib/about-copy";

const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";
const EMAIL = "hello@rinseitoff.com";

export const metadata: Metadata = pageMeta({
  title: ABOUT_META_TITLE,
  description: ABOUT_META_DESCRIPTION,
  path: "/about",
  image: OG.home,
});

// AboutPage about the one business entity the root layout defines (#business).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#webpage`,
      url: `${SITE_URL}/about`,
      name: `About Rinse It Off`,
      description: ABOUT_META_DESCRIPTION,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": BUSINESS_ID },
      mainEntity: { "@id": BUSINESS_ID },
      primaryImageOfPage: `${SITE_URL}${ABOUT_HERO_PHOTO.src}`,
    },
    breadcrumbLd([{ name: "About", path: "/about" }]),
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* ── Hero: a real job photo beside the owners' hello ── */}
        <section className="w-full overflow-hidden bg-retro-pool pt-16 md:grid md:min-h-[72svh] md:grid-cols-2 md:items-center md:pt-[72px]">
          <div className="mat film-grain relative m-3 overflow-hidden md:order-2 md:my-5 md:ml-0 md:mr-5">
            <Image
              src={ABOUT_HERO_PHOTO.src}
              alt={ABOUT_HERO_PHOTO.alt}
              width={ABOUT_HERO_PHOTO.w}
              height={ABOUT_HERO_PHOTO.h}
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="block h-auto w-full"
            />
          </div>
          <div className="px-5 pb-14 pt-8 sm:px-8 md:order-1 md:px-12 md:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <p className="label-caps mb-4 !tracking-[0.14em] text-[#1A6E93]">
              About Rinse It Off
            </p>
            <h1 className="max-w-xl text-[clamp(2.3rem,6.5vw,4rem)] leading-[0.98] text-brand-black [text-wrap:balance]">
              {ABOUT_H1}
            </h1>
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-[#3B4247]">
              {ABOUT_INTRO.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8">
              <RetroButton href="#price">Get a price</RetroButton>
            </div>
          </div>
        </section>

        {/* ── Who and where ── */}
        <section className="bg-retro-paper py-16 md:py-24">
          <div className="container-site">
            <div className="max-w-3xl">
              <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.05] text-[#0C1215]">
                {ABOUT_WHERE_TITLE}
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-[#3B4247]">
                {ABOUT_WHERE.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1">
                <a href={PHONE_TEL} className="link-plain">
                  <Phone className="h-4 w-4 text-[#1A6E93]" aria-hidden />
                  {PHONE_DISPLAY}
                </a>
                <a href={`mailto:${EMAIL}`} className="link-plain">
                  <Mail className="h-4 w-4 text-[#1A6E93]" aria-hidden />
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── The rig ── */}
        <section className="bg-[#E6F5FC] py-16 md:py-24">
          <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.05] text-[#0C1215]">
                {ABOUT_RIG_TITLE}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#3B4247]">
                {ABOUT_RIG_INTRO}
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {ABOUT_RIG.map((r) => (
                  <li key={r.name} className="frame bg-retro-paper p-6">
                    <h3 className="font-title text-[1.3rem] font-black leading-tight text-[#0C1215]">
                      {r.name}
                    </h3>
                    <p className="mt-2 text-[0.97rem] leading-relaxed text-[#3B4247]">
                      {r.body}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-xl leading-relaxed text-[#3B4247]">
                {ABOUT_REACH}
              </p>
              <p className="mt-4 font-title text-[1.5rem] font-black leading-tight text-[#0C1215]">
                {ABOUT_HONK}
              </p>
            </div>
            <figure className="mx-auto w-full max-w-[420px] lg:mt-2">
              <div className="mat overflow-hidden">
                <Image
                  src={ABOUT_RIG_PHOTO.src}
                  alt={ABOUT_RIG_PHOTO.alt}
                  width={ABOUT_RIG_PHOTO.w}
                  height={ABOUT_RIG_PHOTO.h}
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="block h-auto w-full"
                />
              </div>
              <figcaption className="mt-4 text-sm text-[#3B4247]">
                {ABOUT_RIG_PHOTO.caption}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── What comes with the work ── */}
        <section className="bg-retro-paper py-16 md:py-24">
          <div className="container-site">
            <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.05] text-[#0C1215]">
              {ABOUT_PROMISES_TITLE}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {ABOUT_PROMISES.map((p) => (
                <div key={p.title} className="frame bg-retro-paper p-7">
                  <h3 className="font-title text-[1.3rem] font-black leading-tight text-[#0C1215]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-[#3B4247]">
                    {p.body}
                  </p>
                  {p.link ? (
                    <a
                      href={p.link.href}
                      className="link-plain -mx-1 mt-1 text-[0.97rem]"
                    >
                      {p.link.label}
                      <ArrowRight
                        className="h-4 w-4 text-[#1A6E93]"
                        aria-hidden
                      />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Two ways to get a price ── */}
        <section
          id="price"
          className="scroll-mt-24 bg-retro-pool py-16 md:py-24"
        >
          <div className="container-site">
            <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] leading-[1.05] text-[#0C1215]">
              {ABOUT_PRICE_TITLE}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="frame flex flex-col bg-[#62C4EB] p-7 text-[#0C1215] md:p-9">
                <h3 className="font-title text-[1.9rem] font-black leading-tight">
                  {ABOUT_PRICE_HOME.title}
                </h3>
                <p className="mt-3 max-w-md flex-1 leading-relaxed">
                  {ABOUT_PRICE_HOME.body}
                </p>
                <div className="mt-6">
                  <RetroButton href={ABOUT_PRICE_HOME.href}>
                    {ABOUT_PRICE_HOME.cta}
                  </RetroButton>
                </div>
              </div>
              <div className="frame flex flex-col bg-retro-paper p-7 text-[#0C1215] md:p-9">
                <h3 className="font-title text-[1.9rem] font-black leading-tight">
                  {ABOUT_PRICE_OTHER.title}
                </h3>
                <p className="mt-3 max-w-md flex-1 leading-relaxed text-[#3B4247]">
                  {ABOUT_PRICE_OTHER.body}
                </p>
                <div className="mt-6">
                  <a
                    href={ABOUT_PRICE_OTHER.href}
                    className="inline-flex min-h-[52px] items-center gap-2 rounded-full px-6 text-[15px] font-semibold text-[#0C1215] ring-2 ring-[#0C1215] transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-4"
                  >
                    {ABOUT_PRICE_OTHER.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
