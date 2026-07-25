/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm interior-design palette (beige / cream / wood / sage / brass)
        cream: '#F7F4ED', // softer, more delicate ivory (easier on the eyes)
        sand: '#F0EADF',
        linen: '#E6DDCE',
        taupe: { light: '#D9C7AE', DEFAULT: '#C7B095', dark: '#A88E6E' },
        walnut: { DEFAULT: '#5E4632', dark: '#42301F' },
        // Refined warm-charcoal for the outer chrome (navbar/footer/dark bands)
        bark: { DEFAULT: '#3A372F', dark: '#2C2A24' },
        wood: '#8A6A4B',
        sage: { light: '#A8B59A', DEFAULT: '#869475', dark: '#5F6E4F' },
        brass: { light: '#CBA968', DEFAULT: '#B8924F', dark: '#9A7838' },
        ink: '#2A241D',
        stone: '#6B6157',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(66, 48, 31, 0.18)',
        card: '0 6px 24px -10px rgba(66, 48, 31, 0.20)',
        lift: '0 24px 60px -20px rgba(66, 48, 31, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
