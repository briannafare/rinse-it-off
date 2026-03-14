import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";
export const metadata = { title: "Roof & Gutter Cleaning Portland OR | Moss Removal" };
export default function Page() {
  return <ResidentialServicePage
    headline="Roof & Gutter Cleaning in Portland, Oregon"
    subheadline="Moss, algae, and clogged gutters cause real damage. Our low-pressure treatment protects your roof and won't void your warranty."
    badge="Won't Void Warranty \u00b7 Lasts 2-3 Years"
    problemHeadline="Portland Roofs Have a Moss Problem"
    problemBody={"Oregon's rain feeds moss, algae, and lichen on roofs — especially composite shingles. Left untreated, moss lifts shingles, traps moisture, and accelerates deterioration. Clogged gutters back up water into fascia and foundations.\n\nWe treat the entire system. Our low-pressure roof wash kills growth at the root and prevents regrowth for 2-3 years. We also perform a full gutter clearing and downspout flush."}
    definition="Roof soft washing applies biodegradable treatments to kill moss, algae, and lichen without the high-pressure force that damages shingles and voids manufacturer warranties."
    included={["Full roof soft wash — kills growth at the root","Complete gutter clearing and debris removal","Downspout flush for proper drainage","Safe for composite, metal, tile, and cedar","Won't void roofing manufacturer warranty","Results last 2-3 years per treatment"]}
    faqs={[
      {q:"Does pressure washing a roof void the warranty?",a:"High-pressure washing can void most warranties. We use low-pressure soft wash that's safe for your roof and warranty."},
      {q:"How often should gutters be cleaned in Portland?",a:"At least twice per year — late fall after leaves drop and spring after heavy rains. Homes near trees may need quarterly."},
      {q:"How long does a roof moss treatment last?",a:"Our treatment prevents regrowth for 2-3 years on most Portland roofs, depending on sun exposure and tree coverage."},
      {q:"Do you handle roof and gutters in one visit?",a:"Yes. Roof treatment, full gutter clearing, and downspout flushing are all included in a single visit."},
    ]}
    ctaLine="Protect Your Roof Before Portland's Rain Does the Damage."
  />;
}
