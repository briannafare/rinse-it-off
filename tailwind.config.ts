import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#62C4EB",
          "blue-light": "#8FD6F2",
          "blue-dark": "#3BA8D4",
          "blue-50": "rgba(98, 196, 235, 0.05)",
          "blue-100": "rgba(98, 196, 235, 0.10)",
          "blue-200": "rgba(98, 196, 235, 0.20)",
          mint: "#4DFFA6",
          "mint-100": "rgba(77, 255, 166, 0.10)",
          violet: "#A78BFA",
          dark: "#0B1120",
          "dark-surface": "#111827",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F9FC",
          warm: "#FAFBFE",
          muted: "#F1F5F9",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
          inverse: "#F8FAFC",
        },
      },
      fontFamily: {
        display: [
          "var(--font-jakarta)",
          "system-ui",
          "sans-serif",
        ],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        hero: "clamp(2.75rem, 7vw, 5rem)",
        "h1": "clamp(2.25rem, 5vw, 3.75rem)",
        "h2": "clamp(1.75rem, 3.5vw, 2.75rem)",
        "h3": "clamp(1.25rem, 2vw, 1.5rem)",
      },
      letterSpacing: {
        display: "-0.03em",
        heading: "-0.02em",
        overline: "0.12em",
      },
      lineHeight: {
        display: "1.0",
        heading: "1.15",
        relaxed: "1.75",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "28px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(98, 196, 235, 0.15)",
        "glow-lg": "0 0 40px rgba(98, 196, 235, 0.20)",
        soft: "0 4px 24px rgba(15, 23, 42, 0.06)",
        "soft-lg": "0 8px 40px rgba(15, 23, 42, 0.08)",
        "soft-xl": "0 20px 60px rgba(15, 23, 42, 0.10)",
      },
      animation: {
        "float-slow": "float 20s ease-in-out infinite",
        "float-slower": "float 30s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, -20px) scale(1.02)" },
          "66%": { transform: "translate(-10px, 10px) scale(0.98)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
