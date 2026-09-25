import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/** Blog lives outside the (main) route group, so it carries its own copy of
 *  the shared shell, same as /services. */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
