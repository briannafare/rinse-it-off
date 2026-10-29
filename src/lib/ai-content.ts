/** AI-readable versions of the site: /llms.txt, /llms-full.txt and a clean
 *  markdown copy of each key page at <url>.md.
 *
 *  Nothing here is typed out a second time. Every sentence comes from the same
 *  modules the pages render from (faqs, services, methods, areas, commercial,
 *  plan-copy) or from a page's exported metadata, so these files change when
 *  the site changes. The only literals are headings, link labels and the
 *  business contact line. */
import { FAQS } from "@/lib/faqs";
import { METHODS } from "@/lib/methods";
import { SERVICES, getService } from "@/lib/services";
import { CITIES, NEIGHBORHOODS } from "@/lib/areas";
import {
  AUDIENCES,
  AUDIT_LEAD,
  AUDIT_POINTS,
  COMMERCIAL_CTA_BODY,
  COMMERCIAL_META_DESCRIPTION,
  COMMERCIAL_METHOD_KEYS,
  TRUST,
} from "@/lib/commercial";
import { PLAN_BODY, PLAN_EVERY_VISIT, PLAN_HEADLINE, PLAN_META_DESCRIPTION, PLAN_NOTE, PLAN_SEASONS } from "@/lib/plan-copy";
import { SITE_DESCRIPTION } from "@/lib/site";
import {
  ABOUT_H1,
  ABOUT_HONK,
  ABOUT_INTRO,
  ABOUT_META_DESCRIPTION,
  ABOUT_PRICE_HOME,
  ABOUT_PRICE_OTHER,
  ABOUT_PRICE_TITLE,
  ABOUT_PROMISES,
  ABOUT_PROMISES_TITLE,
  ABOUT_REACH,
  ABOUT_RIG,
  ABOUT_RIG_INTRO,
  ABOUT_RIG_TITLE,
  ABOUT_WHERE,
  ABOUT_WHERE_TITLE,
} from "@/lib/about-copy";
import {
  GUTTER_FAQS,
  GUTTER_H1,
  GUTTER_LEAD,
  GUTTER_META_DESCRIPTION,
  GUTTER_OTHER,
  GUTTER_OTHER_TITLE,
  GUTTER_PATH,
  GUTTER_PLAN,
  GUTTER_PLAN_TITLE,
  GUTTER_WHEN,
  GUTTER_WHEN_TITLE,
} from "@/lib/gutters";
import { MONTHLY_FLOOR } from "@/app/plan/pricing";
import { AI_PAGES, isPublishable } from "@/lib/ai-pages";
import { metadata as servicesMetadata } from "@/app/services/page";
import { metadata as areasMetadata } from "@/app/areas/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as assessmentMetadata } from "@/app/assessment/layout";
import { metadata as blogMetadata } from "@/app/blog/page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery } from "@/sanity/lib/queries";
import type { PostCard } from "@/sanity/lib/types";

export const SITE_URL = "https://rinseitoff.com";
export const BUSINESS_NAME = "Rinse It Off";
// Same value the pages and the layout schema use today. The canonical number is
// still being chosen; when it is, this is one of the places that changes.
const PHONE_DISPLAY = "(971) 626-4146";
const EMAIL = "hello@rinseitoff.com";

const desc = (m: { description?: unknown }) => (typeof m.description === "string" ? m.description : "");

export type MdPage = {
  /** URL path of the page, e.g. "/services/roof-soft-wash"; "/" for home. */
  path: string;
  /** Path of the markdown copy. */
  mdPath: string;
  title: string;
  summary: string;
  section: "Main" | "Services" | "Service areas" | "Plan and booking" | "Guides and answers" | "Blog";
  body: () => string;
};

const mdPathFor = (path: string) => (path === "/" ? "/index.md" : `${path}.md`);

const contactBlock = () =>
  `## Contact\n\n- Phone: ${PHONE_DISPLAY}\n- Email: ${EMAIL}\n- Website: ${SITE_URL}`;

function homeMd(): string {
  const lines: string[] = [
    `# ${BUSINESS_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `## ${PLAN_HEADLINE}`,
    "",
    PLAN_BODY,
    "",
    ...PLAN_SEASONS.map((s) => `- ${s.name}, ${s.title.toLowerCase()}: ${s.work}`),
    `- Every visit: ${PLAN_EVERY_VISIT}`,
    "",
    PLAN_NOTE,
    "",
    "## The right method for every surface",
    "",
    ...METHODS.map((m) => `- ${m.surface} (${m.method}): ${m.what}`),
    "",
    "## Free 21-point walkthrough",
    "",
    AUDIT_LEAD,
    "",
    "## Frequently asked questions",
    "",
    ...FAQS.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    contactBlock(),
  ];
  return lines.join("\n");
}

function commercialMd(): string {
  const methods = COMMERCIAL_METHOD_KEYS.map((k) => METHODS.find((m) => m.key === k)).filter(
    (m): m is (typeof METHODS)[number] => m !== undefined,
  );
  return [
    "# Commercial and property manager exterior cleaning",
    "",
    `> ${COMMERCIAL_META_DESCRIPTION}`,
    "",
    "## The free 21-point walkthrough",
    "",
    AUDIT_LEAD,
    "",
    ...AUDIT_POINTS.map((p) => `- ${p}`),
    "",
    "## The right method for every commercial surface",
    "",
    ...methods.map((m) => `- ${m.surface} (${m.method}): ${m.what}`),
    "",
    "## Who we work with",
    "",
    ...AUDIENCES.map((a) => `- ${a.title}: ${a.body}`),
    "",
    "## What you can count on",
    "",
    ...TRUST.map((t) => `- ${t.title}: ${t.body}`),
    "",
    "## Start with the walk-through",
    "",
    COMMERCIAL_CTA_BODY,
    "",
    contactBlock(),
  ].join("\n");
}

function servicesIndexMd(): string {
  return [
    "# Our services",
    "",
    `> ${desc(servicesMetadata)}`,
    "",
    ...SERVICES.map((s) => `- [${s.h1}](${SITE_URL}${mdPathFor(`/services/${s.slug}`)}): ${s.surface}. ${s.what}`),
    "",
    contactBlock(),
  ].join("\n");
}

function serviceMd(slug: string): string {
  const s = getService(slug);
  if (!s) return "";
  return [
    `# ${s.h1}`,
    "",
    `> ${s.surface}, cleaned with ${s.method.toLowerCase()}. ${s.what}`,
    "",
    s.intro,
    "",
    "## When you need it",
    "",
    s.whenYouNeedIt,
    "",
    "## What is included",
    "",
    ...s.bullets.map((b) => `- ${b}`),
    "",
    "## Questions",
    "",
    ...s.faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    contactBlock(),
  ].join("\n");
}

function gutterMd(): string {
  return [
    `# ${GUTTER_H1}`,
    "",
    `> ${GUTTER_META_DESCRIPTION}`,
    "",
    ...GUTTER_LEAD.flatMap((p) => [p, ""]),
    `## ${GUTTER_WHEN_TITLE}`,
    "",
    ...GUTTER_WHEN.flatMap((p) => [p, ""]),
    `## ${GUTTER_PLAN_TITLE}`,
    "",
    ...GUTTER_PLAN.flatMap((p) => [p, ""]),
    `Get the monthly price for a house: ${SITE_URL}/plan`,
    "",
    `## ${GUTTER_OTHER_TITLE}`,
    "",
    GUTTER_OTHER,
    "",
    `Book a free walkthrough: ${SITE_URL}/assessment`,
    "",
    "## Questions",
    "",
    ...GUTTER_FAQS.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    contactBlock(),
  ].join("\n");
}

function aboutMd(): string {
  return [
    "# About Rinse It Off",
    "",
    `> ${ABOUT_META_DESCRIPTION}`,
    "",
    `## ${ABOUT_H1}`,
    "",
    ...ABOUT_INTRO.flatMap((p) => [p, ""]),
    `## ${ABOUT_WHERE_TITLE}`,
    "",
    ...ABOUT_WHERE.flatMap((p) => [p, ""]),
    `## ${ABOUT_RIG_TITLE}`,
    "",
    ABOUT_RIG_INTRO,
    "",
    ...ABOUT_RIG.map((r) => `- ${r.name}: ${r.body}`),
    "",
    ABOUT_REACH,
    "",
    ABOUT_HONK,
    "",
    `## ${ABOUT_PROMISES_TITLE}`,
    "",
    ...ABOUT_PROMISES.map((p) => `- ${p.title}: ${p.body}${p.link ? ` Terms: ${SITE_URL}${p.link.href}` : ""}`),
    "",
    `## ${ABOUT_PRICE_TITLE}`,
    "",
    `- ${ABOUT_PRICE_HOME.title}: ${ABOUT_PRICE_HOME.body} ${SITE_URL}/plan`,
    `- ${ABOUT_PRICE_OTHER.title}: ${ABOUT_PRICE_OTHER.body} ${SITE_URL}${ABOUT_PRICE_OTHER.href}`,
    "",
    contactBlock(),
  ].join("\n");
}

function areasMd(): string {
  const link = (a: { slug: string; name: string }) => `- [${a.name}](${SITE_URL}/areas/${a.slug})`;
  return [
    "# Service areas",
    "",
    `> ${desc(areasMetadata)}`,
    "",
    "## Cities",
    "",
    ...CITIES.map(link),
    "",
    "## Portland neighborhoods",
    "",
    ...NEIGHBORHOODS.map(link),
    "",
    contactBlock(),
  ].join("\n");
}

function planMd(): string {
  return [
    "# The yearly plan",
    "",
    `> ${PLAN_META_DESCRIPTION}`,
    "",
    `## ${PLAN_HEADLINE}`,
    "",
    PLAN_BODY,
    "",
    ...PLAN_SEASONS.map((s) => `- ${s.name}: ${s.work}`),
    `- Every visit: ${PLAN_EVERY_VISIT}`,
    "",
    PLAN_NOTE,
    "",
    `Get the monthly price for a house: ${SITE_URL}/plan`,
    "",
    contactBlock(),
  ].join("\n");
}

function contactMd(): string {
  return ["# Contact", "", `> ${desc(contactMetadata)}`, "", contactBlock()].join("\n");
}

export const MD_PAGES: MdPage[] = [
  {
    path: "/",
    mdPath: "/index.md",
    title: "Home",
    summary: SITE_DESCRIPTION,
    section: "Main",
    body: homeMd,
  },
  {
    path: "/commercial",
    mdPath: "/commercial.md",
    title: "Commercial and property manager exterior cleaning",
    summary: COMMERCIAL_META_DESCRIPTION,
    section: "Main",
    body: commercialMd,
  },
  {
    path: "/about",
    mdPath: "/about.md",
    title: "About Rinse It Off",
    summary: ABOUT_META_DESCRIPTION,
    section: "Main",
    body: aboutMd,
  },
  {
    path: "/services",
    mdPath: "/services.md",
    title: "Our services",
    summary: desc(servicesMetadata),
    section: "Services",
    body: servicesIndexMd,
  },
  ...SERVICES.map<MdPage>((s) => ({
    path: `/services/${s.slug}`,
    mdPath: mdPathFor(`/services/${s.slug}`),
    title: s.h1,
    summary: `${s.surface}. ${s.what}`,
    section: "Services",
    body: () => serviceMd(s.slug),
  })),
  {
    path: GUTTER_PATH,
    mdPath: mdPathFor(GUTTER_PATH),
    title: GUTTER_H1,
    summary: GUTTER_META_DESCRIPTION,
    section: "Services",
    body: gutterMd,
  },
  {
    path: "/areas",
    mdPath: "/areas.md",
    title: "Service areas",
    summary: desc(areasMetadata),
    section: "Service areas",
    body: areasMd,
  },
  {
    path: "/plan",
    mdPath: "/plan.md",
    title: "The yearly plan for houses",
    summary: PLAN_META_DESCRIPTION,
    section: "Plan and booking",
    body: planMd,
  },
  {
    path: "/contact",
    mdPath: "/contact.md",
    title: "Contact",
    summary: desc(contactMetadata),
    section: "Plan and booking",
    body: contactMd,
  },
];

// The AI-search answer pages. Their markdown is the source copy, unchanged.
// Held out until every [CONFIRM] marker is cleared, same rule as the sitemap.
const AI_MD_PAGES: MdPage[] = AI_PAGES.filter(isPublishable).map((p) => ({
  path: p.path,
  mdPath: mdPathFor(p.path),
  title: p.title,
  summary: p.description,
  section: "Guides and answers",
  body: () => p.markdown.replace(/\]\(\//g, `](${SITE_URL}/`),
}));
MD_PAGES.push(...AI_MD_PAGES);

export function getMdPage(mdPath: string): MdPage | undefined {
  return MD_PAGES.find((p) => p.mdPath === mdPath);
}

async function getPosts(): Promise<PostCard[]> {
  return sanityFetch<PostCard[]>({ query: postsQuery, fallback: [] });
}

export async function buildLlmsTxt(): Promise<string> {
  const posts = await getPosts();
  const md = (p: MdPage) => `- [${p.title}](${SITE_URL}${p.mdPath}): ${p.summary}`;
  const bySection = (s: MdPage["section"]) => MD_PAGES.filter((p) => p.section === s).map(md);

  const out: string[] = [
    `# ${BUSINESS_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Key facts",
    "",
    "- Rinse It Off (legal name Fresh Rinse, LLC) cleans the outside of homes and commercial properties. Based in Tigard, Oregon; serves the Portland metro and the Willamette Valley. Not a storefront.",
    "- Owned by Bri (founder) and Alstun (co-owner, runs field operations).",
    `- Phone or text ${PHONE_DISPLAY}. Email ${EMAIL}.`,
    "- Work: roofs (moss and algae, by soft wash), siding and house washing, windows (water-fed pole with pure water, from the ground), gutters, driveways, walkways and patios, decks and fences, parking lots, trash pads, brick and masonry, holiday light installs, and most other outside surfaces.",
    `- Yearly home plan: four seasonal visits that keep the roof, siding, driveway, gutters and walkways clean, with window cleaning included free at every visit. From $${MONTHLY_FLOOR} a month, priced by the size of the house. Instant price online at ${SITE_URL}/plan in about a minute.`,
    `- Businesses, HOAs and multifamily: a free 21-point property inspection with a photo report and an itemized price the same day. Book at ${SITE_URL}/assessment.`,
    "- 48-hour re-rinse guarantee: anything a customer isn't happy with is redone free within 48 hours.",
    "- Fully insured for liability; a certificate goes out the same day it's asked for.",
    "- Holiday lights are priced by the foot after a visit to the house.",
    "",
    "Each page below has a plain markdown copy at the address shown. The same pages as HTML are at the same address without .md (the home page is " +
      `${SITE_URL}/). All of the markdown copies in one file: ${SITE_URL}/llms-full.txt`,
    "",
    "## Main",
    "",
    ...bySection("Main"),
    "",
    "## Services",
    "",
    ...bySection("Services"),
    "",
    "## Service areas",
    "",
    ...bySection("Service areas"),
    ...[...CITIES, ...NEIGHBORHOODS].map(
      (a) => `- [${a.name}](${SITE_URL}/areas/${a.slug}): Exterior cleaning in ${a.name}, ${a.type === "city" ? "a Portland metro city" : "a Portland neighborhood"}.`,
    ),
    "",
    "## Plan and booking",
    "",
    ...bySection("Plan and booking"),
    `- [Free walkthrough](${SITE_URL}/assessment): ${desc(assessmentMetadata)}`,
    "",
    ...(AI_MD_PAGES.length ? ["## Guides and answers", "", ...bySection("Guides and answers"), ""] : []),
    "## Blog",
    "",
    `- [Blog](${SITE_URL}/blog): ${desc(blogMetadata)}`,
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ""}`),
    "",
  ];
  return out.join("\n");
}

export function buildLlmsFullTxt(): string {
  const parts = MD_PAGES.map((p) => `<!-- Source: ${SITE_URL}${p.path === "/" ? "/" : p.path} -->\n\n${p.body()}`);
  return `${parts.join("\n\n---\n\n")}\n`;
}
