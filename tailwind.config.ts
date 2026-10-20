import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2F6B66",
          "blue-light": "#8FB3AC",
          "blue-dark": "#2F6B66",
          "blue-glow": "rgba(47,107,102, 0.15)",
          mint: "#E4A33C",
          "mint-soft": "#F1D9A6",
          "mint-glow": "rgba(228,163,60, 0.15)",
          neon: "#E4A33C",
          peach: "#FFEBE1",
          "peach-warm": "#FFDBB0",
          lavender: "#DBD7FF",
          "lavender-deep": "#ACAAFF",
          pink: "#DF99F7",
          lime: "#DAFF99",
          black: "#26211B",
          dark: "#26211B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#EDE2CB",
          warm: "#F5EDDC",
          blue: "#E3ECE6",
          card: "#F5EDDC",
          mint: "#F5EDDC",
        },
        text: {
          primary: "#26211B",
          secondary: "#4A4238",
          muted: "#8A8072",
          inverse: "#FFFFFF",
        },
        border: { DEFAULT: "#E2D6BF", light: "#E2D6BF" },
        // Late-60s brand layer (2026-10-19 rebrand): paper and cream carry the page,
        // sun = "look here" (FREE, prices), bloom = Hal and the stripe only.
        retro: { paper: "#F5EDDC", pool: "#EDE2CB", sun: "#E4A33C", bloom: "#C2542B", line: "#E2D6BF", muted: "#6B6255" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-text)", "system-ui", "sans-serif"],
        mono: ["var(--font-text)", "system-ui", "sans-serif"],
        title: ["var(--font-title)", "Georgia", "serif"],
        label: ["var(--font-label)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(3rem, 8vw, 5.5rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.0", letterSpacing: "-0.025em" }],
        display: ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.375rem, 2.5vw, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      letterSpacing: { overline: "0.1em" },
      borderRadius: { "2xl": "16px", "3xl": "24px", "4xl": "32px" },
      boxShadow: {
        glow: "0 0 24px rgba(47,107,102,0.20)",
        "glow-lg": "0 0 48px rgba(47,107,102,0.30)",
        "glow-mint": "0 0 24px rgba(228,163,60,0.20)",
        "glow-mint-lg": "0 0 48px rgba(228,163,60,0.25)",
        "glow-spectrum": "0 4px 20px rgba(228,163,60,0.15), 0 8px 40px rgba(172,170,255,0.10), 0 2px 12px rgba(255,219,176,0.10)",
        soft: "0 2px 16px rgba(38,33,27,0.04)",
        "soft-md": "0 4px 32px rgba(38,33,27,0.06)",
        "soft-lg": "0 12px 48px rgba(38,33,27,0.08)",
        card: "0 1px 3px rgba(38,33,27,0.03), 0 6px 24px rgba(38,33,27,0.04)",
        "card-hover": "0 4px 12px rgba(38,33,27,0.06), 0 20px 48px rgba(38,33,27,0.08)",
      },
      keyframes: {
        "float-gentle": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // Signature button: the stripe sweeps across once, then a star twinkles on the top edge.
        "retro-sweep": { "0%,62%": { backgroundPosition: "170% 0" }, "92%,100%": { backgroundPosition: "-70% 0" } },
        "retro-twinkle": {
          "0%,90%": { opacity: "0", transform: "scale(.2) rotate(0deg)" },
          "94%": { opacity: "1", transform: "scale(1.1) rotate(40deg)" },
          "97%": { opacity: "1", transform: "scale(.9) rotate(70deg)" },
          "100%": { opacity: "0", transform: "scale(.3) rotate(95deg)" },
        },
      },
      animation: {
        float: "float-gentle 5s ease-in-out infinite",
        "spin-slow": "spin-slow 25s linear infinite",
        "scroll-x": "scroll-x 30s linear infinite",
        "retro-sweep": "retro-sweep 16s ease-in-out infinite",
        "retro-twinkle": "retro-twinkle 16s ease-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
