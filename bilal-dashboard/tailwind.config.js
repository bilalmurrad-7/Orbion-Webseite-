module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #22c55e)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
