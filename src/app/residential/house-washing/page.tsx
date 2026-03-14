import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";
export const metadata = { title: "House Washing Portland OR | Soft Wash Exterior Cleaning" };
export default function Page() {
  return <ResidentialServicePage
    headline="House Washing in Portland, Oregon"
    subheadline="Gentle soft wash removes mold, moss, and algae from your home's exterior — without damaging your siding. Eco-friendly products built for the PNW."
    badge="PNW Specialists \u00b7 Eco-Friendly"
    problemHeadline="Portland's Climate Is Hard on Your Home"
    problemBody={"Living in the Pacific Northwest means mold, moss, and algae that love your home's exterior. Portland's wet winters and mild temps create the perfect environment for organic growth that clings to siding, trim, and eaves.\n\nOur gentle soft wash technique solves this without the risks of high-pressure washing. We apply eco-friendly agents that break down growth at the root, let them dwell, then rinse everything away with low pressure — leaving siding clean, undamaged, and protected."}
    definition="Soft washing is a low-pressure exterior cleaning method using biodegradable agents to remove organic growth from home exteriors without the surface damage of high-pressure washing."
    included={["Full exterior soft wash — siding, trim, eaves, fascia","Eco-friendly Portland-waterway-safe agents","Mold, moss, algae, and mildew treated at root","Low-pressure rinse that won't damage siding or paint","Foundation splash zone cleaning","Safe for vinyl, wood, fiber cement, stucco, brick"]}
    statNote="According to the National Association of Realtors, exterior cleaning delivers one of the highest ROI improvements for homeowners."
    processSteps={[{num:"01",title:"Get Your Free Quote",body:"Tell us about your home — we'll provide a transparent quote, no commitment."},{num:"02",title:"Schedule Your Wash",body:"Pick a time that works. We work around your schedule, including weekends."},{num:"03",title:"Enjoy the Results",body:"Watch your home transform. Our gentle wash removes years of buildup."}]}
    faqs={[
      {q:"How much does house washing cost in Portland?",a:"Costs vary by home size, stories, siding material, and growth. We provide free, transparent quotes. Call (503) 704-3755."},
      {q:"Will soft washing damage my siding?",a:"No. Soft washing uses low pressure with biodegradable agents — not high-pressure blasting. It's the safest method for Portland homes."},
      {q:"How often should I wash my house in the PNW?",a:"Most Portland homes benefit from a wash every 12-18 months. Heavily shaded homes may need it annually."},
      {q:"Are the products safe for my garden and pets?",a:"Yes. All products are eco-friendly and biodegradable, safe for Portland's waterways, gardens, and pets."},
      {q:"What's the best time of year in Portland?",a:"Late spring through early fall is ideal. Many Portland homeowners schedule for May or June to kick off summer clean."},
    ]}
    ctaLine="Your Home Deserves Better Than Moss and Mildew."
  />;
}
