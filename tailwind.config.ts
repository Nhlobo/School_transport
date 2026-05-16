import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        taxiGold: '#E8B923',
        sunsetOrange: '#F97316',
        emeraldPulse: '#10B981',
        townshipInk: '#09090B'
      },
      boxShadow: {
        glow: '0 0 40px rgba(16,185,129,0.25)'
      },
      backgroundImage: {
        neon: 'radial-gradient(circle at top right, rgba(249,115,22,0.2), rgba(16,185,129,0.15), rgba(9,9,11,1))'
      }
    }
  },
  plugins: []
};

export default config;
