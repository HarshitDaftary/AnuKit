import { vite } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vite()],
  optimizeDeps: {
    include: ["@optimui/core", "@optimui/components"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          optimui: ["@optimui/core", "@optimui/components"],
        },
      },
    },
  },
});