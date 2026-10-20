import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HOME_DESCRIPTION } from "@/lib/site";
import { OG, pageMeta } from "@/lib/seo";

// The (main) group holds only the home page, so its search tags live here and
// page.tsx stays markup only.
export const metadata: Metadata = pageMeta({
  title: "Rinse It Off | Pressure Washing in Portland, OR",
  absoluteTitle: true,
  description: HOME_DESCRIPTION,
  path: "/",
  image: OG.home,
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
