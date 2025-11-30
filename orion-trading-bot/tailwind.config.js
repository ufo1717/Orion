/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.5)',
        },
        // CapWheel Enterprise Colors
        capwheel: {
          navy: '#0A1628',
          gold: '#D4AF37',
          electric: '#00D4FF',
          profit: '#00FF88',
          loss: '#FF3366',
          surface: '#111827',
          'surface-light': '#1F2937',
          'surface-dark': '#0D1117',
          border: 'rgba(212, 175, 55, 0.2)',
          'border-light': 'rgba(212, 175, 55, 0.3)',
          'border-glow': 'rgba(212, 175, 55, 0.5)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'capwheel-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'capwheel-gold-intense': '0 0 30px rgba(212, 175, 55, 0.5)',
        'capwheel-electric': '0 0 20px rgba(0, 212, 255, 0.3)',
        'capwheel-profit': '0 0 15px rgba(0, 255, 136, 0.3)',
        'capwheel-loss': '0 0 15px rgba(255, 51, 102, 0.3)',
      },
    },
  },
  plugins: [],
}
