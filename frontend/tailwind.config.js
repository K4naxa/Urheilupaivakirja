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

        graphPrimary: "rgb(var(--color-graph-primary) / <alpha-value>)",
        graphSecondary: "rgb(var(--color-graph-secondary) / <alpha-value>)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      gridTemplateColumns: {
        mainPage: "repeat(3, 330px))",
      },
      gridTemplateRows: {
        mainPage: "repeat(3, minmax(1fr, 330px))",
      },
    },
  },
  plugins: [],
};
