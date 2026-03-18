"use client";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

function WaterDropIllustration() {
  return (
    <div className="relative w-full h-full" aria-hidden="true">
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Large background ring */}
        <motion.circle cx="250" cy="250" r="200" stroke="#62C4EB" strokeWidth="1" strokeOpacity="0.10"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, delay: 0.5 }} />
        <motion.circle cx="250" cy="250" r="160" stroke="#62C4EB" strokeWidth="0.5" strokeOpacity="0.06"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.7 }} />

        {/* Main droplet */}
        <motion.path
          d="M250 70 C250 70 340 200 340 275 C340 324 299 360 250 360 C201 360 160 324 160 275 C160 200 250 70 250 70Z"
          fill="url(#heroDropGrad)" fillOpacity="0.12"
          initial={{ scale: 0.5, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M250 70 C250 70 340 200 340 275 C340 324 299 360 250 360 C201 360 160 324 160 275 C160 200 250 70 250 70Z"
          stroke="#62C4EB" strokeWidth="2" strokeOpacity="0.25" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
        />

        {/* Inner shine line */}
        <motion.path
          d="M220 180 C220 180 200 240 200 270 C200 290 210 305 225 312"
          stroke="#62C4EB" strokeWidth="1.5" strokeOpacity="0.20" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
        />

        {/* Floating bubbles */}
        <motion.circle cx="390" cy="130" r="20" fill="#62C4EB" fillOpacity="0.06"
          animate={{ y: [-6, 6, -6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="110" cy="310" r="15" fill="#62C4EB" fillOpacity="0.08"
          animate={{ y: [4, -8, 4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
        <motion.circle cx="410" cy="350" r="10" fill="#4DFFA6" fillOpacity="0.10"
          animate={{ y: [-4, 6, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        <motion.circle cx="140" cy="150" r="8" fill="#62C4EB" fillOpacity="0.10"
          animate={{ y: [3, -5, 3] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />

        {/* Decorative rings */}
        <motion.circle cx="90" cy="220" r="28" stroke="#62C4EB" strokeWidth="0.75" strokeOpacity="0.08" fill="none"
          animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="420" cy="240" r="18" stroke="#62C4EB" strokeWidth="0.5" strokeOpacity="0.10" fill="none"
          animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />

        {/* Ripple at base of droplet */}
        <motion.ellipse cx="250" cy="370" rx="45" ry="6" stroke="#62C4EB" strokeWidth="0.8" strokeOpacity="0.12" fill="none"
          animate={{ scale: [1, 1.5], opacity: [0.12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }} />
        <motion.ellipse cx="250" cy="370" rx="45" ry="6" stroke="#62C4EB" strokeWidth="0.5" strokeOpacity="0.08" fill="none"
          animate={{ scale: [1, 1.8], opacity: [0.08, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.7 }} />

        {/* Spray dots - top right cluster */}
        {[
          { cx: 350, cy: 100, r: 3, delay: 0.8 },
          { cx: 370, cy: 115, r: 2, delay: 1 },
          { cx: 365, cy: 90, r: 2.5, delay: 0.9 },
          { cx: 385, cy: 105, r: 1.5, delay: 1.1 },
        ].map((dot, i) => (
          <motion.circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#62C4EB" fillOpacity="0.15"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: dot.delay }} />
        ))}

        <defs>
          <linearGradient id="heroDropGrad" x1="250" y1="70" x2="250" y2="360">
            <stop offset="0%" stopColor="#62C4EB" />
            <stop offset="100%" stopColor="#3AA8D4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function SatisfactionBadge() {
  return (
    <div className="relative w-28 h-28 md:w-36 md:h-36" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow">
        <defs>
          <path id="badge-arc" d="M 60 60 m -44 0 a 44 44 0 1 1 88 0 a 44 44 0 1 1 -88 0" />
        </defs>
        <text fill="#62C4EB" fontSize="9" fontWeight="700" letterSpacing="3" className="font-display uppercase">
          <textPath href="#badge-arc">
            ✦ SATISFACTION ✦ GUARANTEED ✦ ALWAYS ✦
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 32" className="w-5 h-7" fill="none">
          <path d="M12 0C12 0 24 14 24 20C24 26.6 18.6 32 12 32C5.4 32 0 26.6 0 20C0 14 12 0 12 0Z" fill="#62C4EB" fillOpacity="0.20" />
          <path d="M12 4C12 4 21 15 21 20C21 25 17 29 12 29C7 29 3 25 3 20C3 15 12 4 12 4Z" stroke="#62C4EB" strokeWidth="0.8" strokeOpacity="0.30" fill="none" />
        </svg>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-hero-gradient pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-brand-blue/[0.03] blur-3xl" />
        <div className="absolute bottom-[15%] left-[0%] w-[400px] h-[400px] rounded-full bg-brand-mint/[0.02] blur-3xl" />
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />
      </div>

      <div className="container-site relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="overline mb-4 block">Commercial &amp; Residential Exterior Cleaning</span>
            </motion.div>

            <motion.h1
              className="font-display font-extrabold text-hero text-text-primary mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Your Building&apos;s
              <br />
              <span className="text-gradient-blue">First Impression.</span>
              <br />
              We Make It Count.
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-text-secondary max-w-lg mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              Portland&apos;s commercial exterior cleaning experts. Building washing, parking structures, storefronts, and recurring maintenance programs that keep your property looking its best year-round.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <a href="#contact" className="btn-primary group">
                Schedule a Free Assessment
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="tel:+15037043755" className="btn-outline group">
                <Phone className="w-4 h-4" />
                (503) 704-3755
              </a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              className="mt-10 flex items-center gap-6 text-sm text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Licensed &amp; Insured
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Hot &amp; Cold Water
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Portland, OR
              </div>
            </motion.div>
          </div>

          {/* Right: Illustration + Badge */}
          <div className="relative hidden lg:flex items-center justify-center">
            <motion.div
              className="w-[420px] h-[420px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <WaterDropIllustration />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <SatisfactionBadge />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wave divider to next section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full h-[50px] md:h-[72px]" fill="none">
          <path fill="#FFFFFF" d="M0,56 C180,20 360,72 540,48 C720,24 900,64 1080,44 C1260,24 1380,56 1440,40 L1440,72 L0,72 Z" />
        </svg>
      </div>
    </section>
  );
}
