import { CinematicHero } from "@/components/CinematicHero";
import { AquaStats } from "@/components/AquaStats";
import { DualFunnel } from "@/components/DualFunnel";
import { PlanSection } from "@/components/PlanSection";
import { Methods } from "@/components/Methods";
import { ProcessSection } from "@/components/ProcessSection";
import { BeforeAfter } from "@/components/BeforeAfter";
import { WorkGallery } from "@/components/WorkGallery";
import { Promise as PromiseSection } from "@/components/Promise";
import { FAQ } from "@/components/FAQ";
import { FAQS } from "@/lib/faqs";
import { FinalCTA } from "@/components/FinalCTA";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { TitleCard } from "@/components/retro/Bits";
import { HolidayLights } from "@/components/HolidayLights";
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
      <TitleCard chapter="Chapter one" title="The Yearly Plan" tone="tealtint" />
      <PlanSection />
      <AquaStats />
      <HolidayLights />
      <DualFunnel />
      <TitleCard chapter="Chapter two" title="How We Clean" />
      <Methods />
      <ProcessSection />
      <TitleCard chapter="Chapter three" title="Real Jobs" tone="sky" />
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
      {/* Keep the chat out of the way (finish brief 2026-10-20): a smaller bubble tucked into the
          corner, sitting above the phone's sticky Call / Text / Free quote bar, and no pop-up prompt
          over headlines or buttons. The widget lives in a shadow root, so its style goes in there. */}
      <Script id="chat-tuck" strategy="afterInteractive">{`
        (function tuck(n){
          var w=document.querySelector('chat-widget'), r=w&&w.shadowRoot;
          if(!r||!r.querySelector('#lc_text-widget--btn')){ if(n<60) setTimeout(function(){tuck(n+1)},500); return; }
          if(r.getElementById('rio-tuck')) return;
          var s=document.createElement('style'); s.id='rio-tuck';
          s.textContent='#lc_text-widget--btn{width:46px!important;height:46px!important;right:12px!important;bottom:12px!important}'
            +'#lc_text-widget--btn .icon{width:46px!important;height:46px!important}'
            +'#lc_text-widget:not(.active) .lc_text-widget--prompt, .lc_text-widget--prompt{display:none!important}'
            +'@media (max-width:767px){#lc_text-widget--btn{bottom:calc(76px + env(safe-area-inset-bottom))!important}}';
          r.appendChild(s);
        })(0);
      `}</Script>
    </>
  );
}
