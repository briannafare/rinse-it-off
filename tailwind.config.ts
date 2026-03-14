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
          violet: "#A78BFA",
          black: "#0C1215",
          dark: "#0E1419",
        },
        surface: { DEFAULT: "#FFFFFF", alt: "#F6FAFE", blue: "#EDF7FC", card: "#F8FBFE" },
        text: {
          primary: "#0C1215",
          secondary: "#4B5C6B",
          muted: "#8899A6",
          inverse: "#FFFFFF",
        },
        border: { DEFAULT: "#E4ECF1", light: "#EFF4F7" },
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        hero: ["clamp(3rem, 8vw, 5.5rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.375rem, 2.5vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      letterSpacing: { overline: "0.1em" },
      borderRadius: { "2xl": "16px", "3xl": "24px", "4xl": "32px" },
      boxShadow: {
        glow: "0 0 24px rgba(98,196,235,0.20)",
        "glow-lg": "0 0 48px rgba(98,196,235,0.30)",
        soft: "0 2px 16px rgba(12,18,21,0.04)",
        "soft-md": "0 4px 32px rgba(12,18,21,0.06)",
        "soft-lg": "0 12px 48px rgba(12,18,21,0.08)",
        card: "0 1px 3px rgba(12,18,21,0.03), 0 6px 24px rgba(12,18,21,0.04)",
        "card-hover": "0 4px 12px rgba(12,18,21,0.06), 0 20px 48px rgba(12,18,21,0.08)",
      },
      keyframes: {
        "float-gentle": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-drift": {
          "0%,100%": { transform: "translate(0,0) rotate(0deg)" },
          "33%": { transform: "translate(10px,-18px) rotate(2deg)" },
          "66%": { transform: "translate(-8px,8px) rotate(-1deg)" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float-gentle 5s ease-in-out infinite",
        "float-slow": "float-drift 20s ease-in-out infinite",
        "float-slower": "float-drift 28s ease-in-out infinite reverse",
        ripple: "ripple 2.5s ease-out infinite",
        "ripple-delayed": "ripple 2.5s ease-out 0.8s infinite",
        "spin-slow": "spin-slow 25s linear infinite",
        "scroll-x": "scroll-x 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
