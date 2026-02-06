import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AQI Category Colors
        aqi: {
          good: '#00E400',
          moderate: '#FFFF00',
          unhealthySensitive: '#FF7E00',
          unhealthy: '#FF0000',
          veryUnhealthy: '#8F3F97',
          hazardous: '#7E0023',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
