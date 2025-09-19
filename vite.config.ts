import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import dockviewPlugins from "./vite-plugins/dockviewPlugins";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dockviewPlugins(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint . --ext .ts,.tsx",
        useFlatConfig: true,
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    target: ["chrome138"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
  },
});
