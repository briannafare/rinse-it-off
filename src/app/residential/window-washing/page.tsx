import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";
export const metadata = { title: "Window Washing Portland OR | Streak-Free Cleaning" };
export default function Page() {
  return <ResidentialServicePage
    overline="Residential & Commercial"
    headline="Window Washing in Portland, Oregon"
    subheadline="Crystal-clear, streak-free windows with our reverse osmosis water purification system. No chemicals on the glass, no residue — just pure water that dries perfectly clean."
    problemHeadline="Portland Rain Doesn't Clean Your Windows"
    problemBody={"Rain leaves mineral deposits, water spots, and grime streaks that make windows look worse, not better. Traditional cleaning with squeegees and chemicals helps — but spots return fast.\n\nOur reverse osmosis (RO) system produces ultra-pure water containing zero minerals. When it dries on glass, it leaves nothing behind. No spots, no streaks, no residue. Just clean glass."}
    definition="Reverse osmosis window cleaning uses water purified through multi-stage filtration that removes all dissolved minerals. The ultra-pure water absorbs dirt on contact and dries without spots or deposits."
    included={["Reverse osmosis purified water — zero residue","Exterior window cleaning for all types","Interior cleaning available on request","Frame and sill wipe-down included","Screen rinse included","Multi-story residential and commercial safe"]}
    faqs={[
      {q:"Why is reverse osmosis water better for windows?",a:"Tap water has minerals that leave spots when it dries. RO removes them completely — nothing left behind."},
      {q:"How often should I clean windows in Portland?",a:"2-3 times per year. Spring, late summer, and before the holidays are most popular."},
      {q:"Can you clean multi-story windows?",a:"Yes. Our water-fed pole system reaches multiple stories safely from the ground."},
      {q:"Do you wash inside windows too?",a:"Yes — interior cleaning is available as an add-on. Just let us know when requesting your quote."},
      {q:"Is window washing available for commercial buildings?",a:"Absolutely. We provide commercial window cleaning for storefronts, offices, and multi-unit properties across Portland."},
    ]}
    ctaLine="See Portland Clearly."
  />;
}
