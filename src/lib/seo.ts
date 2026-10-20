import type { Metadata } from "next";

/** One place for every page's search and share tags. Each page passes its own
 *  title, description and path; this fills the canonical, Open Graph and
 *  Twitter tags so no page inherits the home page's URL or loses its image.
 *  (Next.js replaces a parent's openGraph object instead of merging it, which
 *  is how /commercial and others ended up pointing og:url at the home page.) */

export const SITE_URL = "https://rinseitoff.com";
export const SITE_NAME = "Rinse It Off";
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Share images, 1200x630, made from the site's own photos and illustrations
 *  by scripts/make-og-images.py. */
export const OG = {
  home: { url: "/og/home.jpg", alt: "Rinse It Off cleaners washing the windows of a Portland house with a water-fed pole" },
  commercial: { url: "/og/commercial.jpg", alt: "Two Rinse It Off cleaners at a mid-century office, washing the tall glass and the entry walk" },
  services: { url: "/og/services.jpg", alt: "A flat 1960s-style illustration of a cleaner soft-washing the wood siding of a mid-century house" },
  areas: { url: "/og/areas.jpg", alt: "Two Rinse It Off cleaners surface-cleaning a driveway on a neighborhood street" },
  plan: { url: "/og/plan.jpg", alt: "A flat 1960s-style illustration of a cleaner washing a house's picture window while the owners watch" },
  blog: { url: "/og/blog.jpg", alt: "A Rinse It Off cleaner running a surface cleaner along a shopping-center walkway, the service truck at the curb" },
} as const;

export type OgImage = { url: string; alt: string };

type PageMetaInput = {
  /** Page part of the title; the layout template adds " | Rinse It Off". */
  title: string;
  /** Set when the title is written whole (home page, brand-first titles). */
  absoluteTitle?: boolean;
  /** Longer title for social cards; defaults to the page title plus the brand. */
  shareTitle?: string;
  description: string;
  /** Path from the site root, no trailing slash ("/" for the home page). */
  path: string;
  image?: OgImage;
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export function pageMeta({
  title,
  absoluteTitle,
  shareTitle,
  description,
  path,
  image = OG.home,
  type = "website",
  noindex,
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const social = shareTitle ?? (absoluteTitle ? title : `${title} | ${SITE_NAME}`);
  const images = [{ url: image.url, width: 1200, height: 630, alt: image.alt }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      url,
      title: social,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
      images,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: social, description, images: [image.url] },
  };
}

/** BreadcrumbList for a nested page. Pass the trail after Home. */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.path === "/" ? SITE_URL : `${SITE_URL}${c.path}`,
    })),
  };
}
