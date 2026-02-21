/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'verde-profundo':  '#1B6B3A',
        'verde-esperanza': '#28854A',
        'verde-accent':    '#3DA86A',
        'verde-claro':     '#E8F5EC',
        'verde-hover':     '#22733F',
        'oro':             '#C9A94E',
        'oro-claro':       '#F7F0DC',
        'gris-oscuro':     '#2C3E35',
      },
      fontFamily: {
        'sans':    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'display': ['DM Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
