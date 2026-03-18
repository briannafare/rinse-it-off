import type { Metadata } from "next";
import { NavHeader } from "@/components/nav/NavHeader";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Rinse It Off | Commercial Pressure Washing Portland OR", template: "%s | Rinse It Off" },
  description: "Portland\u2019s commercial exterior cleaning experts. Building washing, parking lots, storefronts & recurring maintenance. Free property assessments.",
  openGraph: { title: "Rinse It Off | Commercial Pressure Washing Portland OR", description: "Portland\u2019s commercial exterior cleaning experts.", type: "website", locale: "en_US", siteName: "Rinse It Off" },
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
      </head>
      <body className="bg-white text-text-primary font-body antialiased overflow-x-hidden">
        <NavHeader />
        <main>{children}</main>
        <Footer />
        {/* GHL_CHAT_WIDGET — replace with GHL embed code when ready */}
      </body>
    </html>
  );
}
