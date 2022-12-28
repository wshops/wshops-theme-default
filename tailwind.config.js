/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.html',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
