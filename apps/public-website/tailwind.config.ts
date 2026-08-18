import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#FAF9F6",         // Premium Ivory Editorial Canvas
        foreground: "#1A202C",         // Deep Charcoal Readable Typography
        primary: {
          DEFAULT: "#0D9488",          // Elegant Teal Accent
          hover: "#0F766E",
          light: "#CCFBF1",
          foreground: "#FAF9F6",
        },
        card: {
          DEFAULT: "#FFFFFF",
          border: "#E2E8F0",
          foreground: "#1A202C",
        },
        border: "#E2E8F0",
        muted: {
          DEFAULT: "#64748B",
          foreground: "#94A3B8",
        },
        success: "#10B981",
        warning: "#F59E0B",
        destructive: "#EF4444",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],     // Classic Titles
        sans: ["var(--font-inter)", "Helvetica", "sans-serif"], // Ultra-clean reading text
      },
      borderRadius: {
        lg: "6px",
        md: "4px",
        sm: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
