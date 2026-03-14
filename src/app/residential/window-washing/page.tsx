import { Metadata } from "next";
import { ResidentialServicePage } from "@/components/services/ResidentialServicePage";

export const metadata: Metadata = {
  title: "Window Washing Portland OR | Streak-Free Cleaning",
  description: "Streak-free window washing in Portland, Oregon using reverse osmosis water purification. Residential & commercial. Free quotes from Rinse It Off.",
};

export default function WindowWashingPage() {
  return (
    <ResidentialServicePage
      overline="Residential & Commercial"
      headline="Window Washing in Portland, Oregon"
      subheadline="Crystal-clear, streak-free windows using our reverse osmosis water purification system. No chemicals on the glass, no residue, no spots — just pure water that dries perfectly clean."
      problemHeadline="Portland Rain Doesn't Clean Your Windows"
      problemBody={`Every Portland homeowner and business owner knows the frustration: rain leaves mineral deposits, water spots, and grime streaks that make windows look worse, not better. Traditional window cleaning with squeegees and chemicals helps — but spots return fast.

Rinse It Off uses a reverse osmosis (RO) water purification system that produces ultra-pure water containing zero minerals. When this water dries on glass, it leaves nothing behind. No spots, no streaks, no residue. Just clean glass.`}
      definition="Reverse osmosis window cleaning uses water purified through a multi-stage filtration process that removes all dissolved minerals and contaminants. The resulting ultra-pure water attracts and absorbs dirt on contact and dries without leaving any spots or mineral deposits."
      included={[
        "Reverse osmosis purified water system — zero-mineral, zero-residue",
        "Exterior window cleaning for all window types",
        "Interior cleaning available upon request",
        "Frame and sill wipe-down included",
        "Screen rinse included",
        "Multi-story residential and commercial capability",
      ]}
      faqs={[
        { q: "Why is reverse osmosis water better for window cleaning?", a: "Normal tap water contains dissolved minerals that leave spots when it dries on glass. RO removes those minerals completely. When RO water dries, it leaves nothing behind." },
        { q: "How often should I have my windows cleaned in Portland?", a: "Most Portland homes benefit from window cleaning 2-3 times per year. Spring, late summer, and before the holidays are most popular." },
        { q: "Can you clean windows on a two-story or three-story home?", a: "Yes. Our water-fed pole system reaches multiple stories from the ground safely — no ladders leaning against your home." },
        { q: "Do you wash the inside of windows too?", a: "Yes. Interior window cleaning is available as an add-on. Let us know when you request your quote." },
        { q: "Is window washing available for commercial buildings?", a: "Absolutely. We provide commercial window cleaning for storefronts, office buildings, and multi-unit properties throughout Portland." },
      ]}
      ctaHeadline="See Portland Clearly."
    />
  );
}
