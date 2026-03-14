"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { siteConfig, navLinks, residentialLinks } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export function NavHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resDropdown, setResDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-slate-100/80"
            : "bg-transparent"
        }`}
      >
        <div className="container-main flex items-center justify-between h-[72px]">
          {/* Logo — full wordmark, swap dark/white based on scroll */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <Image
              src="/logo-white.png"
              alt="Rinse It Off"
              width={140}
              height={50}
              className={`h-10 w-auto transition-opacity duration-300 ${scrolled ? "opacity-0 absolute" : "opacity-100"}`}
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="Rinse It Off"
              width={140}
              height={50}
              className={`h-10 w-auto transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0 absolute"}`}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setResDropdown(true)}
                  onMouseLeave={() => setResDropdown(false)}
                >
                  <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    scrolled ? "text-text-secondary hover:text-brand-blue" : "text-white/70 hover:text-white"
                  }`}>
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <AnimatePresence>
                    {resDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-soft-lg border border-slate-100 overflow-hidden py-2"
                      >
                        {residentialLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-brand-blue-50 hover:text-brand-blue transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    scrolled ? "text-text-secondary hover:text-brand-blue" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={siteConfig.phoneHref}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                scrolled ? "text-text-secondary hover:text-brand-blue" : "text-white/70 hover:text-white"
              }`}
            >
              <Phone className="w-4 h-4" />
              {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-full shadow-[0_0_20px_rgba(98,196,235,0.25)] hover:shadow-[0_0_32px_rgba(98,196,235,0.4)] hover:bg-brand-blue-dark transition-all duration-300"
            >
              Free Assessment
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative z-10 p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-text-primary" />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? "text-text-primary" : "text-white"}`} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white pt-[72px] overflow-y-auto"
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="container-main py-8 flex flex-col gap-1"
            >
              <Link href="/commercial-services" onClick={() => setMobileOpen(false)}
                className="py-3 text-xl font-display font-700 text-text-primary hover:text-brand-blue transition-colors">
                Commercial Services
              </Link>
              <div className="py-3">
                <span className="text-xl font-display font-700 text-text-primary">Residential</span>
                <div className="mt-3 ml-4 flex flex-col gap-0.5">
                  {residentialLinks.map((sub) => (
                    <Link key={sub.href} href={sub.href} onClick={() => setMobileOpen(false)}
                      className="py-2.5 text-base text-text-secondary hover:text-brand-blue transition-colors">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/about" onClick={() => setMobileOpen(false)}
                className="py-3 text-xl font-display font-700 text-text-primary hover:text-brand-blue transition-colors">
                About
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                className="py-3 text-xl font-display font-700 text-text-primary hover:text-brand-blue transition-colors">
                Contact
              </Link>
              <div className="mt-8 flex flex-col gap-3">
                <a href={siteConfig.phoneHref}
                  className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 rounded-full text-text-primary font-semibold hover:border-brand-blue transition-colors">
                  <Phone className="w-4 h-4" /> {siteConfig.phone}
                </a>
                <Link href="/contact" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center py-3.5 bg-brand-blue text-white font-semibold rounded-full shadow-[0_0_20px_rgba(98,196,235,0.25)]">
                  Get a Free Assessment
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
