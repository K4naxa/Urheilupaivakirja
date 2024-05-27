/** @type {import('tailwindcss').Config} */

export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primaryColor: "rgb(var(--color-primary) / <alpha-value>)",
        secondaryColor: "rgb(var(--color-secondary) / <alpha-value>)",

        // Background colors
        bgPrimary: "rgb(var(--color-bg-primary) / <alpha-value>)",
        bgSecondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",
        bgGray: "rgb(var(--color-bg-gray) / <alpha-value>)",
        // Background colors for different types of days    //Sick / Rest used in heatmaps
        bgExercise: "rgb(var(--color-bg-exercise) / <alpha-value>)",
        bgRest: "rgb(var(--color-bg-rest) / <alpha-value>)",
        bgSick: "rgb(var(--color-bg-sick) / <alpha-value>)",

        // Hover colors
        hoverDefault: "rgb(var(--color-hover-default) / <alpha-value>)",
        hoverPrimary: "rgb(var(--color-hover-primary) / <alpha-value>)",
        hoverGray: "rgb(var(--color-hover-gray) / <alpha-value>)",

        // Text colors
        textPrimary: "rgb(var(--color-text-primary) / <alpha-value>)",
        textSecondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
        // Text colors for different types of days ( used inside of a colored box)
        textExercise: "rgb(var(--color-text-exercise) / <alpha-value>)",
        textRest: "rgb(var(--color-text-rest) / <alpha-value>)",
        textSick: "rgb(var(--color-text-sick) / <alpha-value>)",

        // Border colors
        borderPrimary: "rgb(var(--color-border-primary) / <alpha-value>)",

        // Button colors
        btnGray: "rgb(var(--color-button-gray) / <alpha-value>)",
        btnGreen: "rgb(var(--color-button-green) / <alpha-value>)",
        btnRed: "rgb(var(--color-button-red) / <alpha-value>)",

        iconGray: "rgb(var(--color-icon-gray) / <alpha-value>)",
        iconGreen: "rgb(var(--color-icon-green) / <alpha-value>)",
        iconRed: "rgb(var(--color-icon-red) / <alpha-value>)",

        // Heatmap exercise colors
        heatmapExercise1: "rgb(var(--color-heatmap-exercise1) / <alpha-value>)",
        heatmapExercise2: "rgb(var(--color-heatmap-exercise2) / <alpha-value>)",
        heatmapExercise3: "rgb(var(--color-heatmap-exercise3) / <alpha-value>)",

        // Modal colors
        modalPrimary: "rgb(var(--color-modal-bg-primary) / <alpha-value>)",
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
