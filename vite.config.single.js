import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

/* Produces one fully self-contained dist-single/index.html */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: "dist-single", assetsInlineLimit: 100000000, cssCodeSplit: false },
});
