import { WipeHero } from "@/components/WipeHero";
import { DualFunnel } from "@/components/DualFunnel";
import { ServicesGrid } from "@/components/ServicesGrid";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Promise } from "@/components/Promise";
import { FAQ } from "@/components/FAQ";
import { StickyMobileBar } from "@/components/StickyMobileBar";

export default function HomePage() {
  return (
    <>
      <WipeHero />
      <DualFunnel />
      <ServicesGrid />
      <BeforeAfter />
      <Promise />
      <FAQ />
      <StickyMobileBar />
    </>
  );
}
