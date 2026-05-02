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
          deep: '#5F8398',
          soft: 'rgba(124, 158, 178, 0.18)',
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
        surface: {
          DEFAULT: '#F0F4F8',
          alt: '#E8EEF4',
          card: '#F0F4F8',
          dark: '#4A5568',
        },
        surfaceAlt: '#E8EEF4',
        text: {
          DEFAULT: '#2D3748',
          muted: '#718096',
          subtle: '#A0AEC0',
        },
        muted: {
          DEFAULT: '#718096',
          foreground: 'var(--muted-foreground)',
          surface: '#E8EEF4',
        },
        danger: {
          DEFAULT: '#E57373',
          soft: 'rgba(229, 115, 115, 0.16)',
        },
        success: {
          DEFAULT: '#6FAF8C',
          soft: 'rgba(168, 213, 186, 0.24)',
        },
      },
      boxShadow: {
        neu: '-8px -8px 20px rgba(255,255,255,.8), 8px 8px 20px rgba(163,177,198,.5)',
        'neu-sm': '-4px -4px 10px rgba(255,255,255,.72), 4px 4px 10px rgba(163,177,198,.36)',
        'neu-inset': 'inset -4px -4px 10px rgba(255,255,255,.8), inset 4px 4px 10px rgba(163,177,198,.5)',
      },
      borderRadius: {
        neu: '24px',
        'neu-md': '20px',
        'neu-sm': '16px',
      },
      fontFamily: {
        heading: ['Quicksand', 'Noto Sans SC', 'sans-serif'],
        body: ['Nunito', 'Noto Sans SC', 'PingFang SC', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
