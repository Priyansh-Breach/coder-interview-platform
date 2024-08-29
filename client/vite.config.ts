import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      // list the dependencies to include explicitly
      "@radix-ui/react-icons",
      "@radix-ui/react-menubar",
      "@mui/icons-material/WhatsApp",
      "@mui/x-data-grid",
      "@radix-ui_react-tabs",
      "@radix-ui_react-alert-dialog",
      "@radix-ui/react-progress",
      // ... other dependencies
    ],
  },
});
