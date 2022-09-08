module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        accent: '#0D1118',
        primary: '#238636'
      }
    }
  },
  plugins: [
    // Expose Tailwind colors as CSS custom properties
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey]
          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`)
          return { ...vars, ...newVars }
        }, {})
      }
      addBase({
        ':root': extractColorVars(theme('colors'))
      })
    }
  ]
}
