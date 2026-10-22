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
  "Moss on the roof, green film on the siding, black streaks on the driveway. Around here all of it grows back, and it grows back faster on the side that doesn't get sun. The plan puts us on your calendar every season, so the cleaning happens before anyone brings it up at Thanksgiving. You don't have to book anything. We schedule each visit and text you before we come.";

export const PLAN_NOTE = "Four stories or a steep lot? You'll still get a price range right away, and a real person confirms the exact number.";

export const PLAN_SEASONS = [
  {
    name: "Spring",
    title: "Roof and siding",
    img: "/brand/retro/season-spring.webp",
    work: "We treat the moss on your roof with a low-pressure soft wash that kills it at the root, so it isn't blasted around and the shingles keep their grit. Then we wash the green film off the siding.",
  },
  {
    name: "Summer",
    title: "Driveway, walkways and patio",
    img: "/brand/retro/season-summer.webp",
    work: "Hot water and a big round surface cleaner, which spins across the concrete like a floor scrubber, lift the black algae, the grime and that dark spot where the car parks.",
  },
  {
    name: "Fall",
    title: "Gutters",
    img: "/brand/retro/season-fall.webp",
    work: "We wait until the leaves are down, then clear the gutters and flush the downspouts, so one cleaning lasts the whole winter.",
  },
  {
    name: "Winter",
    title: "Steps and entries",
    img: "/brand/retro/season-winter.webp",
    work: "We rinse the steps, entries, walkways and patio, the places that turn green and slick in the rain.",
  },
];

export const PLAN_EVERY_VISIT =
  "Free window cleaning. We clean the outside of every window with pure water on a water-fed pole, so the glass dries without spots. A window cleaning on its own starts at $500, so four a year would cost at least $2,000. On the plan they don't add anything to your price.";

export const PLAN_INCLUDED = [
  "Before-and-after photos of every visit",
  "Our 48-hour re-rinse guarantee: anything that isn't right gets redone free",
  "Ten percent off add-ons like decks, fences, solar panels and garage floors",
];

export const PLAN_VALUE =
  "If you booked these visits one at a time, even a small one-story house would pay at least $4,300 a year. On the plan, a basic three-bedroom home pays $189 a month, about $2,270 a year. Bigger homes cost more, and the online price shows yours. It's a 12-month membership, billed monthly.";

export const PLAN_CTA_NOTE = "It takes about a minute, and you see the number before we ask for your name or phone number.";

/** /plan meta description; also the plan summary in llms.txt. */
export const PLAN_META_DESCRIPTION =
  "See the monthly price for a year of exterior care on your Portland-area house: roof, siding, driveway, gutters, winter walkways, and windows four times.";
