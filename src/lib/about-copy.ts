/** /about copy, shared by the page and its AI-readable markdown copy (ai-content.ts).
 *
 *  Drafted 2026-10-20 for the owners' review, from ~/brain/notes/brand-brain-rinse-it-off.md
 *  (facts) and the Rinse It Off style sheet (voice). Facts are locked to the brand brain:
 *  Fresh Rinse, LLC dba Rinse It Off; Tigard, Oregon, no storefront, no street address;
 *  Bri (founder) and Alstun (co-owner, field operations), first names only; the rig as
 *  listed there; ground-level work only (reach above that is unconfirmed); full liability
 *  insurance with the certificate sent the same day; the 48-hour re-rinse guarantee in the
 *  owners' own words. Not printed because the brand brain marks them unconfirmed: a
 *  founding year, ownership certifications, a CCB number, insurance limits. */

export const ABOUT_META_TITLE = "About Us: Exterior Cleaning in Tigard, OR";

export const ABOUT_META_DESCRIPTION =
  "Rinse It Off is Fresh Rinse, LLC, an exterior cleaning company in Tigard, Oregon, owned by Bri and Alstun. Insured, with a 48-hour re-rinse guarantee.";

export const ABOUT_H1 = "We're Bri and Alstun, the owners of Rinse It Off.";

export const ABOUT_INTRO = [
  "We clean the outside of homes and commercial buildings around Portland. That means roofs, siding, windows, gutters, driveways, parking lots, the pads where dumpsters sit, and most other outside surfaces that get dirty.",
  "Bri started the company and built the way it runs, including the yearly home plan and the online price. Alstun, the co-owner, runs the crew and the jobs in the field.",
];

export const ABOUT_WHERE_TITLE = "Where to find us";

export const ABOUT_WHERE = [
  "Fresh Rinse, LLC is the company's legal name, and Rinse It Off is the name we do business under. We're based in Tigard, Oregon, and we work across the Portland metro, including Beaverton, Hillsboro, Lake Oswego, West Linn, Tualatin, Milwaukie and Gresham, and down into the Willamette Valley.",
  "We don't have a storefront. The work happens at your place, so that's where you'll find us.",
];

export const ABOUT_RIG_TITLE = "What's on the truck";

export const ABOUT_RIG_INTRO = "Here's the equipment we bring to a job, and what each piece is for.";

export const ABOUT_RIG: { name: string; body: string }[] = [
  {
    name: "A hot-water pressure washer",
    body: "Ours is a Hydro Tek that puts out 3,500 PSI and 8 gallons a minute, at over 200 degrees. Heat is what lifts oil and grease off concrete, so we don't have to turn up the pressure to get it out.",
  },
  {
    name: "A soft-wash system",
    body: "It's a separate low-pressure setup for roofs and siding. It mixes the cleaning solution to the same strength every time and sprays it on gently, because high pressure would knock the grit off shingles and push water behind siding.",
  },
  {
    name: "Surface cleaners",
    body: "Ours are Whirl-A-Ways, which are round, covered spinning sprayers. They clean driveways, walkways and parking lots evenly, without the stripes a wand leaves.",
  },
  {
    name: "A pure-water window system",
    body: "It filters the minerals out of the water, so the glass dries without spots. We clean windows from the ground with a water-fed pole.",
  },
  {
    name: "A tank and a truck",
    body: "A 500-gallon water tank, and an F-550 flatbed that carries all of it.",
  },
];

export const ABOUT_REACH =
  "We work from the ground, which covers most one- and two-story houses and low buildings. If yours is taller, text a photo of it to (971) 626-4146 before you book.";

/** The owners' own line (brand brain, approved language). */
export const ABOUT_HONK = "Honk if you see us in the truck!";

export const ABOUT_RIG_PHOTO = {
  src: "/brand/photos/work/tech-cone.webp",
  w: 1200,
  h: 1600,
  alt: "A Rinse It Off technician washing a curb edge with hot water, steam rising, an orange traffic cone in front",
  caption: "Hot water on a curb edge, steaming in the rain.",
};

export const ABOUT_HERO_PHOTO = {
  src: "/brand/photos/work/surface-cleaner-steam.webp",
  w: 1600,
  h: 1200,
  alt: "A Rinse It Off technician guiding a surface cleaner through a cloud of steam on a wet walkway",
};

export const ABOUT_PROMISES_TITLE = "What comes with the work";

export const ABOUT_PROMISES: { title: string; body: string; link?: { href: string; label: string } }[] = [
  {
    title: "Photos of the work",
    body: "Every visit comes with before-and-after photos, so you can see the work even if you weren't home.",
  },
  {
    title: "The 48-hour re-rinse guarantee",
    body: "Tell us within 24 hours of your service and we'll re-rinse it free within 48.",
    link: { href: "/terms", label: "The details are on the terms page" },
  },
  {
    title: "Insurance",
    body: "We carry full liability insurance. If your property manager or HOA needs the certificate, ask and we'll send it the same day.",
  },
];

export const ABOUT_PRICE_TITLE = "Two ways to get a price";

export const ABOUT_PRICE_HOME = {
  title: "For a house",
  body: "Our yearly home plan is priced online for your house, from $189 a month. It takes about a minute, and you see the number before we ask for your name or phone number.",
  cta: "See my price",
  href: "/plan?src=about",
};

export const ABOUT_PRICE_OTHER = {
  title: "For everything else",
  body: "Businesses, HOAs, apartment buildings and any job that needs a look in person start with a free walkthrough. We see the property and give you a price for the work. For a commercial property, that's our free 21-point inspection, and the photo report is yours to keep.",
  cta: "Book a free walkthrough",
  href: "/assessment",
};
