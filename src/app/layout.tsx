import MetaPixel from "@/components/MetaPixel";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { AREAS } from "@/lib/areas";
import { SERVICES } from "@/lib/services";
import { HOME_DESCRIPTION } from "@/lib/site";
import { BUSINESS_ID, OG, SITE_URL, WEBSITE_ID } from "@/lib/seo";
import { Fraunces } from "next/font/google";
import "./globals.css";

// Display: Fraunces 900, upright only. Body Neue Haas, labels Futura PT. Three families, no more.
const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "opsz"], variable: "--f-fraunces", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Rinse It Off | Pressure Washing in Portland, OR", template: "%s | Rinse It Off" },
  description: HOME_DESCRIPTION,
  applicationName: "Rinse It Off",
  // Every page sets its own canonical and share tags through pageMeta() in
  // src/lib/seo.ts. Nothing canonical lives here: a root canonical is inherited
  // by any page that forgets one, which pointed /commercial at the home page.
  openGraph: { type: "website", locale: "en_US", siteName: "Rinse It Off", images: [{ url: OG.home.url, width: 1200, height: 630, alt: OG.home.alt }] },
  twitter: { card: "summary_large_image", images: [OG.home.url] },
  robots: { index: true, follow: true },
};

// Every page in the sitemap's /areas list: the nine cities, then the Portland
// neighborhoods (marked as places inside Portland). Built from the same
// registry that generates the pages, so the markup cannot drift from them.
const AREA_SERVED = AREAS.map((a) =>
  a.type === "city"
    ? {
        "@type": "City",
        name: a.name,
        ...(a.slug === "portland" ? { sameAs: "https://en.wikipedia.org/wiki/Portland,_Oregon" } : {}),
      }
    : { "@type": "Place", name: a.name, containedInPlace: { "@type": "City", name: "Portland" } },
);

// The yearly plan and the six methods, so answer engines can name what is sold
// and from where. Prices only where the site prints them ("from $189 a month").
const SERVICE_OFFERS = SERVICES.map((s) => ({
  "@type": "Offer",
  itemOffered: { "@type": "Service", name: s.h1, url: `${SITE_URL}/services/${s.slug}`, provider: { "@id": BUSINESS_ID } },
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // HomeAndConstructionBusiness is a LocalBusiness subtype; schema.org has
      // no exterior-cleaning type, and this is the nearest true one.
      "@type": "HomeAndConstructionBusiness",
      "@id": BUSINESS_ID,
      name: "Rinse It Off",
      legalName: "Fresh Rinse, LLC",
      description:
        "Exterior cleaning for homes and commercial properties across the Portland, Oregon metro: roof soft washing and moss removal, house washing, concrete and parking lot cleaning, pure-water window cleaning, hot-water degreasing of trash pads, and a yearly maintenance plan for houses.",
      url: SITE_URL,
      telephone: "+1-971-626-4146",
      email: "hello@rinseitoff.com",
      logo: { "@type": "ImageObject", "@id": `${SITE_URL}/#logo`, url: `${SITE_URL}/logo-dark.png`, width: 706, height: 438 },
      image: [`${SITE_URL}${OG.home.url}`, `${SITE_URL}${OG.commercial.url}`],
      address: {
        "@type": "PostalAddress",
        // ponytail: city only. Service-area business; the street address is the owner's home.
        addressLocality: "Tigard",
        addressRegion: "OR",
        addressCountry: "US",
      },
      areaServed: AREA_SERVED,
      knowsAbout: [
        "Pressure washing",
        "Soft washing",
        "Roof moss removal",
        "House washing",
        "Hot water pressure washing",
        "Concrete cleaning",
        "Parking lot cleaning",
        "Trash pad and dumpster pad cleaning",
        "Pure-water window cleaning",
        "Gutter cleaning",
        "Brick and masonry washing",
      ],
      priceRange: "$$",
      currenciesAccepted: "USD",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-971-626-4146",
        email: "hello@rinseitoff.com",
        contactType: "customer service",
        areaServed: "US-OR",
        availableLanguage: "English",
      },
      // the same business everywhere it is listed, so search and AI engines join them into one entity
      sameAs: [
        "https://www.facebook.com/profile.php?id=61594392927890",
        "https://www.instagram.com/rinseitoffofficial/",
        "https://www.linkedin.com/company/rinse-it-off-llc",
        "https://www.google.com/maps?cid=17988257302203001929",
      ],
      hasMap: "https://www.google.com/maps?cid=17988257302203001929",
      // OPEN: the contact page prints Monday–Saturday 7am–6pm; this says every day,
      // all day (set 2026-09-12 because the AI assistant answers around the clock).
      // Bri decides which one is true for Google; both must then say the same.
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Exterior cleaning",
        itemListElement: [
          {
            "@type": "Offer",
            name: "The yearly plan",
            url: `${SITE_URL}/plan`,
            description:
              "A full year of exterior care for a house: roof, siding, driveway, gutters, winter walkways, and the windows cleaned four times. Priced for the house online.",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              minPrice: 189,
              priceCurrency: "USD",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
            },
            itemOffered: { "@type": "Service", name: "Yearly exterior maintenance plan", provider: { "@id": BUSINESS_ID } },
          },
          ...SERVICE_OFFERS,
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Gutter cleaning", url: `${SITE_URL}/services/gutter-cleaning`, provider: { "@id": BUSINESS_ID } },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Commercial exterior cleaning", url: `${SITE_URL}/commercial`, provider: { "@id": BUSINESS_ID } },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Rinse It Off",
      inLanguage: "en-US",
      publisher: { "@id": BUSINESS_ID },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fraunces.variable} suppressHydrationWarning>
      <head>
        {/* Typekit CSS is render-blocking; warm both of its hosts first. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/asf7gwn.css" />
        {/* Futura PT for small spaced labels */}
        <link rel="stylesheet" href="https://use.typekit.net/zlw7xqi.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-retro-paper text-text-primary font-body antialiased overflow-x-hidden">
        <MetaPixel />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
