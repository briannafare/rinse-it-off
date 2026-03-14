export const siteConfig = {
  name: "Rinse It Off",
  phone: "(503) 704-3755",
  phoneHref: "tel:+15037043755",
  email: "hello@rinseitoff.com",
  location: "Portland, Oregon",
  tagline: "Commercial Exterior Cleaning for Portland Properties",
} as const;

export const navLinks = [
  { label: "Commercial Services", href: "/commercial-services" },
  { label: "Residential", href: "/residential/house-washing", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const residentialLinks = [
  { label: "House Washing", href: "/residential/house-washing" },
  { label: "Roof & Gutter Cleaning", href: "/residential/roof-gutter-cleaning" },
  { label: "Concrete Cleaning", href: "/residential/concrete-cleaning" },
  { label: "Deck & Fence Cleaning", href: "/residential/deck-fence-cleaning" },
  { label: "Window Washing", href: "/residential/window-washing" },
] as const;

export const commercialServices = [
  {
    title: "Building Washing",
    description: "Soft wash and pressure wash systems for office buildings, retail centers, and multi-story commercial exteriors.",
    icon: "Building2" as const,
  },
  {
    title: "Parking Lots & Loading Docks",
    description: "Hot water pressure washing removes oil, grease, and grime from high-traffic commercial surfaces.",
    icon: "Car" as const,
  },
  {
    title: "Storefront & Retail",
    description: "Keep your storefront inviting. We clean facades, sidewalks, awnings, and entryways on your schedule.",
    icon: "Store" as const,
  },
  {
    title: "HOA & Multi-Unit",
    description: "Common areas, walkways, siding, and shared surfaces maintained consistently across your entire property.",
    icon: "Home" as const,
  },
  {
    title: "Commercial Windows",
    description: "Streak-free results with our reverse osmosis water purification system. Safe for multi-story buildings.",
    icon: "Sparkles" as const,
  },
  {
    title: "Recurring Maintenance Programs",
    description: "Monthly, quarterly, or seasonal programs customized to your property's needs. One plan. Zero surprises.",
    icon: "CalendarCheck" as const,
    featured: true,
  },
] as const;

export const processSteps = [
  {
    number: "01",
    title: "Request Your Assessment",
    description: "Tell us about your property. We\u2019ll schedule a walkthrough to evaluate every exterior surface \u2014 no commitment, no pressure.",
  },
  {
    number: "02",
    title: "Get Your Custom Plan",
    description: "We build a maintenance plan around your property\u2019s specific needs, schedule, and budget. Monthly, quarterly, or seasonal \u2014 your call.",
  },
  {
    number: "03",
    title: "We Handle the Rest",
    description: "Our crew shows up on schedule, every time. You get a maintained property without managing another vendor.",
  },
] as const;

export const painPoints = [
  "Unreliable crews that miss scheduled cleanings",
  "No single vendor to handle every exterior surface",
  "Dirty walkways creating slip-and-fall liability",
  "Property appearance hurting tenant satisfaction",
] as const;

export const homeFaqs = [
  {
    q: "What types of commercial properties does Rinse It Off service in Portland?",
    a: "Rinse It Off serves all commercial property types across the Portland metro area. That includes office buildings, retail centers, strip malls, HOA communities, apartment complexes, industrial facilities, restaurants, medical offices, and churches. If it has an exterior, we maintain it.",
  },
  {
    q: "How does a recurring maintenance program work?",
    a: "We start with a free property assessment to understand your building\u2019s exterior needs. From there, we create a custom maintenance schedule \u2014 monthly, quarterly, or seasonal \u2014 that covers every surface. You get one point of contact, one invoice, and consistent results.",
  },
  {
    q: "Do you offer after-hours cleaning for commercial properties?",
    a: "Yes. We schedule commercial cleanings around your business operations. Early mornings, evenings, and weekends are all available so we never disrupt your tenants, customers, or daily workflow.",
  },
  {
    q: "What cleaning methods does Rinse It Off use?",
    a: "We use a combination of soft washing, hot water pressure washing, and reverse osmosis water purification depending on the surface. All products are eco-friendly and safe for Portland\u2019s waterways.",
  },
  {
    q: "What areas in Portland does Rinse It Off serve?",
    a: "Rinse It Off is based in Portland, Oregon and serves the greater Portland metro area. Contact us for specific service area coverage.",
  },
  {
    q: "How do I get a quote for my commercial property?",
    a: "Start by requesting a free property assessment through our website or by calling (503) 704-3755. We\u2019ll schedule a walkthrough, then provide a detailed, transparent quote with no hidden fees.",
  },
] as const;
