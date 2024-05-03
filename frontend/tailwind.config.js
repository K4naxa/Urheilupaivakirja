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

        btnGray: "rgb(var(--color-gray) / <alpha-value>)",
        btnGreen: "rgb(var(--color-green) / <alpha-value>)",
        btnRed: "rgb(var(--color-red) / <alpha-value>)",
      },

      gridTemplateColumns: {
        merkInfo: "auto 1fr",
        mainPage: "repeat(3, 330px))",
        mHeader: "1fr 64px 1fr",
        regGrid: "1fr 1fr",
        toimipaikat: "2fr 1fr auto",
        teacherMobHeader: "1fr 1fr 1fr 1fr 1fr",
      },
      boxShadow: {
        "upper-shadow": "0 -10px 10px -10px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "menu-appear-right": "slideInFromRight 0.3s forwards",
        "menu-appear-middle": "slideInFromMiddle 0.3s forwards",
        "menu-appear-top": "slideInFromTop 0.3s forwards",
      },
      keyframes: {
        slideInFromRight: {
          "0%": {
            transform: "translateX(80%) translateY(100%) scale(0)",
            opacity: "0",
          },

          "100%": {
            transform: "translateX(0) translateY(0) scale(1)",
            opacity: "1",
          },
        },
        slideInFromMiddle: {
          "0%": {
            transform: "translateX(0%) translateY(100%) scale(0)",
            opacity: "0",
          },

          "100%": {
            transform: "translateX(0) translateY(0) scale(1)",
            opacity: "1",
          },
        },
        slideInFromTop: {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },

          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
