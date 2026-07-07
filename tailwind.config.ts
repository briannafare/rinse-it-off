import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#62C4EB",
          "blue-light": "#94D8F3",
          "blue-dark": "#3AA8D4",
          "blue-glow": "rgba(98, 196, 235, 0.15)",
          mint: "#4DFFA6",
          "mint-soft": "#B8FFD9",
          "mint-glow": "rgba(77, 255, 166, 0.15)",
          neon: "#4DFFA6",
          peach: "#FFEBE1",
          "peach-warm": "#FFDBB0",
          lavender: "#DBD7FF",
          "lavender-deep": "#ACAAFF",
          pink: "#DF99F7",
          lime: "#DAFF99",
          black: "#0C1215",
          dark: "#0E1419",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F5F7F4",
          warm: "#FAFAF7",
          blue: "#EDF7FC",
          card: "#F8FBFE",
          mint: "#F0FFF6",
        },
        text: {
          primary: "#0C1215",
          secondary: "#4B5C6B",
          muted: "#8899A6",
          inverse: "#FFFFFF",
        },
        border: { DEFAULT: "#E4ECF1", light: "#EFF4F7" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-text)", "system-ui", "sans-serif"],
        mono: ["var(--font-text)", "system-ui", "sans-serif"],
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
        glow: "0 0 24px rgba(98,196,235,0.20)",
        "glow-lg": "0 0 48px rgba(98,196,235,0.30)",
        "glow-mint": "0 0 24px rgba(77,255,166,0.20)",
        "glow-mint-lg": "0 0 48px rgba(77,255,166,0.25)",
        "glow-spectrum": "0 4px 20px rgba(77,255,166,0.15), 0 8px 40px rgba(172,170,255,0.10), 0 2px 12px rgba(255,219,176,0.10)",
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
      },
      animation: {
        float: "float-gentle 5s ease-in-out infinite",
        "spin-slow": "spin-slow 25s linear infinite",
        "scroll-x": "scroll-x 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
