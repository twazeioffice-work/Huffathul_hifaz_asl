/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Standard Apple font stack with fallback systems
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'SFProMono-Regular',
          'Consolas',
          'Liberation Mono',
          'Menlo',
          'Courier',
          'monospace',
        ],
      },
      fontSize: {
        // Apple's precise typographic scale (Dynamic Type proportions)
        'apple-xs': ['11px', { lineHeight: '13px', letterSpacing: '0.07px' }],
        'apple-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.0px' }],
        'apple-footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px' }],
        'apple-subhead': ['15px', { lineHeight: '20px', letterSpacing: '-0.24px' }],
        'apple-body': ['17px', { lineHeight: '22px', letterSpacing: '-0.43px' }],
        'apple-title-3': ['20px', { lineHeight: '25px', letterSpacing: '-0.45px' }],
        'apple-title-2': ['22px', { lineHeight: '28px', letterSpacing: '-0.26px' }],
        'apple-title-1': ['28px', { lineHeight: '34px', letterSpacing: '0.38px' }],
        'apple-large-title': ['34px', { lineHeight: '41px', letterSpacing: '0.37px' }],
        'apple-hero': ['48px', { lineHeight: '52px', letterSpacing: '-0.003em' }],
        'apple-super-hero': ['64px', { lineHeight: '68px', letterSpacing: '-0.009em' }],
      },
      colors: {
        apple: {
          // Dark palette based on macOS / Apple.com dark mode
          black: {
            DEFAULT: '#000000',
            pure: '#000000',
            elevator: '#050506', // Frosted black container backdrops
            card: '#121214',     // Standard container gray
            hover: '#1c1c1e',    // Interactive focus
          },
          // Light palette based on iOS / macOS clean layouts
          white: {
            DEFAULT: '#ffffff',
            pure: '#ffffff',
            canvas: '#f5f5f7',
            card: '#ffffff',
            hover: '#fafafb',
          },
          // Apple's signature functional accents
          blue: {
            DEFAULT: '#0066cc',  // Apple.com standard link blue
            light: '#0071e3',
            dark: '#004499',
          },
          green: {
            DEFAULT: '#34c759',  // iOS active confirmation green
            light: '#30d158',
          },
          orange: {
            DEFAULT: '#ff9500',  // iOS warning gold
            light: '#ff9f0a',
          },
          red: {
            DEFAULT: '#ff3b30',  // iOS destructive/alert red
            light: '#ff453a',
          },
          neutral: {
            100: '#f5f5f7',
            200: '#e8e8ed',
            300: '#d2d2d7',
            400: '#86868b',      // Secondary gray caption text
            500: '#6e6e73',      // Disabled/Muted body
            600: '#424245',
            700: '#323236',
            800: '#1d1d1f',      // Dark background grey
            900: '#151516',
          }
        }
      },
      boxShadow: {
        // High-end, soft diffuse multi-layered shadows mimicking Apple hardware and cards
        'apple-low': '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
        'apple-card': '0 4px 30px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)',
        'apple-card-dark': '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        'apple-modal': '0 20px 50px rgba(0,0,0,0.15), 0 1px 10px rgba(0,0,0,0.05)',
        'apple-modal-dark': '0 30px 70px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.08)',
        // Smooth hover transition focus glows
        'apple-glow': '0 0 0 4px rgba(0,102,204,0.15)',
        'apple-glow-dark': '0 0 0 4px rgba(0,113,227,0.25)',
      },
      transitionTimingFunction: {
        // Apple's custom smooth fluid cubic-bezier curves for transitions and spring animations
        'apple-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'apple-spring': 'cubic-bezier(0.16, 1, 0.3, 1)', // Fluid iOS spring curve
        'apple-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
      },
      transitionDuration: {
        'apple-fast': '150ms',
        'apple-normal': '300ms',
        'apple-slow': '500ms',
      },
      backdropBlur: {
        'apple-blur': '20px', // Standard frosted glass blur index
      }
    },
  },
  plugins: [
    // Accommodates the custom dynamic styling properties
    function({ addUtilities }) {
      const newUtilities = {
        '.apple-glass-dark': {
          'background-color': 'rgba(10, 10, 12, 0.72)',
          'backdrop-filter': 'blur(20px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(180%)',
          'border': '1px solid rgba(255, 255, 255, 0.06)',
        },
        '.apple-glass-light': {
          'background-color': 'rgba(255, 255, 255, 0.72)',
          'backdrop-filter': 'blur(20px) saturate(190%)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(190%)',
          'border': '1px solid rgba(0, 0, 0, 0.05)',
        },
        '.text-subtle-dark': {
          'color': '#86868b',
        },
        '.text-subtle-light': {
          'color': '#6e6e73',
        }
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}
