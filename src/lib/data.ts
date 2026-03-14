export const site = {
  name: "Rinse It Off",
  phone: "(503) 704-3755",
  phoneHref: "tel:+15037043755",
  email: "hello@rinseitoff.com",
  location: "Portland, Oregon",
} as const;

export const nav = [
  { label: "Commercial", href: "/commercial-services", dropdown: false },
  { label: "Residential", href: "/residential/house-washing", dropdown: true },
  { label: "About", href: "/about", dropdown: false },
  { label: "Contact", href: "/contact", dropdown: false },
] as const;

export const residentialLinks = [
  { label: "House Washing", href: "/residential/house-washing" },
  { label: "Roof & Gutter Cleaning", href: "/residential/roof-gutter-cleaning" },
  { label: "Concrete Cleaning", href: "/residential/concrete-cleaning" },
  { label: "Deck & Fence Cleaning", href: "/residential/deck-fence-cleaning" },
  { label: "Window Washing", href: "/residential/window-washing" },
] as const;

export const services = [
  { title: "Building Washing", desc: "Soft wash and pressure wash for offices, retail centers, and multi-story commercial exteriors.", icon: "building", featured: false },
  { title: "Parking Lots & Loading Docks", desc: "Hot water pressure washing cuts through oil, grease, and grime on high-traffic surfaces.", icon: "truck", featured: false },
  { title: "Storefront & Retail", desc: "Facades, sidewalks, awnings, entryways — we keep your storefront inviting, on your schedule.", icon: "store", featured: false },
  { title: "HOA & Multi-Unit", desc: "Common areas, walkways, siding maintained consistently across your entire community.", icon: "homes", featured: false },
  { title: "Window Cleaning", desc: "Streak-free results with reverse osmosis water purification. Multi-story safe.", icon: "sparkle", featured: false },
  { title: "Recurring Programs", desc: "Monthly, quarterly, or seasonal maintenance customized to your property. One plan. Zero surprises.", icon: "calendar", featured: true },
] as const;

export const steps = [
  { num: "01", title: "Request Your Assessment", body: "Tell us about your property. We\u2019ll schedule a walkthrough to scope every surface \u2014 no commitment, no pressure." },
  { num: "02", title: "Get Your Custom Plan", body: "We build a maintenance plan around your property\u2019s specific needs and budget. Monthly, quarterly, seasonal \u2014 your call." },
  { num: "03", title: "Relax & Revel", body: "Our crew shows up on schedule, every time. You get a maintained property without managing another vendor. Neighbors will notice." },
] as const;

export const painPoints = [
  "Unreliable crews that miss scheduled cleanings",
  "No single vendor to handle every exterior surface",
  "Dirty walkways creating slip-and-fall liability",
  "Property appearance hurting tenant satisfaction",
] as const;

export const solutions = [
  "One vendor for your entire exterior \u2014 no more juggling",
  "Custom maintenance plans that actually run on schedule",
  "Clear communication and real accountability",
  "Eco-friendly methods built for Portland\u2019s climate",
] as const;

export const faqs = [
  { q: "What types of commercial properties does Rinse It Off service in Portland?", a: "We serve all commercial property types across Portland metro \u2014 office buildings, retail centers, strip malls, HOA communities, apartment complexes, industrial facilities, restaurants, medical offices, and churches. If it has an exterior, we maintain it." },
  { q: "How does a recurring maintenance program work?", a: "We start with a free property assessment. From there, we create a custom maintenance schedule \u2014 monthly, quarterly, or seasonal \u2014 covering every surface. One point of contact, one invoice, consistent results." },
  { q: "Do you offer after-hours cleaning for commercial properties?", a: "Yes. We schedule around your business operations. Early mornings, evenings, and weekends available so we never disrupt tenants, customers, or workflow." },
  { q: "What cleaning methods do you use?", a: "Soft washing for siding and delicate surfaces, hot water pressure washing for concrete and heavy stains, and reverse osmosis water purification for streak-free windows. All products are eco-friendly and safe for Portland\u2019s waterways." },
  { q: "How do I get a quote for my commercial property?", a: "Request a free property assessment on our website or call (503) 704-3755. We\u2019ll schedule a walkthrough and provide a detailed, transparent quote \u2014 no hidden fees." },
] as const;
