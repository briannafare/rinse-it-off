import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";
export const metadata = { title: "Deck & Fence Cleaning Portland OR" };
export default function Page() {
  return <ResidentialServicePage
    headline="Deck & Fence Cleaning in Portland, Oregon"
    subheadline="Revitalize your outdoor spaces with gentle cleaning safe for wood, composite, and vinyl. We remove weathering, algae, and stains without damaging the material."
    problemHeadline="Portland Weather Beats Up Outdoor Surfaces"
    problemBody={"Rain, moisture, and shade turn Portland decks and fences gray, green, and slippery. Algae, mold, and weathering damage fibers over time — and once it sets in, it gets harder and more expensive to fix.\n\nWe clean decks and fences with methods calibrated to each material. Low-pressure techniques and surface-safe agents so your wood, composite, or vinyl comes out clean — not stripped or splintered."}
    included={["Gentle low-pressure cleaning for all materials","Algae, mold, and mildew removal","Safe for cedar, redwood, pine, Trex, TimberTech, vinyl","Prepares surfaces for staining, sealing, or painting","Railing, spindle, and post detail cleaning"]}
    faqs={[
      {q:"Can pressure washing damage a wood deck?",a:"High pressure can splinter wood fibers. We use calibrated low-pressure with surface-safe agents instead."},
      {q:"Should I clean before staining or sealing?",a:"Yes. Cleaning removes contaminants that prevent proper adhesion. Schedule 2-3 days before staining."},
      {q:"How often should I clean my deck in Portland?",a:"Every 1-2 years. Shaded or north-facing decks may benefit from annual cleaning."},
      {q:"Do you clean composite decks like Trex?",a:"Yes — all composite brands including Trex, TimberTech, and Azek. Our methods are formulated to be safe for composites."},
    ]}
    ctaLine="Your Deck Looked Better the Day It Was Built. Let's Get It Close."
  />;
}
