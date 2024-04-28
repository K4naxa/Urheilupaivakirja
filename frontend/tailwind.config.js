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

        headerPrimary: "rgb(var(--color-header-primary) / <alpha-value>)",
        headerSecondary: "rgb(var(--color-header-secondary) / <alpha-value>)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      gridTemplateColumns: {
        merkInfo: "auto 1fr",
        mainPage: "repeat(3, 330px))",
        mHeader: "1fr 100px 1fr",
        regGrid: "1fr 1fr",
      },
      boxShadow: {
        "upper-shadow": "0 -10px 10px -10px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
