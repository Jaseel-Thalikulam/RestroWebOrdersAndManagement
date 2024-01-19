/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundColor: {
        'black': '#000000',
        'burnt-orange': '#CD5C08',
      },
      borderColor: {
        'burnt-orange': '#CD5C08',
      },
      textColor: {
        'burnt-orange': '#CD5C08',
      },
    },
    
    screens: {
      xsm: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1580px",
    },
  },
  plugins: [],
}

