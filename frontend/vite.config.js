import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPWAPlugIn)],
  server: {
    proxy: {
      "/user/login": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/user/register": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/sports": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/user/unverified": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/user": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/public": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/journal_entry": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/journal": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/public/groups": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/students": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/students/news": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },

      "/students/archive": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/students/archived": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/students/data": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/public/campuses": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/journal/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/journal/user": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});

const manifestForPWAPlugIn = {
  registerType: "prompt",
  manifest: {
    name: "Urheilupäiväkirja",
    short_name: "U-päiväkirja",
    description: "Sivu urheilusuoritusten kirjaamiseen, sekä seurantaan",
    devOptions: {
      enabled: true,
    },

    theme_color: "rgb(var(--color-primary))",
    background_color: "rgb(var(--color-bg-primary))",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};
