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

        listExercise: "rgb(var(--color-list-exercice) / <alpha-value>)",
        listRest: "rgb(var(--color-list-rest) / <alpha-value>)",
        listSick: "rgb(var(--color-list-sick) / <alpha-value>)",

        heatmapExercise1: "rgb(var(--color-heatmap-exercise1) / <alpha-value>)",
        heatmapExercise2: "rgb(var(--color-heatmap-exercise2) / <alpha-value>)",
        heatmapExercise3: "rgb(var(--color-heatmap-exercise3) / <alpha-value>)",

        heatmapRest: "rgb(var(--color-heatmap-rest) / <alpha-value>)",
        heatmapSick: "rgb(var(--color-heatmap-sick) / <alpha-value>)",

        modalPrimary: "rgb(var(--color-modal-bg-primary) / <alpha-value>)",

        //ALTERNATIVE COLORS
        bgPrimary: "rgb(var(--color-bg-primary) / <alpha-value>)",
        bgSecondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",

        //textPrimary: "rgb(var(--color-text-primary) / <alpha-value>)",
        //textSecondary: "rgb(var(--color-text-secondary) / <alpha-value>)",

        //borderPrimary: "rgb(var(--color-border-primary) / <alpha-value>)",

        primary: "rgb(var(--color-header-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-header-secondary) / <alpha-value>)",
        sickday: "rgb(var(--color-sick) / <alpha-value>)",
        restday: "rgb(var(--color-rest) / <alpha-value>)",

        sickdayLight: "rgb(var(--color-sick-light) / <alpha-value>)",
        restdayLight: "rgb(var(--color-rest-light) / <alpha-value>)",

        sickdayDark: "rgb(var(--color-sick-dark) / <alpha-value>)",
        restdayDark: "rgb(var(--color-rest-dark) / <alpha-value>)",
      },
      gridTemplateColumns: {
        merkInfo: "auto 1fr",
        mainPage: "repeat(3, 330px))",
        mHeader: "1fr 64px 1fr",
        regGrid: "1fr 1fr",
        controlpanel3: "2fr 1fr auto",
        teacherMobHeader: "1fr 1fr 1fr 1fr 1fr",
      },
      boxShadow: {
        "upper-shadow": "0 -10px 10px -10px rgba(0, 0, 0, 0.2)",
        error: "inset 4px 0 0 -2px #ef4444",
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
        ringWidth: ["focus-visible"],
        ringColor: ["focus-visible"],
      },
    },
  },
  plugins: [],
};
