export function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const BASE_URL = "https://rinseitoff.com";

/** A post's picture: its Sanity photo, or else one of the site's own 1960s illustrations picked by
 *  topic, so no card or post goes out as a bare text box. */
const ILLO: [RegExp, string, string][] = [
  [/roof|moss-removal/, "mi-roof", "Illustration: a cleaner soft-washing moss off the roof of a mid-century ranch house"],
  [/concrete|driveway|walkway|sidewalk|patio/, "mi-flatwork", "Illustration: a cleaner running a surface cleaner down a driveway, a bright clean stripe behind her"],
  [/window|glass/, "mi-glass", "Illustration: a cleaner washing a tall picture window from the ground with a water-fed pole"],
  [/dumpster|grease|restaurant/, "mi-grease", "Illustration: a cleaner hot-water washing a dumpster pad, steam rising"],
  [/brick|masonry/, "mi-masonry", "Illustration: a cleaner rinsing a brick wall at low pressure"],
  [/commercial|storefront|hoa/, "i-biz-wide", "Illustration: a crew cleaning a mid-century storefront's walk and glass"],
  [/soft-wash|siding|how-often/, "mi-siding", "Illustration: a cleaner soft-washing the wood siding of a mid-century house"],
];
export function postPicture<T extends { asset?: unknown; alt?: string }>(
  post: { slug?: string; heroImage?: T },
  sanityUrl: (img: T) => string,
): { src: string; alt: string } {
  if (post.heroImage?.asset) return { src: sanityUrl(post.heroImage), alt: post.heroImage.alt || "" };
  const hit = ILLO.find(([re]) => re.test(post.slug || ""));
  const [, file, alt] = hit || [null, "i-home-wide", "Illustration: a cleaner washing a mid-century house's high windows while the owners watch"];
  return { src: `/brand/retro/${file}.webp`, alt };
}
