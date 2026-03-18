import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Rinse It Off | Commercial Pressure Washing Portland OR", template: "%s | Rinse It Off Portland" },
  description: "Portland\u2019s commercial exterior cleaning experts. Hot water pressure washing, soft washing, parking lot cleaning, building washing, and recurring maintenance programs. Licensed & insured. Free property assessments. Serving Portland, Beaverton, Lake Oswego, Tigard & the Willamette Valley.",
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
    title: "Rinse It Off | Commercial Pressure Washing Portland OR",
    description: "Hot water pressure washing, soft washing & recurring maintenance for commercial properties across Portland metro. Free property assessments.",
    type: "website",
    locale: "en_US",
    siteName: "Rinse It Off",
    url: "https://www.rinseitoff.com",
  },
  alternates: { canonical: "https://www.rinseitoff.com" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://www.rinseitoff.com/#business",
      name: "Rinse It Off",
      description: "Commercial and residential exterior cleaning services in Portland, Oregon. Specializing in hot water pressure washing, soft washing, building washing, parking lot cleaning, and recurring maintenance programs.",
      url: "https://www.rinseitoff.com",
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
      "@id": "https://www.rinseitoff.com/#website",
      url: "https://www.rinseitoff.com",
      name: "Rinse It Off",
      publisher: { "@id": "https://www.rinseitoff.com/#business" },
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the difference between pressure washing and soft washing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pressure washing uses high-pressure water for hard surfaces like concrete and stone. Soft washing uses lower pressure with specialized cleaning solutions, making it safe for delicate surfaces like vinyl siding, stucco, wood, and painted finishes. Rinse It Off uses both methods and matches the technique to each surface type.",
      },
    },
    {
      "@type": "Question",
      name: "How much does commercial pressure washing cost in Portland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Commercial pressure washing pricing varies based on square footage, surface type, and level of buildup. Rinse It Off provides free property assessments with transparent, written quotes. Recurring maintenance programs offer reduced per-visit pricing compared to one-time cleanings.",
      },
    },
    {
      "@type": "Question",
      name: "What areas in Portland do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rinse It Off serves the entire Portland metro area including Beaverton, Hillsboro, Lake Oswego, Tigard, Gresham, Milwaukie, and surrounding communities. For larger commercial projects, we serve clients throughout the Willamette Valley.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer recurring pressure washing maintenance programs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Rinse It Off offers monthly, quarterly, and seasonal maintenance plans for commercial properties. Recurring programs keep your building consistently clean, prevent long-term surface damage from moss and algae, and cost less per visit than one-off cleanings.",
      },
    },
    {
      "@type": "Question",
      name: "Is Rinse It Off licensed and insured?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Rinse It Off carries full general liability insurance and workers compensation coverage. We provide certificates of insurance to property managers and building owners upon request.",
      },
    },
    {
      "@type": "Question",
      name: "What is hot water pressure washing and when is it needed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hot water pressure washing uses heated water to dissolve oil, grease, and biological buildup that cold water alone cannot remove. It is essential for parking lots, trash pads, loading docks, and commercial kitchen exhaust areas. Rinse It Off brings both hot and cold water systems to every commercial job.",
      },
    },
    {
      "@type": "Question",
      name: "Will pressure washing damage my building or property?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not when performed correctly. Rinse It Off matches pressure levels and nozzle types to each surface. We use soft washing on delicate materials like stucco and wood siding, and protect landscaping, windows, and fixtures during every job.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="bg-white text-text-primary font-body antialiased overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
        {/* GHL_CHAT_WIDGET — replace with GHL embed code when ready */}
      </body>
    </html>
  );
}
