const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Mobile-first breakpoints
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Mobile-optimized spacing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Touch-friendly minimum sizes
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [
    plugin(function({ addBase, addUtilities }) {
      addBase({
        'html': { fontSize: "16px" },
        'body': { fontSize: "16px" }
      })
      
      // Mobile-optimized utilities
      addUtilities({
        '.text-mobile-sm': {
          fontSize: '14px',
          lineHeight: '1.25',
        },
        '.text-mobile-base': {
          fontSize: '16px',
          lineHeight: '1.5',
        },
        '.text-mobile-lg': {
          fontSize: '18px',
          lineHeight: '1.4',
        },
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
        },
      })
    }),
  ],
}