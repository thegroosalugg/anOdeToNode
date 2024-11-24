/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.ejs'], // includes views folder and all its subfolders
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,  // Disables Tailwind's built-in styles (including reset)
  },
}
