/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          light: "#E38B75",
          DEFAULT: "#C05641",
          dark: "#9B3D2C"
        },
        mustard: {
          light: "#E9C46A",
          DEFAULT: "#E76F51", // Adjust to a nice mustard tone
          dark: "#B25E4D"
        },
        teal: {
          light: "#4FA095",
          DEFAULT: "#2A9D8F",
          dark: "#1A6B61"
        },
        charcoal: "#264653",
        "off-white": "#FDFBF7",
        artisan: {
          gold: "#D4A373",
          clay: "#A26769",
          moss: "#6B705C",
          cream: "#FAEDCD",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
