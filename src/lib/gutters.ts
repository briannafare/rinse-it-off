/** /services/gutter-cleaning copy, shared by the page and its AI-readable markdown copy.
 *
 *  Gutters are a service, not one of the six cleaning methods, so this page is its own
 *  route (src/app/services/gutter-cleaning) and stays out of METHODS / SERVICES. That keeps
 *  the home page's "How We Clean" grid, the /services "Six methods" index and every
 *  method page's "other methods" row at six.
 *
 *  Locked facts (brand brain, Bri 2026-09-26): cleaned once the leaves are down, in
 *  November or December; a second cleaning is an optional add-on on the date they choose (we suggest January or February).
 *  Never "twice every fall", never October timing, never lifts or high reach. Gutters are
 *  the fall visit of the yearly plan (plan-copy.ts). The opening is Sample A on the
 *  Rinse It Off style sheet, approved by Bri 2026-10-08. */
import type { FAQItem } from "@/lib/faqs";

export const GUTTER_SLUG = "gutter-cleaning";
export const GUTTER_PATH = `/services/${GUTTER_SLUG}`;

export const GUTTER_META_TITLE = "Gutter Cleaning in Portland, OR";

export const GUTTER_META_DESCRIPTION =
  "Gutter cleaning for Portland-area homes, done once the leaves are down in November or December. Part of the yearly plan, with an optional second cleaning.";

export const GUTTER_H1 = "Gutter cleaning";

export const GUTTER_LEAD = [
  "Every October you look up at the gutters from the driveway, decide they look fine from down there, and go inside.",
  "Good call. Clean them now and you'd be doing it again once the rest of the leaves come down.",
];

export const GUTTER_WHEN_TITLE = "When we clean them";

export const GUTTER_WHEN = [
  "We do gutters once the leaves are down, in November or December, so one cleaning does it. You can add a second cleaning whenever you want one. We suggest January or February, after the late trees finish dropping.",
  "We scoop out the leaves and needles and flush the downspouts, so the rain has somewhere to go all winter.",
  "The black streaks down the outside of a gutter are a separate job called gutter whitening. You can add it when you get your price.",
];

export const GUTTER_PLAN_TITLE = "Gutters come with the yearly plan";

export const GUTTER_PLAN = [
  "Gutters are the fall visit on our yearly home plan. In spring we clean the roof and siding. In summer we do the driveway, walkways and patio, and in winter we rinse the steps and entries. The windows get cleaned free at every visit, four times a year.",
  "The plan starts from $189 a month and is priced for your house. You can see yours online in about a minute, before we ask for your name or number.",
];

export const GUTTER_OTHER_TITLE = "Gutters on their own";

export const GUTTER_OTHER =
  "If you only want the gutters cleaned, or the gutters are on an apartment building, an office or an HOA's buildings, start with a free walkthrough. We look at the property and give you a price for the work.";

export const GUTTER_FAQS: FAQItem[] = [
  {
    q: "When should gutters be cleaned in the Portland area?",
    a: "Once the leaves are down, which is usually November or December. Gutters cleaned in October tend to fill up again when the last leaves fall. If your trees drop late, a second cleaning catches the rest. You pick the date; we suggest January or February.",
  },
  {
    q: "Do I need the yearly plan to get my gutters cleaned?",
    a: "No. Gutters are part of the plan's fall visit, but you can also hire us for a single gutter cleaning, like any other job. That starts with a free walkthrough, and we give you the price once we've seen the house.",
  },
  {
    q: "Do you clean the outside of the gutters too?",
    a: "That's gutter whitening, and it's an add-on. It takes off the black streaks that run down the front of the gutter.",
  },
];

export const GUTTER_IMG = {
  src: "/brand/retro/season-fall.webp",
  w: 900,
  h: 900,
  alt: "Illustration: a cleaner on a stepladder scooping fall leaves out of a house's gutter into a bucket",
};
