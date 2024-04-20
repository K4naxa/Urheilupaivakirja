import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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

      "/students/archive": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/students/archived": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/public/campuses": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
