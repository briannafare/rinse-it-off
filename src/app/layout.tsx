import type { Metadata } from "next";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import { NavHeader } from "@/components/nav/NavHeader";
import { FooterFull } from "@/components/footer/FooterFull";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", weight: ["400","500","600","700","800"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", weight: ["400","500","600","700"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400","700"] });

export const metadata: Metadata = {
  title: { default: "Rinse It Off | Commercial Pressure Washing Portland OR", template: "%s | Rinse It Off" },
  description: "Portland\u2019s commercial exterior cleaning experts. Building washing, parking lots, storefronts & recurring maintenance. Free property assessments.",
  openGraph: { title: "Rinse It Off | Commercial Pressure Washing Portland OR", description: "Portland\u2019s commercial exterior cleaning experts.", type: "website", locale: "en_US", siteName: "Rinse It Off" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="bg-white text-text-primary font-body antialiased overflow-x-hidden">
        <NavHeader />
        <main>{children}</main>
        <FooterFull />
        {/* GHL_CHAT_WIDGET */}
      </body>
    </html>
  );
}
