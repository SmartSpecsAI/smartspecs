import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', 
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--bs-primary)",
        secondary: "var(--bs-secondary)",
        success: "var(--bs-success)",
        info: "var(--bs-info)",
        warning: "var(--bs-warning)",
        danger: "var(--bs-danger)",
        light: "var(--bs-light)",
        dark: "var(--bs-dark)",
        gray: {
          100: "var(--bs-gray-100)",
          200: "var(--bs-gray-200)",
          300: "var(--bs-gray-300)",
          400: "var(--bs-gray-400)",
          500: "var(--bs-gray-500)",
          600: "var(--bs-gray-600)",
          700: "var(--bs-gray-700)",
          800: "var(--bs-gray-800)",
          900: "var(--bs-gray-900)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
