/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#55D1F0",
        "brand-purple": "var(--clr-purple)",
        "brand-pink": "var(--clr-pink)",
        "brand-yellow": "var(--clr-yellow)",
        "brand-blue": "var(--clr-blue)",
        "brand-green": "var(--clr-green)",
        "brand-light": "var(--clr-light)",
        "brand-background": "var(--clr-background)",
      },
      animation: {
        "pulse-slow": "pulse 10s linear infinite",
      },
    },
  },
  plugins: [],
};
