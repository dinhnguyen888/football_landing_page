/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        fco: {
          primary: '#00e575',    // FC Online Electric Lime/Neon Green
          accent: '#0ea5e9',     // Cyan Blue
          gold: '#f59e0b',       // Golden Trophy
          dark: '#071224',       // Deep Stadium Navy
          cardBg: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Chakra Petch"', 'Rajdhani', 'Oswald', 'sans-serif'],
        oswald: ['"Chakra Petch"', 'Oswald', 'sans-serif'],
        fco: ['"Chakra Petch"', 'Rajdhani', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
