import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sf-pro)", "Inter", "sans-serif"],
        mono: ["var(--font-sf-mono)", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "var(--border-glass)",
        input: "rgba(255, 255, 255, 0.04)",
        ring: "var(--primary-glow)",
        background: "var(--background-base)",
        foreground: "var(--foreground-base)",
        
        primary: {
          DEFAULT: "var(--primary-glow)",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "var(--glass-card)",
          foreground: "var(--foreground-base)",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--primary-glow)",
          foreground: "#000000",
        },
        grade: {
          mumtaz: "#10B981",
          jayyid: "#3B82F6",
          maqbul: "#F59E0B",
          daif: "#EF4444",
        }
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#09090b",
            foreground: "#f4f4f5",
            primary: {
              DEFAULT: "#00e5ff",
              foreground: "#09090b",
            },
            focus: "#00e5ff",
          },
        },
      },
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
          "scrollbar-color": "rgba(255, 255, 255, 0.1) transparent",
        },
        ".touch-target": {
          "min-height": "44px",
          "min-width": "44px",
          "display": "flex",
          "align-items": "center",
          "justify-content": "center",
        },
        ".fluid-text-sm": {
          "font-size": "clamp(0.875rem, 0.8vw + 0.5rem, 1rem)",
        },
        ".fluid-text-base": {
          "font-size": "clamp(1rem, 1vw + 0.75rem, 1.125rem)",
        },
        ".fluid-text-lg": {
          "font-size": "clamp(1.125rem, 1.5vw + 1rem, 1.5rem)",
        },
        ".fluid-text-xl": {
          "font-size": "clamp(1.25rem, 2vw + 1rem, 1.75rem)",
        },
      });
    }),
  ],
};

export default config;
