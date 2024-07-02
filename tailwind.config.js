/** @type {import('tailwindcss').Config} */

const fontFamily = require("tailwindcss/defaultTheme").fontFamily;

// console.log(fontFamily.sans);

module.exports = {
  content: ["./public/*.html", "./views/*.pug", "./*.html"],
  theme: {
    colors: {
      pri: "#39A7F7",
      sec: "#F7AA39",
      ter: "#A2865B",
      black: {
        5: "rgba(23, 27, 30, 0.05)",
        10: "rgba(23, 27, 30, 0.1)",
        25: "rgba(23, 27, 30, 0.25)",
        50: "rgba(23, 27, 30, 0.5)",
        75: "rgba(23, 27, 30, 0.75)",
        DEFAULT: "#171B1E",
      },
      white: "#fff",
      error: "#F73C39",
    },
    fontSize: {
      xs: [".75rem", { lineHeight: "1" }],
      sm: ["1rem", { lineHeight: "1.5" }],
      base: ["1.3125rem", { lineHeight: "1.5" }],
      lg: ["1.75rem", { lineHeight: "1.3" }],
      xl: ["2.315rem", { lineHeight: "1.3" }],
      '2xl': ["3.125rem", { lineHeight: "1.3" }],
      "3xl": ["4.125rem", { lineHeight: "1.3" }],
      '4xl': ["5.5rem", { lineHeight: "1.3" }],
      '5xl': ["7.5rem", { lineHeight: "1.3" }],
    },

    extend: {},
  },
  plugins: [],
};
