/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html, ts, js}"],
  backgroundColor: ['responsive', 'odd', 'even', 'hover', 'focus'],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class"
}