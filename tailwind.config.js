/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green:   { DEFAULT: '#008C44', dark: '#00592E', light: '#E6F4EA' }, // Vert institutionnel pur
        gold:    { DEFAULT: '#BFA15F', dark: '#997D40' }, // Or sangat neutre/beige (accent subtil)
        red:     { DEFAULT: '#CE1126', light: '#FDF2F2' }, // Rouge brique éteint (pour les alertes subtiles)
        dark:    { DEFAULT: '#0D1B12', 800: '#00602A', 700: '#008F42' }, // Vert très sombre (nuit) pour plus de profondeur
        surface: '#FFFFFF',
        bg:      '#F4F9F6',
        border:  '#D7EBE0',
        text:    { primary: '#1A2E1F', muted: '#5A7A62' },
        // Aliases pour compatibilité
        primary: '#008C44',
        accent:  '#BFA15F',
        danger:  '#CE1126',
        muted:   '#5A7A62',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
