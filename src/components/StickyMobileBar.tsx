import { Phone, MessageSquare, ArrowRight } from "lucide-react";

const PHONE = "+19716264146";
// "?&body=" opens pre-filled in both iPhone Messages and Android messaging apps
const TEXT_BODY = encodeURIComponent("Hi! I'd like a quote for my property at ");

/** Mobile-only bottom action bar: Call · Text · Free quote. */
export function StickyMobileBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-px border-t border-[#0C1215]/15 bg-[#62C4EB] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a href={`tel:${PHONE}`} className="flex min-h-16 items-center justify-center gap-2 py-4 text-lg font-bold text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A6E93]">
        <Phone className="h-5 w-5" aria-hidden /> Call
      </a>
      <a href={`sms:${PHONE}?&body=${TEXT_BODY}`} className="flex min-h-16 items-center justify-center gap-2 py-4 text-lg font-bold text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A6E93]">
        <MessageSquare className="h-5 w-5" aria-hidden /> Text
      </a>
      <a href="/assessment" className="flex min-h-16 items-center justify-center gap-2 whitespace-nowrap bg-[#F2B632] py-4 text-lg font-bold text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0C1215] motion-reduce:transition-none">
        Free quote <ArrowRight className="h-5 w-5" aria-hidden />
      </a>
    </nav>
  );
}
