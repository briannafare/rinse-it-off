/** FAQ content — single source of truth for both the FAQ component and the
 *  FAQPage JSON-LD on the homepage. Plain module (no "use client") so the
 *  server component can import the array directly. */
export type FAQItem = { q: string; a: string };

export const FAQS: FAQItem[] = [
  { q: "What is the difference between pressure washing and soft washing?", a: "Pressure washing uses higher-pressure water for hard surfaces like concrete, pavers, and stone. Soft washing uses low pressure plus biodegradable cleaning solutions. Concrete can take pressure. Siding, roofs and painted trim can't, so they get low pressure and a cleaning solution." },
  { q: "Do you wash houses and siding, or only commercial buildings?", a: "Both. We clean homes and commercial buildings alike — vinyl, fiber-cement, stucco, wood, and brick. Delicate siding gets a gentle soft wash, so we lift off dirt, mildew, and that green Northwest film without forcing water behind the cladding or stripping paint." },
  { q: "Can you clean my driveway, patio, and walkways?", a: "Yes — driveways, patios, walkways, pool decks, and parking areas for homes and businesses. We surface-clean concrete and pavers for an even, stripe-free finish and treat oil stains, moss, and algae at the source instead of just blasting the top layer off." },
  { q: "Do you soft-wash roofs and remove moss?", a: "Yes. Roofs get a low-pressure soft wash that kills moss and algae at the root and rinses clean — gentle enough for asphalt shingles, so nothing gets cracked or knocked loose." },
  { q: "How much does it cost, and can I get a quote for my home online?", a: "Commercial cleaning visits start at $750. Gutters on their own start at $350. The yearly plan starts at $189 a month for an easy single-story home up to 1,500 sq ft, and you can see your price online at rinseitoff.com/plan. Everything else gets an itemized price after a free walkthrough." },
  { q: "What areas do you serve?", a: "Based in Tigard. Serving Portland and the surrounding metro. Larger commercial projects across the Willamette Valley." },
  { q: "Do you offer recurring maintenance programs?", a: "Yes — monthly, quarterly, and seasonal plans for both homes and commercial properties. Recurring visits stay ahead of the moss, algae, and grime that Portland's rain drives into siding, concrete, and roofing. Set a schedule and we handle the rest." },
  { q: "What is hot water pressure washing, and when do you use it?", a: "Hot water dissolves oil, grease, and biological buildup that cold water can't touch. We use it on parking lots, trash pads, loading docks, drive-throughs, and commercial kitchen exhaust areas — and on stubborn residential messes too. We bring both hot and cold water systems to every job so we can match the method to the mess." },
  { q: "Are you insured?", a: "Yes — we're insured, with full general liability and workers' compensation coverage, and we're glad to share proof before we start. Plain and simple: you're protected on residential and commercial work alike." },
  { q: "Will pressure washing damage my building or property?", a: "Not when it's done by a trained crew with the right gear. We match pressure levels and nozzle types to each surface, soft-wash anything delicate, and protect landscaping, windows, and fixtures before we start — the same care on your home as on a storefront. That's the difference between a pro and a guy with a rented machine." },
  { q: "What is the Clean Water Promise?", a: "It's our guarantee: if there's any spot you're not happy with, we re-rinse it free within 48 hours. No debate, no fine print. We'd rather come back and make it right than leave you looking at a streak." },
];

/** The home page keeps only the questions that help someone book (SuperMe website panel). */
export const HOME_FAQS: FAQItem[] = [
  FAQS.find((f) => f.q.startsWith("How much does it cost"))!,
  FAQS.find((f) => f.q.startsWith("What areas do you serve"))!,
  FAQS.find((f) => f.q.startsWith("Are you insured"))!,
];
