"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function NavHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-soft border-b border-border-light"
            : "bg-transparent"
        }`}
      >
        <div className="container-site flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="relative z-10 flex-shrink-0">
            <img
              src="/logo-dark.png"
              alt="Rinse It Off"
              className="h-10 md:h-12 w-auto"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+15037043755"
              className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-brand-blue transition-colors"
            >
              <Phone className="w-4 h-4" />
              (503) 704-3755
            </a>
            <a href="#contact" className="btn-primary text-sm">
              Free Assessment
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-10 p-2 text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-2xl font-display font-bold text-text-primary py-3 border-b border-border-light hover:text-brand-blue transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-4">
              <a
                href="tel:+15037043755"
                className="flex items-center gap-3 text-lg font-semibold text-text-primary"
              >
                <Phone className="w-5 h-5 text-brand-blue" />
                (503) 704-3755
              </a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="btn-primary text-center justify-center">
                Free Property Assessment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
