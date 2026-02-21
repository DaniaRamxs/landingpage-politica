/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'verde-esperanza': '#3D7C59',
        'verde-claro': '#E8F5E9',
        'verde-hover': '#2D5F44',
        'gris-oscuro': '#2C3E35',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
