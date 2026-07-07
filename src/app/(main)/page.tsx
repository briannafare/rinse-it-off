import { WipeHero } from "@/components/WipeHero";
import { AquaStats } from "@/components/AquaStats";
import { DualFunnel } from "@/components/DualFunnel";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ProcessSection } from "@/components/ProcessSection";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Promise } from "@/components/Promise";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { StickyMobileBar } from "@/components/StickyMobileBar";

export default function HomePage() {
  return (
    <>
      <WipeHero />
      <AquaStats />
      <DualFunnel />
      <ServicesGrid />
      <ProcessSection />
      <BeforeAfter />
      <Promise />
      <FAQ />
      <FinalCTA />
      <StickyMobileBar />
    </>
  );
}
