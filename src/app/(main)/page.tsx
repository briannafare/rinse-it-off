import { CinematicHero } from "@/components/CinematicHero";
import { AquaStats } from "@/components/AquaStats";
import { DualFunnel } from "@/components/DualFunnel";
import { Methods } from "@/components/Methods";
import { ProcessSection } from "@/components/ProcessSection";
import { BeforeAfter } from "@/components/BeforeAfter";
import { WorkGallery } from "@/components/WorkGallery";
import { Promise as PromiseSection } from "@/components/Promise";
import { FAQ } from "@/components/FAQ";
import { FAQS } from "@/lib/faqs";
import { FinalCTA } from "@/components/FinalCTA";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import Script from "next/script";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CinematicHero />
      <AquaStats />
      <DualFunnel />
      <Methods />
      <ProcessSection />
      <BeforeAfter />
      <WorkGallery />
      <PromiseSection />
      <FAQ />
      <FinalCTA />
      <StickyMobileBar />
      {/* GHL chat widget — the A2P-registered SMS opt-in surface. Homepage ONLY:
          carriers require it to be the sole phone-collecting form on any page it
          appears on, and /assessment and /quote both collect phone numbers. */}
      <Script
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="6a32ee4e81870ee2fd443c44"
        data-source="WEB_USER"
        strategy="afterInteractive"
      />
    </>
  );
}
