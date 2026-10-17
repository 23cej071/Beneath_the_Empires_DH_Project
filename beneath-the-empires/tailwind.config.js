/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#F6F0E4',
        ink: '#1F1A17',
        'indigo-dye': '#2B3A67',
        madder: '#9C3B2E',
        turmeric: '#C98B1B',
        ash: '#6B645C',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
