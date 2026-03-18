"use client";
import { useState, useEffect } from "react";
import { Phone, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <nav
          className={`pointer-events-auto mt-4 md:mt-5 flex items-center justify-between rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled
              ? "bg-white/90 backdrop-blur-2xl border border-black/[0.06] shadow-[0_2px_24px_rgba(0,0,0,0.06)] px-4 md:px-6 py-2.5 w-full max-w-3xl"
              : "bg-white/[0.06] backdrop-blur-sm border border-white/[0.10] px-3 md:px-5 py-2.5 w-auto"
          }`}
        >
          {/* Logo */}
          <a href="/" className="px-1.5 py-0.5 flex-shrink-0">
            <img
              src={scrolled ? "/logo-dark.png" : "/logo-white.png"}
              alt="Rinse It Off"
              className="h-7 md:h-8 w-auto transition-opacity duration-500"
            />
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 mx-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-300 ${
                  scrolled
                    ? "text-text-secondary hover:text-text-primary hover:bg-black/[0.04]"
                    : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+15037043755"
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-full transition-all duration-500 ${
                scrolled ? "text-text-secondary hover:text-text-primary" : "text-white/60 hover:text-white"
              }`}
            >
              <Phone className="w-3 h-3" />
              (503) 704-3755
            </a>

            <a
              href="#contact"
              className={`hidden md:flex items-center gap-1.5 px-5 py-2 text-[13px] font-bold rounded-full transition-all duration-500 ${
                scrolled
                  ? "bg-brand-black text-white hover:bg-brand-dark"
                  : "bg-brand-mint text-brand-black hover:brightness-110"
              }`}
            >
              Free Assessment
              <ArrowRight className="w-3 h-3" />
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${scrolled ? "text-text-primary" : "text-white"}`}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-2"
          >
            <img src="/logo-dark.png" alt="Rinse It Off" className="h-10 w-auto mb-8" />
            {LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="text-3xl font-display font-extrabold text-text-primary hover:text-brand-blue transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-6 bg-brand-mint text-brand-black font-bold px-8 py-3 rounded-full text-lg"
            >
              Free Assessment →
            </motion.a>
            <motion.a
              href="tel:+15037043755"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-4 text-text-muted text-sm flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> (503) 704-3755
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
