"use client";
import { motion } from "framer-motion";

/* ── HERO WATER ILLUSTRATION ──
   Abstract geometric water composition: circles, droplets, rings
   in varying sizes and opacities. Floats asymmetrically. */
export function WaterHeroIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Large background ring */}
        <motion.circle cx="250" cy="250" r="180" stroke="#62C4EB" strokeWidth="1" strokeOpacity="0.12"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }} />
        <motion.circle cx="250" cy="250" r="140" stroke="#62C4EB" strokeWidth="0.5" strokeOpacity="0.08"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />

        {/* Main droplet — matches brand logo shape */}
        <motion.path
          d="M250 80 C250 80 330 200 330 270 C330 314 294 350 250 350 C206 350 170 314 170 270 C170 200 250 80 250 80Z"
          fill="url(#dropGradient)" fillOpacity="0.15"
          initial={{ scale: 0.6, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M250 80 C250 80 330 200 330 270 C330 314 294 350 250 350 C206 350 170 314 170 270 C170 200 250 80 250 80Z"
          stroke="#62C4EB" strokeWidth="1.5" strokeOpacity="0.3" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        />

        {/* Floating bubbles */}
        <motion.circle cx="380" cy="150" r="24" fill="#62C4EB" fillOpacity="0.08"
          animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="120" cy="320" r="18" fill="#62C4EB" fillOpacity="0.10"
          animate={{ y: [4, -6, 4] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
        <motion.circle cx="400" cy="340" r="12" fill="#62C4EB" fillOpacity="0.12"
          animate={{ y: [-3, 7, -3] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        <motion.circle cx="160" cy="140" r="8" fill="#4DFFA6" fillOpacity="0.15"
          animate={{ y: [3, -5, 3] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
        <motion.circle cx="340" cy="420" r="6" fill="#62C4EB" fillOpacity="0.15"
          animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} />

        {/* Decorative rings */}
        <motion.circle cx="100" cy="200" r="30" stroke="#62C4EB" strokeWidth="0.75" strokeOpacity="0.10" fill="none"
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="420" cy="250" r="20" stroke="#62C4EB" strokeWidth="0.5" strokeOpacity="0.12" fill="none"
          animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />

        {/* Ripple effect at bottom of droplet */}
        <motion.ellipse cx="250" cy="360" rx="40" ry="6" stroke="#62C4EB" strokeWidth="0.8" strokeOpacity="0.15" fill="none"
          animate={{ scale: [1, 1.4], opacity: [0.15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
        <motion.ellipse cx="250" cy="360" rx="40" ry="6" stroke="#62C4EB" strokeWidth="0.6" strokeOpacity="0.10" fill="none"
          animate={{ scale: [1, 1.6], opacity: [0.10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }} />

        <defs>
          <linearGradient id="dropGradient" x1="250" y1="80" x2="250" y2="350">
            <stop offset="0%" stopColor="#62C4EB" />
            <stop offset="100%" stopColor="#4DFFA6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── FLOATING DECORATIVE DROPLETS ── */
export function FloatingDroplets({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Top-right cluster */}
      <div className="absolute top-[8%] right-[12%] w-4 h-4 rounded-full bg-brand-blue/[0.07] animate-float" />
      <div className="absolute top-[15%] right-[18%] w-2.5 h-2.5 rounded-full bg-brand-blue/[0.10] animate-float-slow" />
      <div className="absolute top-[22%] right-[8%] w-6 h-6 rounded-full border border-brand-blue/[0.08] animate-float-slower" />
      {/* Bottom-left */}
      <div className="absolute bottom-[20%] left-[6%] w-3 h-3 rounded-full bg-brand-mint/[0.08] animate-float" />
      <div className="absolute bottom-[30%] left-[14%] w-5 h-5 rounded-full border border-brand-blue/[0.06] animate-float-slow" />
    </div>
  );
}

/* ── SPINNING SATISFACTION BADGE ── */
export function SatisfactionBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div className="relative w-28 h-28 md:w-32 md:h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow">
          <defs>
            <path id="badge-circle" d="M 60 60 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" />
          </defs>
          <text fill="#62C4EB" fontSize="9.5" fontWeight="700" letterSpacing="2.5" className="font-display uppercase">
            <textPath href="#badge-circle">
              ✦ YOUR SATISFACTION ✦ GUARANTEED ✦
            </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 32" className="w-5 h-7 md:w-6 md:h-8" fill="none">
            <path d="M12 0C12 0 24 14 24 20C24 26.6 18.6 32 12 32C5.4 32 0 26.6 0 20C0 14 12 0 12 0Z" fill="#62C4EB" fillOpacity="0.25" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── CUSTOM SERVICE SVG ICONS ── */
export function ServiceIcon({ type, className = "w-10 h-10" }: { type: string; className?: string }) {
  const iconProps = { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", className };

  switch (type) {
    case "building":
      return (
        <svg {...iconProps}>
          <rect x="8" y="12" width="32" height="30" rx="2" stroke="#62C4EB" strokeWidth="2" />
          <rect x="14" y="18" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
          <rect x="28" y="18" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
          <rect x="14" y="28" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
          <rect x="28" y="28" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
          <rect x="20" y="36" width="8" height="6" rx="1" stroke="#62C4EB" strokeWidth="1.5" />
          <path d="M24 6L38 12H10L24 6Z" fill="#62C4EB" fillOpacity="0.1" stroke="#62C4EB" strokeWidth="1.5" />
        </svg>
      );
    case "truck":
      return (
        <svg {...iconProps}>
          <rect x="4" y="18" width="28" height="16" rx="2" stroke="#62C4EB" strokeWidth="2" />
          <path d="M32 22H40C42 22 43 23 43 25V34H32V22Z" stroke="#62C4EB" strokeWidth="2" />
          <circle cx="14" cy="36" r="4" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="2" />
          <circle cx="38" cy="36" r="4" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="2" />
          <path d="M8 22L12 14H22" stroke="#62C4EB" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      );
    case "store":
      return (
        <svg {...iconProps}>
          <path d="M6 20H42V40C42 41.1 41.1 42 40 42H8C6.9 42 6 41.1 6 40V20Z" stroke="#62C4EB" strokeWidth="2" />
          <path d="M6 20L10 8H38L42 20" stroke="#62C4EB" strokeWidth="2" />
          <path d="M6 20C6 20 10 24 14 20C18 16 18 24 24 20C30 16 30 24 34 20C38 16 42 20 42 20" stroke="#62C4EB" strokeWidth="1.5" fill="none" strokeOpacity="0.3" />
          <rect x="18" y="30" width="12" height="12" rx="1" fill="#62C4EB" fillOpacity="0.1" stroke="#62C4EB" strokeWidth="1.5" />
        </svg>
      );
    case "homes":
      return (
        <svg {...iconProps}>
          <path d="M8 22L24 8L40 22V40C40 41.1 39.1 42 38 42H10C8.9 42 8 41.1 8 40V22Z" stroke="#62C4EB" strokeWidth="2" />
          <rect x="18" y="28" width="12" height="14" rx="1" fill="#62C4EB" fillOpacity="0.1" stroke="#62C4EB" strokeWidth="1.5" />
          <rect x="14" y="18" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1" />
          <path d="M24 8L4 24" stroke="#62C4EB" strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M24 8L44 24" stroke="#62C4EB" strokeWidth="1.5" strokeOpacity="0.3" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...iconProps}>
          <rect x="8" y="8" width="32" height="32" rx="3" stroke="#62C4EB" strokeWidth="2" />
          <rect x="12" y="12" width="10" height="10" rx="1" stroke="#62C4EB" strokeWidth="1" strokeOpacity="0.3" />
          <rect x="26" y="12" width="10" height="10" rx="1" stroke="#62C4EB" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M24 22L28 30L24 38L20 30L24 22Z" fill="#62C4EB" fillOpacity="0.2" stroke="#62C4EB" strokeWidth="1.5" />
          <line x1="24" y1="18" x2="24" y2="8" stroke="#62C4EB" strokeWidth="1" strokeOpacity="0.2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...iconProps}>
          <rect x="6" y="12" width="36" height="30" rx="3" stroke="#62C4EB" strokeWidth="2" />
          <line x1="6" y1="22" x2="42" y2="22" stroke="#62C4EB" strokeWidth="2" />
          <line x1="16" y1="8" x2="16" y2="16" stroke="#62C4EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="8" x2="32" y2="16" stroke="#62C4EB" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="30" r="2.5" fill="#62C4EB" fillOpacity="0.3" />
          <circle cx="24" cy="30" r="2.5" fill="#62C4EB" fillOpacity="0.3" />
          <circle cx="32" cy="30" r="2.5" fill="#62C4EB" fillOpacity="0.3" />
          <path d="M14 36H34" stroke="#4DFFA6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="24" cy="24" r="18" stroke="#62C4EB" strokeWidth="2" />
          <path d="M24 10C24 10 32 20 32 24C32 28.4 28.4 32 24 32C19.6 32 16 28.4 16 24C16 20 24 10 24 10Z" fill="#62C4EB" fillOpacity="0.15" />
        </svg>
      );
  }
}
