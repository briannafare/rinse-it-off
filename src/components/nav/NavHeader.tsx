"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { site, nav, residentialLinks } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export function NavHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
        scrolled ? "bg-white/92 backdrop-blur-xl shadow-soft border-b border-border-light" : "bg-transparent"
      }`}>
        <div className="container-site flex items-center justify-between h-[68px]">
          {/* LOGO — using <img> to guarantee transparent PNG renders correctly */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <img src="/logo-dark.png" alt="Rinse It Off" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((link) =>
              link.dropdown ? (
                <div key={link.label} className="relative" onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                  <button className="flex items-center gap-1 text-[13px] font-medium text-text-secondary hover:text-brand-blue transition-colors">
                    {link.label} <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {dropdown && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-soft-lg border border-border py-1.5 overflow-hidden">
                        {residentialLinks.map((s) => (
                          <Link key={s.href} href={s.href} className="block px-4 py-2 text-[13px] text-text-secondary hover:text-brand-blue hover:bg-surface-blue/50 transition-colors">
                            {s.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.label} href={link.href} className="text-[13px] font-medium text-text-secondary hover:text-brand-blue transition-colors">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a href={site.phoneHref} className="flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-brand-blue transition-colors">
              <Phone className="w-3.5 h-3.5" /> {site.phone}
            </a>
            <Link href="/contact" className="btn-primary !py-2.5 !px-5 !text-[13px]">
              Free Assessment
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden z-10 p-1.5" aria-label="Menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-white pt-[68px] overflow-y-auto">
            <motion.nav initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
              className="container-site py-8 flex flex-col gap-1">
              <Link href="/commercial-services" onClick={() => setMobileOpen(false)} className="py-3 text-xl font-display font-700 hover:text-brand-blue transition-colors">Commercial</Link>
              <div className="py-3">
                <span className="text-xl font-display font-700">Residential</span>
                <div className="mt-2 ml-4 flex flex-col">
                  {residentialLinks.map((s) => (
                    <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)} className="py-2 text-base text-text-secondary hover:text-brand-blue transition-colors">{s.label}</Link>
                  ))}
                </div>
              </div>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="py-3 text-xl font-display font-700 hover:text-brand-blue transition-colors">About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-3 text-xl font-display font-700 hover:text-brand-blue transition-colors">Contact</Link>
              <div className="mt-8 flex flex-col gap-3">
                <a href={site.phoneHref} className="flex items-center justify-center gap-2 py-3 border-2 border-border rounded-full font-semibold"><Phone className="w-4 h-4" />{site.phone}</a>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="btn-primary justify-center">Free Assessment</Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
