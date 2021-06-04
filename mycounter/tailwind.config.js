module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#E8AED1',
        secondary: "#F1A924",
        blue: '#273B89'
      }
    },
    screens: {},
    aspectRatio: {
      5: '5',
      18: '18',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-textshadow')
  ],
}
