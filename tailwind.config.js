/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdf9f0',
          100: '#faf0d7',
          200: '#f5e0ad',
          300: '#efcc7e',
          400: '#e8b34e',
          500: '#e09a28',
        },
        earth: {
          700: '#5c3d1e',
          800: '#3d2510',
          900: '#1e1005',
        },
        sage: {
          400: '#87a96b',
          500: '#6b8f4e',
          600: '#4a6b2e',
        },
        spice: {
          400: '#e07849',
          500: '#c8552a',
          600: '#a03b18',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
