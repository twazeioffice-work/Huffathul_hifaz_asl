/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#060913',
          900: '#0A0F1D',
          800: '#111827',
          700: '#1E293B',
        },
        cyan: {
          400: '#22d3ee',
          500: '#00F0FF',
          600: '#0891b2',
        },
        emerald: {
          400: '#34d399',
          500: '#10B981',
          600: '#059669',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
}
