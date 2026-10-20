import { Phone, MessageSquare, ArrowRight } from "lucide-react";

const PHONE = "+19716264146";

/** Mobile-only bottom action bar: Call · Text · Free quote. */
export function StickyMobileBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-px border-t border-white/10 bg-[#12433F] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a href={`tel:${PHONE}`} className="flex min-h-11 items-center justify-center gap-2 py-3.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F6B66]">
        <Phone className="h-4 w-4" aria-hidden /> Call
      </a>
      <a href={`sms:${PHONE}`} className="flex min-h-11 items-center justify-center gap-2 py-3.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F6B66]">
        <MessageSquare className="h-4 w-4" aria-hidden /> Text
      </a>
      <a href="/assessment" className="flex min-h-11 items-center justify-center gap-2 bg-white py-3.5 text-sm font-semibold text-[#12433F] transition-colors hover:bg-[#D7EFE9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#102E32] motion-reduce:transition-none">
        Free quote <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </nav>
  );
}
