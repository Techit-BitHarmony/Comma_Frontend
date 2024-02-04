/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'], // 추가 (변경)
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')]
};