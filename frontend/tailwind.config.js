/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "primary-dark": "#070707",
        "secondary-dark": "#101213",

        "primary-light": "#f3f4f6",
        "secondary-light": "#d1d5db",
      },
      textColor: {
        "primary-dark": "#FFFFFF",
        "secondary-dark": "#676767",
        "link-dark": "#20B8BE",

        "primary-light": "#00060F",
        "secondary-light": "#676767",
        "link-light": "#20B8BE",
      },
      borderColor: {
        "primary-dark": "#00060F",
        "secondary-dark": "#676767",

        "primary-light": "#f3f4f6",
        "secondary-light": "#d1d5db",
      },
    },
  },
  safelist: [
    {
      pattern: /bg-primary-.*/,
    },
    {
      pattern: /text-primary-.*/,
    },
    {
      pattern: /border-primary-.*/,
    },
    {
      pattern: /bg-secondary-.*/,
    },
    {
      pattern: /text-secondary-.*/,
    },
    {
      pattern: /border-secondary-.*/,
    },
  ],
  plugins: [],
};
