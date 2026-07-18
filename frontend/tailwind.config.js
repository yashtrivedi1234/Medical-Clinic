/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#0891b2',
          600: '#0e7490',
          700: '#155e75',
          800: '#164e63',
          900: '#134e4a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
        },
        medical: {
          blue: '#0891B2',
          teal: '#0E7490',
          green: '#16A34A',
          light: '#F0FDFA',
          muted: '#E8F1F6',
          border: '#CCFBF1',
          ink: '#134E4A',
          soft: '#64748B',
          surface: '#FFFFFF',
          deep: '#0F3D3A',
        }
      },
      fontFamily: {
        heading: ['Figtree', 'system-ui', 'sans-serif'],
        body: ['Noto Sans', 'system-ui', 'sans-serif'],
        sans: ['Noto Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(19, 78, 74, 0.08)',
        lift: '0 12px 40px -12px rgba(8, 145, 178, 0.25)',
      },
    },
  },
  plugins: [],
}
