/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './domain/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: '#7C9EB2',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: '#B8A9C9',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: '#F0B7A4',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: '#FFFFFF',
        },
        mint: '#A8D5BA',
        peach: '#FFDAB9',
        lavender: '#E6E6FA',
        surface: '#F0F4F8',
        surfaceAlt: '#E8EEF4',
        text: '#2D3748',
        muted: {
          DEFAULT: '#718096',
          foreground: 'var(--muted-foreground)',
        },
      },
      boxShadow: {
        neu: '-8px -8px 20px rgba(255,255,255,.8), 8px 8px 20px rgba(163,177,198,.5)',
        'neu-sm': '-4px -4px 10px rgba(255,255,255,.72), 4px 4px 10px rgba(163,177,198,.36)',
        'neu-inset': 'inset -4px -4px 10px rgba(255,255,255,.8), inset 4px 4px 10px rgba(163,177,198,.5)',
      },
      borderRadius: {
        neu: '24px',
      },
      fontFamily: {
        heading: ['Quicksand', 'Noto Sans SC', 'sans-serif'],
        body: ['Nunito', 'Noto Sans SC', 'PingFang SC', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
