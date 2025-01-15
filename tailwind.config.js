/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.{html,js,ejs,j2}",
    "./assets/media/**/*.{html,js,ejs,j2}",
  ],
  prefix: 'wl-',
  theme: {
    extend: {},
  },
  plugins: [],
}

