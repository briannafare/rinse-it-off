/** The six methods — RIO's method-matching system. Every line here is true to the
 *  training material (Module 1/3 infographic): surface → matched method + real spec.
 *  Consumed by the Methods services section. No guarantees/outcomes we don't control. */
export type Method = {
  key: string;
  surface: string; // the surface the customer recognizes
  method: string; // the matched method
  what: string; // fuller copy for the services card
  img: string;
  alt: string; // what the photo literally shows (screen-reader)
};

export const METHODS: Method[] = [
  {
    key: "roof",
    surface: "Roofs & shingles",
    method: "Soft wash",
    what:
      "Low-pressure application lifts moss, algae and mildew at the root — without the high pressure that strips the protective granules off your shingles.",
    img: "/brand/photos/roof-softwash.webp",
    alt: "A technician on a moss-covered shingle roof applying white soft-wash foam",
  },
  {
    key: "flatwork",
    surface: "Concrete & parking lots",
    method: "Surface cleaning",
    what:
      "A commercial 28-inch surface cleaner runs even, overlapping passes for a uniform, stripe-free finish on lots, driveways, walkways and patios.",
    img: "/brand/photos/surface-cleaning.webp",
    alt: "Overhead view of a technician running a surface cleaner across a parking lot, cutting a clean arc",
  },
  {
    key: "grease",
    surface: "Trash pads & drive-thrus",
    method: "Hot-water degrease",
    what:
      "200°F+ heat emulsifies petroleum grease and oil the way cold water can't — built for trash pads, drive-throughs and loading docks.",
    img: "/brand/photos/hotwater-degrease.webp",
    alt: "A technician hot-water washing a greasy commercial trash pad, steam rising",
  },
  {
    key: "glass",
    surface: "Glass & storefronts",
    method: "Pure-water windows",
    what:
      "Reverse-osmosis water dries to a spotless, streak-free finish with no soaps or squeegee marks — windows, glass facades and storefronts.",
    img: "/brand/photos/window-purewater.webp",
    alt: "A technician cleaning a tall glass storefront with a water-fed pole, reflected in the pane",
  },
  {
    key: "masonry",
    surface: "Brick & masonry",
    method: "Cold-water wash",
    what:
      "High-volume flow strips general dirt, mud and pollen from hard masonry and concrete without chemicals — routine maintenance and construction cleanup.",
    img: "/brand/photos/masonry-coldwater.webp",
    alt: "A technician rinsing dirt off a red-brick wall with a wide fan of water",
  },
  {
    key: "facade",
    surface: "Building facades",
    method: "High-reach soft wash",
    what:
      "Boom-lift access and soft-wash chemistry bring multi-story building exteriors back to clean — safely, and from the ground up.",
    img: "/brand/photos/building-wash.webp",
    alt: "A technician in a raised boom-lift basket soft-washing a multi-story building facade",
  },
];
