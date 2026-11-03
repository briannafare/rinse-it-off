"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { PromoBar } from "@/components/PromoBar";

const LINKS = [
  { label: "Services", href: "/services" },
  { label: "Commercial", href: "/commercial" },
  { label: "Proof", href: "/#proof" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "/blog" },
];

const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";

/** One nav, two states. Over the hero photo it's wet glass (blur needs the
 *  image behind it); after scroll it settles onto solid white with a hairline.
 *  Full width both ways — no shrinking capsule. */
export function Navbar() {
  const [scrolledDown, setScrolled] = useState(false);
  // The home hero is a cream title block beside the photo, so the bar starts solid there.
  // ponytail: the late-60s layer keeps one solid paper bar on every page (scroll state
  // kept for the hairline). Bring the over-photo glass state back per page if a hero needs it.
  usePathname();
  const scrolled = scrolledDown || true;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock background scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // over the cinematic photo hero the bar is wet glass with white text; after
  // scroll it settles onto solid white with dark ink.
  const ink = scrolled ? "text-[#0C1215]" : "text-[#0C1215]";
  // shared focus-visible ring; offset color flips with the bar's state
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2";
  const offset = scrolled
    ? "focus-visible:ring-offset-white"
    : "focus-visible:ring-offset-[#62C4EB]";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-retro-line bg-retro-paper/95 backdrop-blur-xl"
            : "border-b border-[#0C1215]/15 bg-white/10 backdrop-blur-md"
        }`}
      >
        <PromoBar collapsed={scrolledDown} />
        <nav className="container-site flex h-16 items-center justify-between md:h-[76px]">
          <a
            href="/"
            className={`flex-shrink-0 rounded ${focusRing} ${offset}`}
            aria-label="Rinse It Off — home"
          >
            <Image
              src="/logo-dark.png"
              alt="Rinse It Off"
              width={706}
              height={438}
              priority
              className="h-9 w-auto md:h-10"
            />
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`label-caps !text-[0.8rem] !font-semibold rounded px-1 transition-colors duration-300 ${ink} hover:!text-[#1A6E93] ${focusRing} ${offset} motion-reduce:transition-none`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <a
              href={PHONE_TEL}
              className={`hidden items-center gap-2 whitespace-nowrap rounded px-1 text-base font-semibold lg:flex transition-colors duration-300 ${ink} opacity-80 hover:opacity-100 ${focusRing} ${offset} motion-reduce:transition-none`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              {PHONE_DISPLAY}
            </a>
            <a
              href="/assessment"
              className="btn-print inline-flex min-h-[48px] items-center whitespace-nowrap bg-[#F2B632] px-6 leading-none text-[#0C1215] transition-colors duration-300 hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
            >
              Free walkthrough
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`flex min-h-14 min-w-14 items-center justify-center rounded md:hidden ${ink} ${focusRing} ${offset}`}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-8 w-8" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[60] flex flex-col bg-retro-pool px-6 pt-5 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <Image
                src="/logo-dark.png"
                alt="Rinse It Off"
                width={706}
                height={438}
                className="h-8 w-auto"
              />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB]"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-14 flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded py-2.5 font-title text-[2.6rem] font-bold leading-tight text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-retro-pool"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/hal/hal-still.webp" alt="" aria-hidden width={360} height={410} className="mb-2 w-24 self-end" />
              <a
                href={PHONE_TEL}
                className="flex items-center gap-3 rounded text-lg font-medium text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB]"
              >
                <Phone className="h-5 w-5" aria-hidden />
                {PHONE_DISPLAY}
              </a>
              <a
                href="/assessment"
                onClick={() => setMobileOpen(false)}
                className="btn-print bg-[#F2B632] px-6 py-4 text-center text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB] motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Free walkthrough
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
