import { Metadata } from "next";
import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";

export const metadata: Metadata = {
  title: "Driveway & Concrete Cleaning Portland OR",
  description: "Hot water pressure washing for driveways, sidewalks & patios in Portland, Oregon. Remove oil, moss & stains. Free quotes from Rinse It Off.",
};

export default function ConcreteCleaningPage() {
  return (
    <ResidentialServicePage
      headline="Driveway, Sidewalk & Concrete Cleaning in Portland, Oregon"
      subheadline="Hot water pressure washing that removes oil, moss, algae, and years of embedded stains from your driveway, sidewalks, patios, and pool decks."
      problemHeadline="Your Driveway Deserves More Than Cold Water"
      problemBody={`Portland's wet climate leaves driveways and sidewalks covered in green algae, black mold stains, and slippery moss — a problem that cold water pressure washing barely touches. Our hot water system breaks down oil, grease, and organic growth at a molecular level, restoring concrete to near-original condition.

Hot water pressure washing is the professional standard for concrete cleaning. It's faster, more thorough, and delivers results that last longer than cold water methods.`}
      definition="Hot water pressure washing uses heated water (typically 200°F+) combined with high pressure to dissolve oil, grease, and organic stains from concrete surfaces more effectively than cold water pressure washing alone."
      included={[
        "Hot water pressure washing for all concrete surfaces",
        "Oil and grease stain pre-treatment",
        "Moss and algae removal from joints and expansion cracks",
        "Edge cleaning along curbs and landscaping borders",
        "Eco-friendly runoff management",
      ]}
      faqs={[
        { q: "How much does driveway pressure washing cost in Portland?", a: "Costs depend on driveway size, stain severity, and surface condition. Rinse It Off provides free, transparent quotes. Contact us at (503) 704-3755." },
        { q: "Why is hot water better than cold water for concrete cleaning?", a: "Hot water breaks down oil, grease, and biological stains at a molecular level — something cold water can't do effectively. It also kills moss more thoroughly, so concrete stays cleaner longer." },
        { q: "Will pressure washing damage my concrete?", a: "When done correctly, no. Our technicians adjust pressure settings based on concrete age and condition. We never use excessive pressure that could etch or pit surfaces." },
        { q: "How often should I have my driveway cleaned in Portland?", a: "Most Portland driveways benefit from annual cleaning, ideally in spring after rainy season. Shaded driveways may need it every 8-12 months." },
        { q: "Can you remove oil stains from my garage floor or driveway?", a: "Yes. Our hot water system combined with specialized degreasing agents removes most oil and automotive fluid stains from concrete." },
      ]}
      ctaHeadline="Stop Walking Past That Stained Driveway."
    />
  );
}
