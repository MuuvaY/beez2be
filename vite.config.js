import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), envCompatible()],
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
  },
});
