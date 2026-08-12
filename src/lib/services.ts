/** Service pages — one per method. This is the single source of truth for the
 *  /services index and every /services/[slug] page. The base of each service
 *  (key, surface, method, img, what, alt) is REUSED straight from the
 *  method-matching system in methods.ts, so the six services can never drift
 *  from the homepage. Everything below the base is page-specific copy.
 *
 *  Claims are locked: free 21-point property audit → firm itemized quote the
 *  same day we walk your property; Clean Water Promise = re-rinse free within
 *  48 hours; ~164 rainy days/yr; Insured (no license number); NO pricing,
 *  NO reviews. Serves BOTH residential and commercial. */
import { METHODS, type Method } from "@/lib/methods";
import type { FAQItem } from "@/lib/faqs";

export type Service = Method & {
  slug: string; // URL segment → /services/<slug>
  h1: string; // page headline
  intro: string; // fuller explanation paragraph (below the lead line)
  whenYouNeedIt: string; // the "when you need it" callout
  bullets: string[]; // 3–4 what's-included points
  faqs: FAQItem[]; // 2–3 service-specific questions
};

/** Per-service copy, keyed by the method key from methods.ts. Kept separate so
 *  the base fields stay owned by methods.ts and merge in below. */
const EXTRA: Record<string, Omit<Service, keyof Method>> = {
  roof: {
    slug: "roof-soft-wash",
    h1: "Roof soft washing",
    intro:
      "The roof is the most expensive surface on the property and the easiest to ruin with the wrong approach — high pressure strips the protective granules off asphalt shingles. We soft wash instead: a low-pressure application of biodegradable cleaners that kill moss, algae and mildew at the root, then rinse clean. Home or commercial building, the roof reads the same to us — assess first, match the chemistry, never blast.",
    whenYouNeedIt:
      "Black streaks down the slope, green moss cushions along the shingle seams, or a north-facing pitch that never seems to dry out. With around 164 rainy days a year in the Portland metro, roof moss isn't an if but a when — and staying ahead of it protects the roof from real, expensive damage.",
    bullets: [
      "Low-pressure soft wash that kills moss and algae at the root — no granule loss, no cracked shingles",
      "Safe for asphalt shingle, composite and low-slope commercial roofing",
      "Biodegradable cleaners rinsed clean; landscaping and gutters protected before we start",
      "Recurring plans that stay ahead of Portland's year-round regrowth",
    ],
    faqs: [
      {
        q: "Will soft washing damage my shingles?",
        a: "No — that's the whole point of soft washing. We use low pressure and biodegradable cleaners, so nothing gets cracked or knocked loose and the protective granules stay on the shingle. High pressure is what damages roofs; we never use it up top.",
      },
      {
        q: "How long until the moss comes back?",
        a: "In our climate, expect some regrowth over time — that's why we offer recurring soft-wash plans. A single treatment kills what's there now; a seasonal or annual schedule keeps the roof ahead of Portland's near-constant moisture.",
      },
      {
        q: "Do you soft wash commercial and multi-unit roofs too?",
        a: "Yes. Low-slope commercial roofing, HOA rooflines and multi-building complexes get the same method-matched soft wash — we just scope the access and scheduling around your property.",
      },
    ],
  },

  flatwork: {
    slug: "concrete-surface-cleaning",
    h1: "Concrete & flatwork surface cleaning",
    intro:
      "A wand alone leaves zebra stripes on flat concrete. We run a commercial 28-inch surface cleaner — a spinning-bar head that lays down even, overlapping passes for a uniform finish with no wand marks. Driveways, walkways, patios, pool decks and parking lots all come back to an even tone instead of a patchwork.",
    whenYouNeedIt:
      "Gray-black grime, moss in the control joints, tire marks or oil shadows on a driveway or lot. Flat concrete collects everything Portland's rain washes down onto it, and a surface clean resets it in a single even pass.",
    bullets: [
      "Commercial 28-inch surface cleaner for a uniform, stripe-free finish",
      "Even overlapping passes on driveways, walkways, patios, pool decks and lots",
      "Oil, moss and algae treated at the source, not just blasted off the top layer",
      "Recurring maintenance keeps high-traffic lots and entries presentable year-round",
    ],
    faqs: [
      {
        q: "Why not just use a regular pressure-washer wand?",
        a: "A wand leaves visible stripes and takes far longer. The surface cleaner runs even, overlapping passes for a consistent tone edge to edge — the difference between a driveway that's been cleaned and one that looks new.",
      },
      {
        q: "Can you get oil stains and tire marks out?",
        a: "We treat them at the source and pull out most of what's there. Deeply set petroleum staining in porous concrete doesn't always lift 100%, and we'll tell you straight during the walk-through what to expect — no overpromising.",
      },
      {
        q: "Do you clean parking lots for businesses?",
        a: "Yes — parking lots, entries, sidewalks and loading areas for commercial and HOA properties, scheduled around your hours so we stay out of the way.",
      },
    ],
  },

  grease: {
    slug: "hot-water-degreasing",
    h1: "Hot-water degreasing",
    intro:
      "Cold water pushes grease around; it doesn't remove it. We bring 200°F+ hot-water systems that emulsify petroleum grease, food oil and biological buildup so it actually lifts off the surface. Trash pads, drive-throughs, loading docks and kitchen exhaust areas are built for this method.",
    whenYouNeedIt:
      "A trash enclosure that smells, a drive-through lane gone black and slick, or a dumpster pad the health inspector keeps flagging. Grease and food oil bond to concrete in a way cold water can't break — hot water is the only method that resets it.",
    bullets: [
      "200°F+ hot water emulsifies petroleum grease and food oil cold water can't touch",
      "Built for trash pads, drive-throughs, loading docks and kitchen exhaust areas",
      "Cuts the odor and the slip hazard, not just the visible film",
      "Recurring schedules keep pads inspection-ready between deep cleans",
    ],
    faqs: [
      {
        q: "Why does hot water matter for grease?",
        a: "Heat breaks the bond between petroleum or food grease and the concrete so it can be rinsed away. Cold water just spreads it around. For any greasy surface we bring hot water — that's what actually degreases.",
      },
      {
        q: "Can you clean around an open restaurant or drive-through?",
        a: "Yes. We schedule around your slow hours or overnight, contain the runoff responsibly and get the lane back in service quickly.",
      },
      {
        q: "Will it get rid of the smell too?",
        a: "Cutting the grease is what cuts the odor. Emulsifying and rinsing the built-up oil removes the source that air fresheners are only masking.",
      },
    ],
  },

  glass: {
    slug: "pure-water-window-cleaning",
    h1: "Pure-water window cleaning",
    intro:
      "Tap water leaves spots because of the minerals dissolved in it. We push water through reverse-osmosis filtration first, stripping those minerals out, then clean with a water-fed pole. The glass dries on its own to a spotless, streak-free finish — no soaps, no squeegee marks, and safe reach on upper storeys from the ground.",
    whenYouNeedIt:
      "Storefront glass gone hazy, water-spotted panes after the rain, or upper windows no ladder can safely reach. Pure-water cleaning is the streak-free method for homes and commercial glass alike.",
    bullets: [
      "Reverse-osmosis water dries spotless — no soap, no squeegee marks",
      "Water-fed poles reach upper storeys safely from the ground",
      "Storefronts, glass facades and residential windows alike",
      "Recurring plans keep commercial glass consistently clear",
    ],
    faqs: [
      {
        q: "How is this streak-free without soap?",
        a: "The streaks and spots come from minerals in ordinary water. We filter those out with reverse osmosis, so once the pure water dries there's nothing left behind to streak — the glass dries clear on its own.",
      },
      {
        q: "Can you reach high storefront or second-storey glass?",
        a: "Yes — water-fed poles let us clean several storeys up from the ground, which is both safer and faster than ladders for tall glass.",
      },
      {
        q: "Do you do interior glass too?",
        a: "Our pure-water system is built for exterior glass. We'll walk your property and tell you exactly what's in scope before we start.",
      },
    ],
  },

  masonry: {
    slug: "brick-masonry-washing",
    h1: "Brick & masonry washing",
    intro:
      "Hard masonry doesn't need chemistry to come clean — it needs volume. We use high-flow cold water to strip general dirt, mud, pollen and construction dust off brick, block and concrete without soaps. It's the right match for routine maintenance and post-construction cleanup on durable surfaces.",
    whenYouNeedIt:
      "A brick facade dulled by pollen and road film, block walls streaked with dirt, or fresh masonry that needs the construction dust rinsed off. When the surface is hard and the mess is general grime, high-volume cold water is the efficient, chemical-free match.",
    bullets: [
      "High-volume cold-water flow strips dirt, mud and pollen from hard masonry",
      "No chemicals where the surface doesn't call for them",
      "Brick, block and concrete — routine upkeep and construction cleanup",
      "Delicate or stained masonry gets reassessed for a gentler matched method",
    ],
    faqs: [
      {
        q: "Do you use chemicals on brick?",
        a: "Only when the surface calls for it. General dirt and pollen on hard masonry comes off with high-volume water alone; for organic staining or delicate historic masonry we reassess and match a gentler method during the walk-through.",
      },
      {
        q: "Is pressure washing safe for brick and mortar?",
        a: "On sound masonry, yes — we match the pressure to the surface and keep it off failing mortar joints. If we spot loose or aging mortar during the audit, we adjust the method rather than force it.",
      },
      {
        q: "Can you clean up after construction?",
        a: "Yes — rinsing construction dust, mud and splatter off new brick and concrete is one of the main jobs this method is built for.",
      },
    ],
  },

  facade: {
    slug: "building-facade-washing",
    h1: "Building facade washing",
    intro:
      "Multi-storey exteriors combine two problems: delicate, varied cladding and height you can't reach from a ladder. We solve both with boom-lift access and soft-wash chemistry — bringing the right cleaners safely to every floor and reading each surface as we go, from EIFS and stucco to metal panel and glass.",
    whenYouNeedIt:
      "Streaked upper storeys, algae creeping up a north wall, or a building exterior that hasn't been touched since it was built. When the work is above ladder height and the cladding is mixed, high-reach soft wash is the safe, method-matched answer.",
    bullets: [
      "Boom-lift access brings the right method safely to every storey",
      "Soft-wash chemistry matched to mixed cladding — EIFS, stucco, metal, glass",
      "Multi-story offices, retail, industrial and HOA/multi-unit buildings",
      "Recurring exterior programs keep large facades consistently clean",
    ],
    faqs: [
      {
        q: "How do you reach the upper floors safely?",
        a: "Boom-lift access, not ladders — it's safer for the crew and lets us apply an even, controlled soft wash across the whole facade instead of missing spots between ladder sets.",
      },
      {
        q: "Is soft washing safe for stucco, EIFS and painted panels?",
        a: "Yes — that's exactly why we soft wash facades. Low pressure plus matched chemistry lifts algae and grime without forcing water behind the cladding or stripping finishes.",
      },
      {
        q: "Do you handle large multi-building or HOA properties?",
        a: "Yes. Multi-building complexes, HOA communities and larger commercial sites are core work for us across the Portland metro and Willamette Valley — we scope access and scheduling to fit the property.",
      },
    ],
  },
};

/** The six services, built by merging each method with its page copy. Order
 *  follows methods.ts so it matches the homepage. */
export const SERVICES: Service[] = METHODS.map((m) => ({
  ...m,
  ...EXTRA[m.key],
}));

/** Slugs for generateStaticParams. */
export const SERVICE_SLUGS: string[] = SERVICES.map((s) => s.slug);

/** Lookup by slug; undefined → the route should notFound(). */
export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
