/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        winx: {
          pink:   '#EC4899',
          purple: '#9333EA',
          light:  '#FDF2F8',
          dark:   '#4A044E',
          muted:  '#F3E8FF',
        },
      },
      fontFamily: {
        display: ['"Quicksand"', 'sans-serif'],
      },
      boxShadow: {
        fairy: '0 4px 24px 0 rgba(147,51,234,0.15)',
      },
    },
  },
  plugins: [],
}
