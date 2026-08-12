import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/lib/services";
import { AREAS } from "@/lib/areas";

const BASE_URL = "https://rinseitoff.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Top-level routes.
  const pages = [
    { path: "/", priority: 1 },
    { path: "/assessment", priority: 0.9 },
    { path: "/quote", priority: 0.9 },
    { path: "/commercial", priority: 0.8 },
    { path: "/services", priority: 0.8 },
    { path: "/areas", priority: 0.7 },
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

  // NOTE: /flyer and /training are internal and intentionally excluded.
  return [...pages, ...servicePages, ...areaPages].map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}
