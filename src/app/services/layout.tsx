import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/** Services live outside the (main) route group, so they carry their own copy
 *  of the shared shell — same Navbar (wet-glass over the dark hero, settling to
 *  white on scroll) and Footer as the homepage. */
export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
