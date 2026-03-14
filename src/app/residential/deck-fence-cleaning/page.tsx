import { Metadata } from "next";
import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";

export const metadata: Metadata = {
  title: "Deck & Fence Cleaning Portland OR",
  description: "Gentle deck and fence cleaning in Portland, Oregon. Safe for wood, composite & vinyl. Restore your outdoor spaces. Free quotes from Rinse It Off.",
};

export default function DeckFencePage() {
  return (
    <ResidentialServicePage
      headline="Deck & Fence Cleaning in Portland, Oregon"
      subheadline="Revitalize your outdoor spaces with gentle cleaning that's safe for wood, composite, and vinyl surfaces. We remove weathering, algae, and stains without damaging the material."
      problemHeadline="Portland Weather Beats Up Outdoor Surfaces"
      problemBody={`Rain, moisture, and shade turn Portland decks and fences gray, green, and slippery. Algae, mold, and weathering damage wood fibers over time — and once it sets in, it gets harder and more expensive to fix.

Rinse It Off cleans decks and fences with methods calibrated to each material. We use low-pressure techniques and surface-safe cleaning agents so your wood, composite, or vinyl comes out clean — not stripped or splintered.`}
      included={[
        "Gentle low-pressure cleaning for all deck and fence materials",
        "Algae, mold, and mildew removal",
        "Safe for wood (cedar, redwood, pine), composite (Trex, TimberTech), and vinyl",
        "Prepares surfaces for staining, sealing, or painting",
        "Railing, spindle, and post detail cleaning",
      ]}
      faqs={[
        { q: "Can pressure washing damage a wood deck?", a: "High pressure absolutely can damage wood by splintering fibers and raising the grain. We use calibrated low-pressure techniques with surface-safe cleaning agents." },
        { q: "Should I clean my deck before staining or sealing?", a: "Yes. Cleaning removes contaminants that prevent stain and sealant from adhering properly. We recommend scheduling 2-3 days before staining." },
        { q: "How often should I clean my deck in Portland?", a: "Portland decks generally need cleaning every 1-2 years. Shaded or north-facing decks may benefit from annual cleaning." },
        { q: "Do you clean composite decks like Trex?", a: "Yes. We clean all composite decking brands including Trex, TimberTech, and Azek. Our methods are formulated to be safe for composite materials." },
        { q: "Can you also clean pergolas and arbors?", a: "Yes. We clean all outdoor wood, composite, and vinyl structures — pergolas, arbors, trellises, gazebos, and more." },
      ]}
      ctaHeadline="Your Deck Looked Better the Day It Was Built. Let's Get It Close."
    />
  );
}
