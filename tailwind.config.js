/** @type {import('tailwindcss').Config} */

const themeColor = require("./src/themeColors");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}"],
  // content: [],
  theme: {
    extend: {
      zIndex: {
        1300: 1300,
        1500: 1500,
      },
      colors: themeColor,
      margin: {
        76: 304,
        68: 272,
      },
      screens: {
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1630px",
      },

      dropShadow: {
        table: "10px 0 0.3px rgba(203,213,225, 0.3)",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
