import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      orientation: "portrait",

      manifest: {
        theme_color: "rgb(44, 114, 245)",
        background_color: "rgb(var(--color-bg-primary))",
        display: "standalone",
        scope: "/",
        start_url: "/",
        name: "Urheilupäiväkirja",
        short_name: "U-päiväkirja",
        description: "Sivu urheilusuoritusten kirjaamiseen, sekä seurantaan",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
        devOptions: {
          enabled: true,
        },
        client: {
          installPrompt: true,
        },
      },
    }),
  ],
  preview: {
    https: true,
  },
  server: {
    server: { https: true }, // Not needed for Vite 5+
    proxy: {
      "/user/login": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/courseInfo": {
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

      "/students/paginated": {
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
      "/spectator": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/activate": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
