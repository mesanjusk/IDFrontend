// tailwind.config.js

const scale = (token) => ({
  50: `var(--${token}-50)`,
  100: `var(--${token}-100)`,
  200: `var(--${token}-200)`,
  300: `var(--${token}-300)`,
  400: `var(--${token}-400)`,
  500: `var(--${token}-500)`,
  600: `var(--${token}-600)`,
  700: `var(--${token}-700)`,
  800: `var(--${token}-800)`,
  900: `var(--${token}-900)`,
});

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        gray: scale('color-gray'),
        red: scale('color-primary'),
        rose: scale('color-primary'),
        pink: scale('color-accent'),
        blue: scale('color-secondary'),
        green: scale('color-success'),
        yellow: scale('color-warning'),
        orange: scale('color-warning'),
        purple: scale('color-accent'),
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
