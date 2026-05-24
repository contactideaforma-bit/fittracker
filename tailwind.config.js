/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        swim:   { DEFAULT: '#5DCAA5', light: '#E1F5EE', dark: '#085041' },
        gym:    { DEFAULT: '#7F77DD', light: '#EEEDFE', dark: '#3C3489' },
        cardio: { DEFAULT: '#EF9F27', light: '#FAEEDA', dark: '#633806' },
        boxing: { DEFAULT: '#D85A30', light: '#FAECE7', dark: '#712B13' },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
