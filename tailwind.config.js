/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.{html,js,ejs,j2}",
    "./assets/media/**/*.{html,js,ejs,j2}",
  ],
  prefix: 'wl-',
  theme: {
    extend: {
      screens: {
        'xl': '1200px',
        'm-xl': { 'max': '1199px' },
      },
      spacing: {
        '1.25': '0.3125rem',
        '28': '7rem',
        '52': '13rem',
        '100': '25rem',
        '128': '32rem',
        '200': '50rem',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}

