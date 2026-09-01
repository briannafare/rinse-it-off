import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Rinse It Off | Pressure Washing Portland OR \u2014 Commercial & Residential", template: "%s | Rinse It Off Portland" },
  description: "Portland\u2019s exterior cleaning experts for commercial properties and homes. Hot water pressure washing, soft washing, roof and house washing, parking lot cleaning, and recurring maintenance programs. Insured. Free property assessments. Serving Portland, Beaverton, Lake Oswego, Tigard & the Willamette Valley.",
  keywords: [
    "commercial pressure washing Portland",
    "pressure washing Portland OR",
    "building washing Portland",
    "parking lot cleaning Portland",
    "soft washing Portland Oregon",
    "exterior cleaning Portland",
    "commercial power washing near me",
    "storefront cleaning Portland",
    "HOA pressure washing Portland",
    "recurring maintenance pressure washing",
    "hot water pressure washing Portland",
    "concrete cleaning Portland OR",
    "house washing Portland",
    "roof cleaning Portland Oregon",
  ],
  openGraph: {
    title: "Rinse It Off | Pressure Washing Portland OR — Commercial & Residential",
    description: "Hot water pressure washing, soft washing & recurring maintenance for commercial properties and homes across Portland metro. Free property assessments.",
    type: "website",
    locale: "en_US",
    siteName: "Rinse It Off",
    url: "https://rinseitoff.com",
  },
  alternates: { canonical: "https://rinseitoff.com" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://rinseitoff.com/#business",
      name: "Rinse It Off",
      description: "Commercial and residential exterior cleaning services in Portland, Oregon. Specializing in hot water pressure washing, soft washing, building washing, parking lot cleaning, and recurring maintenance programs.",
      url: "https://rinseitoff.com",
      telephone: "+1-503-704-3755",
      email: "hello@rinseitoff.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Portland",
        addressRegion: "OR",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "Portland", sameAs: "https://en.wikipedia.org/wiki/Portland,_Oregon" },
        { "@type": "City", name: "Beaverton" },
        { "@type": "City", name: "Lake Oswego" },
        { "@type": "City", name: "Tigard" },
        { "@type": "City", name: "Hillsboro" },
        { "@type": "City", name: "Gresham" },
        { "@type": "City", name: "Milwaukie" },
      ],
      serviceType: [
        "Commercial Pressure Washing",
        "Building Exterior Washing",
        "Parking Lot Cleaning",
        "Soft Washing",
        "Hot Water Pressure Washing",
        "Storefront Cleaning",
        "HOA Property Maintenance",
        "Recurring Exterior Maintenance",
        "House Washing",
        "Roof and Gutter Cleaning",
        "Concrete Cleaning",
        "Window Washing",
      ],
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "18:00",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://rinseitoff.com/#website",
      url: "https://rinseitoff.com",
      name: "Rinse It Off",
      publisher: { "@id": "https://rinseitoff.com/#business" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/asf7gwn.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-text-primary font-body antialiased overflow-x-hidden">
        {children}
        {/* GHL chat widget — carrier-required SMS opt-in surface for A2P 10DLC */}
        <Script
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="6a32ee4e81870ee2fd443c44"
          data-source="WEB_USER"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
