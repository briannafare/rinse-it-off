import { Metadata } from "next";
import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";

export const metadata: Metadata = {
  title: "Roof & Gutter Cleaning Portland OR | Moss Removal",
  description: "Professional roof moss removal and gutter cleaning in Portland, Oregon. Low-pressure treatment that won't void your warranty. Free quotes from Rinse It Off.",
};

export default function RoofGutterPage() {
  return (
    <ResidentialServicePage
      headline="Roof & Gutter Cleaning in Portland, Oregon"
      subheadline="Moss, algae, and clogged gutters cause real damage to Portland homes. Rinse It Off removes the threat with a low-pressure treatment that protects your roof — and won't void your warranty."
      badge="Won't Void Warranty · Results Last 2-3 Years"
      problemHeadline="Portland Roofs Have a Moss Problem"
      problemBody={`Oregon's rainy climate feeds moss, algae, and lichen growth on roofs — especially composite shingle roofs, which cover the majority of Portland homes. Left untreated, moss lifts shingles, traps moisture, and accelerates roof deterioration. Clogged gutters compound the problem by backing up water into fascia boards and foundations.

Rinse It Off treats the entire system. Our low-pressure roof wash kills moss and algae at the root and prevents regrowth for up to 2-3 years. We also perform a full gutter clearing and downspout flush so water flows where it should.`}
      definition="Roof soft washing is a low-pressure cleaning method that applies biodegradable treatments to kill moss, algae, and lichen on roofing materials without the high-pressure force that can damage shingles and void manufacturer warranties."
      included={[
        "Full roof soft wash treatment — kills moss, algae, and lichen at the root",
        "Complete gutter clearing and debris removal",
        "Downspout flush to ensure proper drainage",
        "Safe for composite shingles, metal, tile, and cedar",
        "Won't void roofing manufacturer warranty",
        "Results last 2-3 years with a single treatment",
      ]}
      faqs={[
        { q: "Does pressure washing a roof void the warranty in Oregon?", a: "High-pressure washing can void most roofing manufacturer warranties because it damages shingles and removes protective granules. We use a low-pressure soft wash system that's safe for your roof and warranty." },
        { q: "How often should I have my gutters cleaned in Portland?", a: "Most Portland homes need gutter cleaning at least twice a year — late fall after leaves drop and spring after heavy rains. Homes near large trees may need quarterly." },
        { q: "How long does a roof moss treatment last?", a: "Our treatment kills moss at the root and prevents regrowth for 2-3 years on most Portland roofs. Results depend on sun exposure and tree coverage." },
        { q: "Can you clean my roof without damaging the shingles?", a: "Yes. Our soft wash system uses low pressure and specialized cleaning agents — the method recommended by most roofing manufacturers." },
        { q: "Do you clean both the roof and gutters in one visit?", a: "Yes. Roof treatment, full gutter clearing, and downspout flushing are all included in a single visit." },
      ]}
      ctaHeadline="Protect Your Roof Before Portland's Rain Does the Damage."
    />
  );
}
