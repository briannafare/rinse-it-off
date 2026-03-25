import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { SupportingLine } from "@/components/SupportingLine";
import { Features } from "@/components/Features";
import { Services } from "@/components/Services";
import { Philosophy } from "@/components/Philosophy";
import { Process } from "@/components/Process";
import { Residential } from "@/components/Residential";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <SupportingLine />
      <Features />
      <Services />
      <Philosophy />
      <Process />
      <Residential />
      <FAQ />
      <CTA />
    </>
  );
}
