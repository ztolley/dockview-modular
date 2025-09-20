import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "HelloPanel",
      fileName: "hello-panel",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["dockview-core"],
    },
  },
});
