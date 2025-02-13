import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', 
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007bff",
        secondary: "#6c757d", 
        success: "#28a745",
        info: "#17a2b8",
        warning: "#ffc107",
        danger: "#dc3545",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
