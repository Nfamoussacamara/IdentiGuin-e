/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // --- Landing Page Tokens (Do not modify) ---
        green:   { DEFAULT: '#008C44', dark: '#00592E', light: '#E6F4EA' },
        gold:    { DEFAULT: '#BFA15F', dark: '#997D40' },
        red:     { DEFAULT: '#CE1126', light: '#FDF2F2' },
        dark:    { DEFAULT: '#0D1B12', 800: '#00602A', 700: '#008F42' },
        surface: '#FFFFFF',
        bg:      '#F4F9F6',
        border:  '#D7EBE0',
        text:    { primary: '#1A2E1F', muted: '#5A7A62' },
        primary: '#008C44',
        accent:  '#BFA15F',
        danger:  '#CE1126',
        muted:   '#5A7A62',

        // --- Isolated Dashboard Tokens (AdminUIUX) ---
        dashboard: {
          bg: '#F8F7F7',
          sidebar: '#23965F',
          card: '#ffffff',
          active: '#ffce00',
          border: '#e9ecef',
        }
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'admin': '0.75rem',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
