import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@almach/utils": path.resolve(
        __dirname,
        "../../packages/utils/src/index.ts",
      ),
      "@almach/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
      "@almach/ui/styles": path.resolve(
        __dirname,
        "../../packages/ui/src/styles/globals.css",
      ),
      "@almach/forms": path.resolve(
        __dirname,
        "../../packages/forms/src/index.ts",
      ),
      "@almach/query": path.resolve(
        __dirname,
        "../../packages/query/src/index.ts",
      ),
    },
  },
});
