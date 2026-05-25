/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#050505',
        'primary-gold': '#eab308',
        'fra-gold': '#c19b62',
        'fra-gold-hover': '#a88554',
        'be-gold': '#D4AF37',
        'gold-primary': '#d5b263',
        'gold-bright': '#f1d48f',
        'gold-glow': 'rgba(213, 178, 99, 0.35)',
        'text-secondary': '#a1a1aa',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
