/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boton: 'var(--color-boton)',
        'boton-2': 'var(--color-boton-2)',
        'boton-hover': 'var(--color-boton-hover)',
        'boton-2-hover': 'var(--color-boton-2-hover)',
        'background-reg': 'var(--color-background-reg)',
        'bright-gray-50': 'var(--color-bright-gray-50)',
        'bright-gray-100': 'var(--color-bright-gray-100)',
        'bright-gray-200': 'var(--color-bright-gray-200)',
        'bright-gray-300': 'var(--color-bright-gray-300)',
        'bright-gray-400': 'var(--color-bright-gray-400)',
        'bright-gray-500': 'var(--color-bright-gray-500)',
        'bright-gray-600': 'var(--color-bright-gray-600)',
        'bright-gray-700': 'var(--color-bright-gray-700)',
        'bright-gray-800': 'var(--color-bright-gray-800)',
        'bright-gray-900': 'var(--color-bright-gray-900)',
        'bright-gray-950': 'var(--color-bright-gray-950)',
        lineas: 'var(--color-lineas)',
      },
      fontFamily: {
        adlam: ['var(--font-adlam)', 'system-ui'],
      },
    },
  },
  plugins: [],
};
