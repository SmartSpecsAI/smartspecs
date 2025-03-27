import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        primary: "rgba(var(--primary))",
        secondary: "rgba(var(--secondary))",
        accent: "rgba(var(--accent))",
        success: "rgba(var(--success))",
        danger: "rgba(var(--danger))",
        warning: "rgba(var(--warning))",
        info: "rgba(var(--info))",
        text: "rgba(var(--text))",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
