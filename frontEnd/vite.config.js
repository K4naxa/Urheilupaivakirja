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
    },
  },
});
