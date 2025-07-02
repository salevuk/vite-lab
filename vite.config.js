import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import consoleLine from "vite-plugin-console-line";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), consoleLine({ exclude: ["node_modules"], port: 9528 })],
  base: "./",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    mimeTypes: {
      "application/javascript": ["js"],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
});
