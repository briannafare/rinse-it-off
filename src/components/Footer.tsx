import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white rounded-t-[3rem] md:rounded-t-[4rem] -mt-8 relative z-10 overflow-hidden">
      {/* Subtle spectrum line at top edge */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 5%, #FFDBB0 20%, #DF99F7 40%, #ACAAFF 60%, #62C4EB 80%, transparent 95%)", opacity: 0.4 }} />
      <div className="container-site pt-16 md:pt-20 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <img src="/logo-white.png" alt="Rinse It Off" className="h-11 w-auto mb-5" />
            <p className="text-white/35 text-sm leading-relaxed mb-6">
              Commercial &amp; residential exterior cleaning across Portland metro.
            </p>
            <div className="space-y-2">
              <a href="tel:+15037043755" className="flex items-center gap-2.5 text-sm text-white/50 hover:text-brand-mint transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-mint/40" /> (503) 704-3755
              </a>
              <a href="mailto:hello@rinseitoff.com" className="flex items-center gap-2.5 text-sm text-white/50 hover:text-brand-mint transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand-mint/40" /> hello@rinseitoff.com
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/30">
                <MapPin className="w-3.5 h-3.5 text-brand-mint/40" /> Portland, Oregon
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-display font-bold uppercase tracking-wider text-white/25 mb-4">Services</h4>
            <nav className="space-y-2">
              {["Building Washing", "Parking Lots", "Storefronts", "HOA & Multi-Unit", "Window Cleaning", "House Washing"].map(s => (
                <a key={s} href="#services" className="block text-sm text-white/40 hover:text-brand-mint transition-colors">{s}</a>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-display font-bold uppercase tracking-wider text-white/25 mb-4">Company</h4>
            <nav className="space-y-2">
              {[
                { label: "How It Works", href: "#process" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "#contact" },
              ].map(l => (
                <a key={l.label} href={l.href} className="block text-sm text-white/40 hover:text-brand-mint transition-colors">{l.label}</a>
              ))}
            </nav>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-[11px] font-display font-bold uppercase tracking-wider text-white/25 mb-4">Status</h4>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-brand-mint opacity-40" />
                <span className="relative inline-flex rounded-xl h-2.5 w-2.5 bg-brand-mint" />
              </span>
              <span className="text-sm font-mono text-white/50">Operational</span>
            </div>
            <p className="text-xs text-white/25 leading-relaxed mb-5">
              Accepting new commercial and residential clients in Portland metro.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2 bg-white text-brand-black text-xs font-bold rounded-xl shadow-[0_4px_20px_rgba(77,255,166,0.35)] hover:shadow-[0_4px_28px_rgba(77,255,166,0.5)] transition-all">
              Free Assessment →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/20">&copy; {new Date().getFullYear()} Rinse It Off. All rights reserved.</p>
          <p className="text-[11px] text-white/10">
            Built by <a href="https://eighty5labs.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-brand-mint transition-colors">eighty5labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
