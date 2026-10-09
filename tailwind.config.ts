import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wasabi: {
          50: "#F7F9F3",
          100: "#EAF0E6",
          200: "#D9E3D1",
          300: "#C3D1B7",
          400: "#AABF9B",
          500: "#8A9A5B",
          600: "#789262",
          700: "#63794F",
          800: "#4D5D3F",
          900: "#34402C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(77, 93, 63, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
