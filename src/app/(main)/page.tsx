import { CinematicHero } from "@/components/CinematicHero";
import { AquaStats } from "@/components/AquaStats";
import { DualFunnel } from "@/components/DualFunnel";
import { Methods } from "@/components/Methods";
import { ProcessSection } from "@/components/ProcessSection";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Promise as PromiseSection } from "@/components/Promise";
import { FAQ } from "@/components/FAQ";
import { FAQS } from "@/lib/faqs";
import { FinalCTA } from "@/components/FinalCTA";
import { StickyMobileBar } from "@/components/StickyMobileBar";

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
      <PromiseSection />
      <FAQ />
      <FinalCTA />
      <StickyMobileBar />
    </>
  );
}
