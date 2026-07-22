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
        'primary-gold': '#C5A059',
        'hover-gold': '#c99f4a',
        'fra-gold': '#c19b62',
        'fra-gold-hover': '#a88554',
        'be-gold': '#D4AF37',
        'gold-primary': '#d5b263',
        'gold-bright': '#f1d48f',
        'gold-glow': 'rgba(213, 178, 99, 0.35)',
        'text-secondary': '#b0b0b0',
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
