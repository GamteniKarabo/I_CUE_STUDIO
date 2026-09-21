import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Relative base so the built dist/ works from any path or static host. */
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
