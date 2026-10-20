import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2E9BC6",
          "blue-light": "#9FD9F0",
          "blue-dark": "#1A6E93",
          "blue-glow": "rgba(46,155,198, 0.15)",
          mint: "#F2B632",
          "mint-soft": "#FCEBC0",
          "mint-glow": "rgba(214,51,108, 0.15)",
          neon: "#F2B632",
          peach: "#FFEBE1",
          "peach-warm": "#FFDBB0",
          lavender: "#DBD7FF",
          "lavender-deep": "#ACAAFF",
          pink: "#DF99F7",
          lime: "#DAFF99",
          black: "#0C1215",
          dark: "#1A6E93",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#FFFFFF",
          warm: "#FBF8F2",
          blue: "#E6F5FC",
          card: "#FBF8F2",
          mint: "#F3EDE2",
        },
        text: {
          primary: "#0C1215",
          secondary: "#3B4247",
          muted: "#7A8186",
          inverse: "#FFFFFF",
        },
        border: { DEFAULT: "#E4DCCD", light: "#E4DCCD" },
        // 1968 print-ad finish (2026-10-20): cream paper carries the page, sky is the calm ground,
        // sun = decisions (buttons, the free offer), bloom = the spark (stripes, accents, Hal).
        retro: { paper: "#FBF8F2", offwhite: "#F3EDE2", pool: "#FFFFFF", sky: "#62C4EB", blue: "#2E9BC6", "blue-ink": "#1A6E93", sun: "#F2B632", bloom: "#D6336C", ink: "#0C1215", line: "#E4DCCD", muted: "#5F676C" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-text)", "system-ui", "sans-serif"],
        mono: ["var(--font-text)", "system-ui", "sans-serif"],
        title: ["var(--font-title)", "Georgia", "serif"],
        label: ["var(--font-label)", "system-ui", "sans-serif"],
      },
      // nothing smaller than 18px except legal text (xs); body copy 19-23px, scaling with the screen
      fontSize: {
        xs: ["16px", { lineHeight: "1.45" }],
        sm: ["18px", { lineHeight: "1.5" }],
        base: ["19px", { lineHeight: "1.55" }],
        lg: ["20px", { lineHeight: "1.5" }],
        xl: ["clamp(21px, calc(17px + .5vw), 23px)", { lineHeight: "1.45" }],
        hero: ["clamp(3rem, 8vw, 5.5rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.0", letterSpacing: "-0.025em" }],
        display: ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.375rem, 2.5vw, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      letterSpacing: { overline: "0.1em" },
      borderRadius: { "2xl": "16px", "3xl": "24px", "4xl": "32px" },
      boxShadow: {
        glow: "0 0 24px rgba(46,155,198,0.20)",
        "glow-lg": "0 0 48px rgba(46,155,198,0.30)",
        "glow-mint": "0 0 24px rgba(214,51,108,0.20)",
        "glow-mint-lg": "0 0 48px rgba(214,51,108,0.25)",
        "glow-spectrum": "0 4px 20px rgba(214,51,108,0.15), 0 8px 40px rgba(172,170,255,0.10), 0 2px 12px rgba(255,219,176,0.10)",
        soft: "0 2px 16px rgba(12,18,21,0.04)",
        "soft-md": "0 4px 32px rgba(12,18,21,0.06)",
        "soft-lg": "0 12px 48px rgba(12,18,21,0.08)",
        card: "0 1px 3px rgba(12,18,21,0.03), 0 6px 24px rgba(12,18,21,0.04)",
        "card-hover": "0 4px 12px rgba(12,18,21,0.06), 0 20px 48px rgba(12,18,21,0.08)",
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
