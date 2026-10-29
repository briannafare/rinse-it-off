import { Phone, MessageSquare, ArrowRight } from "lucide-react";

const PHONE = "+19716264146";
// "?&body=" opens pre-filled in both iPhone Messages and Android messaging apps
const TEXT_BODY = encodeURIComponent("Hi! I'd like a quote for my property at ");

/** Mobile-only bottom bar: one main action per page, with Call and Text as small links.
 *  The bar shows after the first screen, so on the home page it serves the homeowners still
 *  scrolling (SuperMe website panel, 2026-10-28). Pages pass their own action. */
export function StickyMobileBar({
  label = "Price my first cleaning",
  href = "/assessment?type=residential",
}: { label?: string; href?: string } = {}) {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-[auto_auto_1fr] gap-px border-t border-[#0C1215]/15 bg-[#62C4EB] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a href={`tel:${PHONE}`} aria-label="Call us" className="flex min-h-16 items-center justify-center gap-1.5 px-4 py-4 text-sm font-bold text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A6E93]">
        <Phone className="h-4 w-4" aria-hidden /> Call
      </a>
      <a href={`sms:${PHONE}?&body=${TEXT_BODY}`} aria-label="Text us" className="flex min-h-16 items-center justify-center gap-1.5 px-4 py-4 text-sm font-bold text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A6E93]">
        <MessageSquare className="h-4 w-4" aria-hidden /> Text
      </a>
      <a href={href} className="flex min-h-16 items-center justify-center gap-2 bg-[#F2B632] px-3 py-4 text-center text-base font-bold leading-tight text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0C1215] motion-reduce:transition-none">
        {label} <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
      </a>
    </nav>
  );
}
