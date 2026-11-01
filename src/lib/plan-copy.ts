/** Yearly-plan copy shown on the home page (PlanSection) and reused in the
 *  AI-readable markdown versions. Plain module so server code can import it;
 *  PlanSection is a client component and its own exports are not readable there.
 *
 *  Rewritten 2026-10-19 (Bri: "it needs to sell! list the services, make it compelling,
 *  show what's included"). Every number is the shipped calculator's own (src/app/plan/pricing.ts):
 *  standalone minimums for a one-story house (roof 500 + house wash 480 + driveway 500 +
 *  gutters 500 + winter 300 + windows 4 x 500) = 4,280 a year; $189 floor; members pay
 *  40 to 60% less across 4,050 test homes; add-ons x 0.90 for members. */
export const PLAN_LABEL = "The yearly home plan · from $189 a month";

export const PLAN_HEADLINE = "We clean the outside of your house every season, so the moss never gets a head start.";

export const PLAN_BODY =
  "Moss on the roof, green film on the siding, black streaks on the driveway. Around here it all grows back. The plan puts us on your calendar every season, and we text you before each visit.";

export const PLAN_NOTE = "Four stories or a steep lot? You'll still get a price range right away, and a real person confirms the exact number.";

export const PLAN_SEASONS = [
  {
    name: "Spring",
    title: "Roof and siding",
    img: "/brand/retro/season-spring.webp",
    work: "A low-pressure soft wash kills the roof moss at the root. Then the green film comes off the siding.",
  },
  {
    name: "Summer",
    title: "Driveway, walkways and patio",
    img: "/brand/retro/season-summer.webp",
    work: "Hot water and a spinning surface cleaner lift the algae, the grime and that dark spot where the car parks.",
  },
  {
    name: "Fall",
    title: "Gutters",
    img: "/brand/retro/season-fall.webp",
    work: "Once the leaves are down, we clear the gutters and flush the downspouts.",
  },
  {
    name: "Winter",
    title: "Steps and entries",
    img: "/brand/retro/season-winter.webp",
    work: "We rinse the steps, entries, walkways and patio, the places that turn green and slick in the rain.",
  },
];

export const PLAN_EVERY_VISIT =
  "Free window cleaning. Outside windows at every visit, with pure water so the glass dries without spots. On their own, window cleanings start at $500. On the plan they add nothing to your price.";

export const PLAN_INCLUDED = [
  "Before-and-after photos of every visit",
  "Our 48-hour re-rinse guarantee: anything that isn't right gets redone free",
  "Ten percent off add-ons like decks, fences, solar panels and garage floors",
];

export const PLAN_VALUE =
  "Booked one at a time, these visits cost even a small one-story house at least $4,300 a year. On the plan, an easy single-story home up to 1,500 sq ft pays $189 a month, about $2,270 a year. It's a 12-month membership, billed monthly.";

export const PLAN_CTA_NOTE = "It takes about a minute, and you see the number before we ask for your name or phone number.";

/** /plan meta description; also the plan summary in llms.txt. */
export const PLAN_META_DESCRIPTION =
  "See the monthly price for a year of exterior care on your Portland-area house: roof, siding, driveway, gutters, winter walkways, and windows four times.";
