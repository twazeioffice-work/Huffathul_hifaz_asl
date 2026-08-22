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
        border: "rgba(var(--border-glass), <alpha-value>)",
        input: "rgba(var(--input-bg), <alpha-value>)",
        ring: "rgba(var(--ring-active), <alpha-value>)",
        background: "rgba(var(--background-base), <alpha-value>)",
        foreground: "rgba(var(--foreground-base), <alpha-value>)",
        
        primary: {
          DEFAULT: "rgba(var(--primary-glow), <alpha-value>)",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "rgba(var(--card-bg), <alpha-value>)",
          foreground: "rgba(var(--foreground-base), <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgba(var(--muted-base), <alpha-value>)",
          foreground: "rgba(var(--muted-foreground), <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgba(var(--accent-cyan), <alpha-value>)",
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
        lg: "var(--radius-apple-lg)",
        md: "var(--radius-apple-md)",
        sm: "var(--radius-apple-sm)",
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
      });
    }),
  ],
};

export default config;
