// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        rose: {
          700: '#B91C1C',
          200: '#FECACA',
        },
        pink: {
          50: '#FFF1F2',
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // 👈 Add this line
  ],
};
