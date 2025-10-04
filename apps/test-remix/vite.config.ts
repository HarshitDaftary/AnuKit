import { vite } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vite()],
  optimizeDeps: {
    include: ["@anukit/core", "@anukit/components"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          anukit: ["@anukit/core", "@anukit/components"],
        },
      },
    },
  },
});