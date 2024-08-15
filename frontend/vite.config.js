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
      "/courseInfo/complition_requirement": {
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
      "/spectator": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});

const manifestForPWAPlugIn = {
  includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
  registerType: "autoUpdate",
  manifest: {
    name: "Urheilupäiväkirja",
    short_name: "U-päiväkirja",
    description: "Sivu urheilusuoritusten kirjaamiseen, sekä seurantaan",
    icons: [
      {
        src: "/frontend/pwa/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/frontend/pwa/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "pwa-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "pwa-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    devOptions: {
      enabled: true,
    },
    client: {
      installPrompt: true,
    },

    theme_color: "rgb(var(--color-primary))",
    background_color: "rgb(var(--color-bg-primary))",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};
