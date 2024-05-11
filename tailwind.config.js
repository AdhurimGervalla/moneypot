/** @type {import('tailwindcss').Config} */
const defaultGutter = '16px';
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      margin: {
        'default': defaultGutter,
      },
      padding: {
        'default': defaultGutter,
      },
      gap: {
        'default': defaultGutter,
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        'liquid': 'repeat(auto-fill, minmax(150px, 1fr))'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // ...
  ],
}
