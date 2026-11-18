import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readOffer } from "@/lib/quote/offers";
import PickView from "./PickView";

/** The client's quote, where they check the services they want: /pick/<12-char id>, texted and emailed
 *  from the /quote tool. The id is the key, so the page is noindex and unlisted. */
export const dynamic = "force-dynamic";

type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const o = await readOffer((await params).id);
  const first = o?.contact.name.trim().split(/\s+/)[0];
  return { title: first ? `Your quote, ${first}` : "Your quote", robots: { index: false, follow: false } };
}

export default async function PickPage({ params }: P) {
  const o = await readOffer((await params).id);
  if (!o) notFound();
  // Only what the page needs: no phone, email or GHL ids in the browser.
  return (
    <PickView
      id={o.id}
      first={o.contact.name.trim().split(/\s+/)[0] || ""}
      street={o.contact.address.split(",")[0].trim()}
      lines={o.lines}
      accepted={o.status === "accepted" ? o.accepted ?? null : null}
    />
  );
}
