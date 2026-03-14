import { Metadata } from "next";
import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";

export const metadata: Metadata = {
  title: "House Washing Portland OR | Soft Wash Exterior Cleaning",
  description: "Gentle soft wash house cleaning in Portland, Oregon. Eco-friendly mold & moss removal for siding without pressure damage. Get a free quote from Rinse It Off.",
};

export default function HouseWashingPage() {
  return (
    <ResidentialServicePage
      headline="House Washing in Portland, Oregon"
      subheadline="Rinse It Off uses a gentle soft wash system to remove mold, moss, and algae from your home's exterior — without damaging your siding. Eco-friendly products formulated specifically for the Pacific Northwest."
      badge="PNW Specialists · Eco-Friendly"
      problemHeadline="Portland's Climate Is Hard on Your Home"
      problemBody={`Living in the Pacific Northwest means dealing with mold, moss, and algae that love your home's exterior as much as you do. Portland's wet winters and mild temperatures create the perfect environment for organic growth that clings to siding, trim, and eaves — making your home look neglected even when it's not.

Rinse It Off's gentle soft wash technique solves this without the risks of traditional high-pressure washing. We apply eco-friendly cleaning agents that break down mold, moss, and algae at the root. After a brief dwell time, we rinse everything away with low pressure — leaving your siding clean, undamaged, and protected.`}
      definition="Soft washing is a low-pressure exterior cleaning method that uses specialized biodegradable cleaning agents to remove organic growth from home exteriors without the surface damage associated with high-pressure washing."
      included={[
        "Full exterior soft wash — all siding, trim, eaves, and fascia",
        "Eco-friendly, Portland-waterway-safe cleaning agents",
        "Treatment of mold, moss, algae, and mildew at the root",
        "Low-pressure rinse that won't damage siding, paint, or stain",
        "Foundation and lower-wall splash zone cleaning",
        "Safe for vinyl, wood, fiber cement, stucco, brick, and painted surfaces",
      ]}
      industryStatNote="According to the National Association of Realtors, exterior cleaning and curb appeal improvements deliver one of the highest returns on investment for homeowners."
      processSteps={[
        { number: "01", title: "Get Your Free Quote", description: "Tell us about your home and we'll provide a transparent quote — no commitment, no pressure." },
        { number: "02", title: "Schedule Your Wash", description: "Pick a time that works for you. We work around your schedule, including weekends." },
        { number: "03", title: "Enjoy the Results", description: "Watch your home transform. Our gentle wash removes years of buildup, and the results last." },
      ]}
      faqs={[
        { q: "How much does house washing cost in Portland, Oregon?", a: "Costs vary based on home size, stories, siding material, and organic growth. Rinse It Off provides free, transparent quotes. Contact us at (503) 704-3755." },
        { q: "Will soft washing damage my home's siding?", a: "No. Soft washing uses low-pressure water with biodegradable cleaning agents — not high-pressure blasting. It's the safest method for cleaning Portland homes." },
        { q: "How often should I have my house washed in the Pacific Northwest?", a: "Most Portland homes benefit from an exterior wash every 12 to 18 months. Heavily shaded homes may need it annually." },
        { q: "Are the cleaning products safe for my garden and pets?", a: "Yes. All products are eco-friendly and biodegradable, formulated to be safe for Portland's waterways, gardens, and pets." },
        { q: "What's the best time of year for house washing in Portland?", a: "Late spring through early fall is ideal — after heavy rain season ends. Many Portland homeowners schedule for May or June." },
        { q: "Do you wash multi-story homes?", a: "Yes. Our equipment reaches multiple stories safely from the ground. No ladders against your siding." },
      ]}
      ctaHeadline="Your Home Deserves Better Than Moss and Mildew."
    />
  );
}
