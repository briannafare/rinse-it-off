"use client";
import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Proof", href: "#proof" },
  { label: "FAQ", href: "#faq" },
];

const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";

/** One nav, two states. Over the hero photo it's wet glass (blur needs the
 *  image behind it); after scroll it settles onto solid white with a hairline.
 *  Full width both ways — no shrinking capsule. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ink = scrolled ? "text-[#0C1215]" : "text-white";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-[#E4ECF1] bg-white/95 backdrop-blur-xl"
            : "border-b border-white/15 bg-white/10 backdrop-blur-md"
        }`}
      >
        <nav className="container-site flex h-16 items-center justify-between md:h-[72px]">
          <a href="/" className="flex-shrink-0" aria-label="Rinse It Off — home">
            <img
              src={scrolled ? "/logo-dark.png" : "/logo-white.png"}
              alt="Rinse It Off"
              className="h-8 w-auto md:h-9"
            />
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors duration-300 ${ink} opacity-80 hover:opacity-100`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <a
              href={PHONE_TEL}
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${ink} opacity-80 hover:opacity-100`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {PHONE_DISPLAY}
            </a>
            <a
              href="/assessment"
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                scrolled
                  ? "bg-[#0C1215] text-white hover:bg-[#1d2830]"
                  : "bg-white text-[#0C1215] hover:bg-white/90"
              }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get a quote
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`p-2 md:hidden ${ink}`}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-[#0C1215] px-6 pt-5 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <img src="/logo-white.png" alt="Rinse It Off" className="h-8 w-auto" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 text-white"
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
                  className="py-3 text-3xl font-medium text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              <a
                href={PHONE_TEL}
                className="flex items-center gap-3 text-lg font-medium text-white/85"
              >
                <Phone className="h-5 w-5" aria-hidden />
                {PHONE_DISPLAY}
              </a>
              <a
                href="/assessment"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-[#62C4EB] px-6 py-4 text-center text-base font-semibold text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Get a quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
