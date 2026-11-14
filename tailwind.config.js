/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nekicho: {
          bg: "#FFF3F7",
          light: "#F39ABD",
          primary: "#E33D7D",
          dark: "#A51F5E",
          surface: "#FFFFFF",
          cream: "#FFF9FA",
          subtle: "#FCE7EF",
          border: "#F7CFDE",
          text: "#3B1828",
          muted: "#8C5870",
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(227, 61, 125, 0.08)',
        'card': '0 8px 30px -4px rgba(165, 31, 94, 0.06)',
        'elevated': '0 12px 35px -6px rgba(165, 31, 94, 0.12)',
      },
      borderRadius: {
        'brand': '1.25rem',
      }
    },
  },
  plugins: [],
};
