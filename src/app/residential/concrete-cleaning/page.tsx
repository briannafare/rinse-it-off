import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";
export const metadata = { title: "Driveway & Concrete Cleaning Portland OR" };
export default function Page() {
  return <ResidentialServicePage
    headline="Driveway, Sidewalk & Concrete Cleaning in Portland, Oregon"
    subheadline="Hot water pressure washing removes oil, moss, algae, and years of embedded stains from driveways, sidewalks, patios, and pool decks."
    problemHeadline="Your Driveway Deserves More Than Cold Water"
    problemBody={"Portland's wet climate leaves driveways and sidewalks covered in green algae, black mold stains, and slippery moss — problems cold water barely touches. Our hot water system breaks down oil, grease, and organic growth at a molecular level, restoring concrete to near-original condition.\n\nHot water pressure washing is the professional standard. It's faster, more thorough, and delivers results that last longer than cold water methods."}
    definition="Hot water pressure washing uses heated water (200\u00b0F+) combined with high pressure to dissolve oil, grease, and organic stains from concrete more effectively than cold water alone."
    included={["Hot water pressure washing for all concrete","Oil and grease stain pre-treatment","Moss and algae removal from joints","Edge cleaning along curbs and landscaping","Eco-friendly runoff management"]}
    faqs={[
      {q:"How much does driveway cleaning cost in Portland?",a:"Depends on size, stain severity, and condition. We provide free quotes — call (503) 704-3755."},
      {q:"Why is hot water better than cold?",a:"Hot water breaks down oil and biological stains at a molecular level. Concrete stays cleaner longer."},
      {q:"Will pressure washing damage my concrete?",a:"Not when done correctly. We adjust settings based on concrete age and condition."},
      {q:"How often should I clean my driveway in Portland?",a:"Annually is ideal, usually in spring after rainy season. Shaded driveways may need it every 8-12 months."},
    ]}
    ctaLine="Stop Walking Past That Stained Driveway."
  />;
}
