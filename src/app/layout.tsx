import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { NavHeader } from "@/components/nav/NavHeader";
import { FooterFull } from "@/components/footer/FooterFull";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Rinse It Off | Commercial Pressure Washing Portland OR",
    template: "%s | Rinse It Off",
  },
  description:
    "Portland\u2019s commercial exterior cleaning experts. Building washing, parking lots, storefronts & recurring maintenance programs. Request your free property assessment.",
  keywords: [
    "commercial pressure washing Portland",
    "exterior cleaning Portland OR",
    "commercial building washing",
    "property maintenance Portland Oregon",
  ],
  openGraph: {
    title: "Rinse It Off | Commercial Pressure Washing Portland OR",
    description:
      "Portland\u2019s commercial exterior cleaning experts. Building washing, parking lots, storefronts & recurring maintenance programs.",
    type: "website",
    locale: "en_US",
    siteName: "Rinse It Off",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="bg-white text-text-primary font-body antialiased">
        <NavHeader />
        <main>{children}</main>
        <FooterFull />
        {/* GHL_CHAT_WIDGET */}
      </body>
    </html>
  );
}
