/** The six methods — RIO's method-matching system. Every line here is true to the
 *  training material (Module 1/3 infographic): surface → matched method + real spec.
 *  Consumed by the Methods services section. No guarantees/outcomes we don't control.
 *
 *  Surfaces are named so a homeowner and a property manager both find themselves in
 *  the list — three lead residential, three lead commercial, and the method is the
 *  same craft either way. Do not let this drift back to a commercial-only list.
 *
 *  Equipment claims: only gear RIO actually owns. The old "facade" entry promised
 *  boom-lift access, which they do not have — replaced with the house-wash method
 *  they really run from the ground. */
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
    key: "flatwork",
    surface: "Driveways, patios & walkways",
    method: "Surface cleaning",
    what:
      "A 28-inch surface cleaner runs even, overlapping passes, so concrete comes back uniform instead of striped with wand marks. The same machine does a driveway and a parking lot.",
    img: "/brand/photos/walkway-split.webp",
    alt: "A walkway mid-clean, the finished half bright against the dark, dirty half",
  },
  {
    key: "siding",
    surface: "Siding & exterior walls",
    method: "House wash (soft wash)",
    what:
      "Low pressure and the right cleaning solution do the work, so we can lift green film and grime off lap siding, stucco and painted trim without driving water behind the boards.",
    img: "/brand/photos/house-softwash.webp",
    alt: "A technician soft-washing the siding of a Pacific Northwest home from the ground",
  },
  {
    key: "roof",
    surface: "Roofs & gutters",
    method: "Soft wash",
    what:
      "Moss and algae get treated at the root at low pressure. High pressure would strip the protective granules off your shingles, which is the expensive kind of clean.",
    img: "/brand/photos/roof-softwash.webp",
    alt: "A moss-covered shingle roof being treated with low-pressure soft wash",
  },
  {
    key: "glass",
    surface: "Windows & glass",
    method: "Pure-water rinse",
    what:
      "Reverse-osmosis water dries without spots, so there are no soap films and no squeegee lines. It works the same on a living room window and a storefront.",
    img: "/brand/photos/window-purewater.webp",
    alt: "A technician cleaning glass with a water-fed pole",
  },
  {
    key: "grease",
    surface: "Trash pads & drive-thrus",
    method: "Hot-water degrease",
    what:
      "Petroleum grease doesn't move for cold water. Heat above 200°F emulsifies it, which is why trash enclosures, drive-throughs and loading docks get the hot-water rig.",
    img: "/brand/photos/hotwater-degrease.webp",
    alt: "A technician hot-water washing a greasy commercial trash pad, steam rising",
  },
  {
    key: "masonry",
    surface: "Brick, block & masonry",
    method: "Cold-water wash",
    what:
      "Hard masonry can take volume instead of chemistry. High flow carries off dirt, mud and pollen, which covers routine maintenance and construction cleanup both.",
    img: "/brand/photos/masonry-coldwater.webp",
    alt: "A technician rinsing dirt off a brick wall with a wide fan of water",
  },
];
