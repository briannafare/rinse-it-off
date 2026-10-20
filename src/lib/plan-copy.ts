/** Yearly-plan copy shown on the home page (PlanSection) and reused in the
 *  AI-readable markdown versions. Plain module so server code can import it;
 *  PlanSection is a client component and its own exports are not readable there.
 *  The paragraph is Bri's approved plan copy, word for word. */
export const PLAN_HEADLINE = "One plan for the outside of your house, from $189 a month.";

export const PLAN_BODY =
  "Our yearly home plan keeps the outside of your house clean every season. You don't have to remember to book anything, and nobody has to bring up the green on the siding at Thanksgiving. Free window cleaning four times a year comes with it.";

export const PLAN_NOTE = "Three stories or a steep lot? We price those by hand.";

export const PLAN_SEASONS = [
  { name: "Spring", work: "Roof moss treatment and soft wash, siding house wash" },
  { name: "Summer", work: "Driveway and walkways, algae treatment" },
  { name: "Fall", work: "Gutters cleared and downspouts flushed once the leaves are down" },
  { name: "Winter", work: "Steps, entries, walkways and patios" },
];

export const PLAN_EVERY_VISIT = "The outside of every window, free";
