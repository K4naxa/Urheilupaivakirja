/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "primary-dark": "#070707",
        "secondary-dark": "#101213",

        "primary-light": "#f3f4f6",
        "secondary-light": "#EEEEEE",
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
      pattern: /bg-primary-(dark|light)/,
    },
    {
      pattern: /bg-secondary-(dark|light)/,
    },
    {
      pattern: /text-primary-(dark|light)/,
    },
    {
      pattern: /text-secondary-(dark|light)/,
    },
    {
      pattern: /text-link-(dark|light)/,
    },
    {
      pattern: /border-primary-(dark|light)/,
    },
    {
      pattern: /border-secondary-(dark|light)/,
    },
  ],
  plugins: [],
};
