import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/lib/services";
import { AREAS } from "@/lib/areas";
import { client } from "@/sanity/lib/client";
import { sitemapQuery } from "@/sanity/lib/queries";

const BASE_URL = "https://rinseitoff.com";

// Re-read published blog slugs from Sanity every five minutes.
export const revalidate = 300;

type BlogEntry = { slug: string; date: string; updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Top-level routes. NOTE: /quote is the internal audit tool — intentionally
  // excluded (noindex + robots disallow), same as /flyer and /training.
  const pages = [
    { path: "/", priority: 1 },
    { path: "/assessment", priority: 0.9 },
    { path: "/commercial", priority: 0.8 },
    { path: "/services", priority: 0.8 },
    { path: "/areas", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
    { path: "/terms", priority: 0.3 },
  ];

  // The six method-matched services → /services/[slug].
  const servicePages = SERVICE_SLUGS.map((slug) => ({
    path: `/services/${slug}`,
    priority: 0.7,
  }));

  // Every service area → /areas/[slug].
  const areaPages = AREAS.map((a) => ({
    path: `/areas/${a.slug}`,
    priority: 0.6,
  }));

  // Published blog posts (noIndex ones are filtered out in the query). Fails
  // soft so a Sanity outage can never break the sitemap.
  let blogPosts: BlogEntry[] = [];
  try {
    blogPosts = await client.fetch<BlogEntry[]>(sitemapQuery, {}, { next: { revalidate: 300 } });
  } catch {
    blogPosts = [];
  }

  // NOTE: /flyer and /training are internal and intentionally excluded.
  const staticEntries: MetadataRoute.Sitemap = [...pages, ...servicePages, ...areaPages].map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/" || path === "/blog" ? "weekly" : "monthly",
    priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
