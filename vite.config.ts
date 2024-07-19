import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  root: path.resolve(__dirname),
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5000,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Replace with your backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
