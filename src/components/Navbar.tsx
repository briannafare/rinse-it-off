"use client";
import { useState, useEffect } from "react";
import { Phone, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.15);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className={`mx-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "max-w-3xl px-0 mt-3" : "max-w-full px-0 mt-0"
        }`}>
          <nav
            className={`pointer-events-auto flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              scrolled
                ? "bg-white/95 backdrop-blur-2xl border border-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.06)] rounded-full mx-4 px-5 md:px-6 py-2.5"
                : "bg-black/20 backdrop-blur-sm border-b border-white/[0.08] rounded-none px-5 md:px-10 lg:px-16 py-4"
            }`}
          >
            <a href="/" className="flex-shrink-0">
              <img
                src={scrolled ? "/logo-dark.png" : "/logo-white.png"}
                alt="Rinse It Off"
                className={`w-auto transition-all duration-500 ${scrolled ? "h-7 md:h-8" : "h-8 md:h-10"}`}
              />
            </a>

            <div className="hidden md:flex items-center gap-1">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    scrolled
                      ? "text-text-secondary hover:text-text-primary hover:bg-black/[0.04]"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:+15037043755"
                className={`hidden lg:flex items-center gap-2 text-sm font-medium transition-all duration-500 ${
                  scrolled ? "text-text-secondary hover:text-text-primary" : "text-white/60 hover:text-white"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                (503) 704-3755
              </a>

              <a
                href="#contact"
                className={`hidden md:flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-full transition-all duration-500 ${
                  scrolled
                    ? "bg-brand-black text-white hover:bg-brand-dark"
                    : "bg-white text-brand-black hover:bg-white/90 shadow-[0_0_20px_rgba(77,255,166,0.35)]"
                }`}
              >
                Free Assessment
                <ArrowRight className="w-3.5 h-3.5" />
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
        </div>
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
                className="text-3xl font-display font-semibold text-text-primary hover:text-brand-blue transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-brand-black text-white font-bold px-8 py-3 rounded-full text-lg shadow-[0_0_24px_rgba(77,255,166,0.3)]"
            >
              Free Assessment →
            </motion.a>
            <motion.a
              href="tel:+15037043755"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
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
