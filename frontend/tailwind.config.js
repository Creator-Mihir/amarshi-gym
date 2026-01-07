/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'gym-black': '#0a0a0a',
          'gym-gold': '#d4af37',
          'gym-gray': '#2a2a2a',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'], 
        }
      },
    },
    plugins: [],
  }