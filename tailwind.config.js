/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        stock: {
          up: '#ef4444',
          down: '#22c55e',
          neutral: '#64748b',
          primary: '#1a365d',
          secondary: '#3182ce',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
