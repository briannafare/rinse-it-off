import { Hero } from "@/components/sections/Hero";
import { ServiceTicker } from "@/components/sections/ServiceTicker";
import { CommercialServices } from "@/components/sections/CommercialServices";
import { WhyClean } from "@/components/sections/WhyClean";
import { Process } from "@/components/sections/Process";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { ResidentialServices } from "@/components/sections/ResidentialServices";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceTicker />
      <CommercialServices />
      <WhyClean />
      <Process />
      <BeforeAfter />
      <ResidentialServices />
      <FAQ />
      <CTASection />
    </>
  );
}
