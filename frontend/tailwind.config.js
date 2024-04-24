/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgkPrimary: "rgb(var(--color-bg-primary) / <alpha-value>)",
        bgkSecondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",

        textPrimary: "rgb(var(--color-text-primary) / <alpha-value>)",
        textSecondary: "rgb(var(--color-text-secondary) / <alpha-value>)",

        borderPrimary: "rgb(var(--color-border-primary) / <alpha-value>)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};
