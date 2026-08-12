import { Phone, MessageSquare, ArrowRight } from "lucide-react";

const PHONE = "+15037043755";

/** Mobile-only bottom action bar: Call · Text · Free quote. */
export function StickyMobileBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-px border-t border-white/10 bg-[#0C1215] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a href={`tel:${PHONE}`} className="flex min-h-11 items-center justify-center gap-2 py-3.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#62C4EB]">
        <Phone className="h-4 w-4" aria-hidden /> Call
      </a>
      <a href={`sms:${PHONE}`} className="flex min-h-11 items-center justify-center gap-2 py-3.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#62C4EB]">
        <MessageSquare className="h-4 w-4" aria-hidden /> Text
      </a>
      <a href="/assessment" className="flex min-h-11 items-center justify-center gap-2 bg-[#62C4EB] py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0C1215] motion-reduce:transition-none">
        Free quote <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </nav>
  );
}
