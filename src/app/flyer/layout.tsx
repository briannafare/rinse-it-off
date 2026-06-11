import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Assessment | Rinse It Off Portland",
  description:
    "Get a free on-site property assessment from Rinse It Off. We walk your property, identify every surface that needs attention, and hand you a written quote. No charge, no commitment.",
  robots: { index: false, follow: false },
};

export default function FlyerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
